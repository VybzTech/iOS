import { Text as RNText, StyleSheet, TextProps } from 'react-native';
import React from 'react';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  weight = 'regular',
  color = '#000',
  children,
  style,
  ...props
}) => {
  const styles = useStyles();
  const variantStyle = styles[variant];
  const weightStyle = styles[`weight-${weight}`];

  return (
    <RNText
      style={[
        variantStyle,
        weightStyle,
        { color },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const useStyles = () => StyleSheet.create({
  // Variants
  h1: {
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
  },

  // Weights
  'weight-regular': {
    fontFamily: 'Hubot-Regular',
    fontWeight: '400',
  },
  'weight-medium': {
    fontFamily: 'Hubot-Medium',
    fontWeight: '500',
  },
  'weight-semibold': {
    fontFamily: 'Hubot-SemiBold',
    fontWeight: '600',
  },
  'weight-bold': {
    fontFamily: 'Hubot-Bold',
    fontWeight: '700',
  },
  'weight-extrabold': {
    fontFamily: 'Hubot-ExtraBold',
    fontWeight: '800',
  },
});