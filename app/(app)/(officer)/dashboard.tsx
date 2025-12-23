import { View, Text, StyleSheet } from 'react-native';

export default function OfficerDashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>OfficerDashboard</Text>
      <Text style={styles.subtitle}>Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    fontFamily: 'Hubot-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Hubot-Regular',
  },
});