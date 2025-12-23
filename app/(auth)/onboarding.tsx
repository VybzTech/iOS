// Onboarding slider (3 screens)
// ==========================================

import { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { COLORS } from '@/lib/constants';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Find Your Perfect Home',
    description: 'Discover amazing properties curated just for you',
    image: require('@/assets/images/onboarding/Onboarding-1.png'),
  },
  {
    id: '2',
    title: 'Connect with Landlords',
    description: 'Chat and negotiate directly with property owners',
    image: require('@/assets/images/onboarding/Onboarding-2.png'),
  },
  {
    id: '3',
    title: 'Secure Your Rental',
    description: 'Complete verified agreements with trusted landlords',
    image: require('@/assets/images/onboarding/Onboarding-3.png'),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
  };

  const completeOnboarding = async () => {
    await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
    router.replace('/(auth)/login');
  };

  const renderSlide = ({ item }: { item: (typeof SLIDES)[0] }) => (
    <View style={{ width, flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Image source={item.image} style={{ width: 300, height: 300, marginBottom: 40 }} />
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
        {item.title}
      </Text>
      <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
        {item.description}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Skip button */}
      <TouchableOpacity
        onPress={handleSkip}
        style={{ position: 'absolute', top: 40, right: 20, zIndex: 10 }}
      >
        <Text style={{ fontSize: 16, color: COLORS.primary }}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const contentOffsetX = event.nativeEvent.contentOffset.x;
          const index = Math.round(contentOffsetX / width);
          setCurrentIndex(index);
        }}
      />

      {/* Dots */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 40 }}>
        {SLIDES.map((_, idx) => (
          <View
            key={idx}
            style={{
              width: currentIndex === idx ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: currentIndex === idx ? COLORS.primary : '#ddd',
              marginHorizontal: 4,
            }}
          />
        ))}
      </View>

      {/* Next button */}
      <TouchableOpacity
        onPress={handleNext}
        style={{
          backgroundColor: COLORS.primary,
          padding: 16,
          borderRadius: 8,
          marginHorizontal: 20,
          marginBottom: 20,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
          {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}