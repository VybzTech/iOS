// App constants and styling
// ==========================================

// export const COLORS = {
//   primary: '#FFD43B', // Your company color
//   primaryDark: '#F4C430',
//   secondary: '#FF6B6B',
//   background: '#FFFFFF',
//   surface: '#F8F9FA',
//   text: '#1F2937',
//   textSecondary: '#6B7280',
//   border: '#E5E7EB',
//   success: '#10B981',
//   warning: '#F59E0B',
//   error: '#EF4444',
//   info: '#3B82F6',
// };


// export const USER_ROLES = {
//   TENANT: 'Tenant',
//   LANDLORD: 'Landlord',
//   AGENT: 'Agent',
//   OFFICER_USER: 'Officer',
//   OFFICER_ADMIN: 'Admin',
//   OFFICER_SUPER_ADMIN: 'Super Admin',
// };

  




// ==========================================
// COLORS - Based on company color #FFD43B
// ==========================================
export const COLORS = {
  // Primary Brand Colors
  primary: '#FFD43B',
  primaryDark: '#E6BF22',
  primaryLight: '#FFE066',
  primaryLighter: '#FFED99',
  primaryPale: '#FFF7D6',

  // Semantic Colors
  secondary: '#1A1A1A',
  accent: '#FF6B35',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // Neutral/UI Colors
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  backgroundTertiary: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceElevated: '#FAFAFA',

  // Text Colors
  text: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textDisabled: '#CCCCCC',
  textOnPrimary: '#1A1A1A', // Dark text on yellow background
  textOnDark: '#FFFFFF',

  // Border Colors
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  divider: '#EEEEEE',

  // Status Colors for Tiers
  tier: {
    unverified: '#999999',
    verified: '#4CAF50',
    pro: '#FFD43B',
    premium: '#FF6B35',
  },

  // Property Status
  propertyStatus: {
    active: '#4CAF50',
    inactive: '#999999',
    rented: '#2196F3',
    archived: '#757575',
  },

  // Swipe Actions
  swipe: {
    like: '#4CAF50',
    dislike: '#F44336',
    favorite: '#FFD43B',
  },

  // Dark Mode (Optional)
  dark: {
    background: '#121212',
    backgroundSecondary: '#1E1E1E',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    border: '#333333',
  },
} as const;

// ==========================================
// SPACING
// ==========================================
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// ==========================================
// TYPOGRAPHY
// ==========================================
export const TYPOGRAPHY = {
  fontFamily: {
    regular: 'HubotSans-Regular',
    medium: 'HubotSans-Medium',
    // Add other weights as available
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 48,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// ==========================================
// BORDER RADIUS
// ==========================================
export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

// ==========================================
// SHADOWS
// ==========================================
export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// ==========================================
// ANIMATION
// ==========================================
export const ANIMATION = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

// ==========================================
// BREAKPOINTS (for responsive design)
// ==========================================
export const BREAKPOINTS = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

// ==========================================
// APP CONFIGURATION
// ==========================================
export const APP_CONFIG = {
  name: 'UrbanGenie',
  version: '1.0.0',
  
  // API
  apiTimeout: 30000, // 30 seconds
  maxRetries: 3,
  
  // Storage Keys
  storageKeys: {
    authToken: '@ug_auth_token',
    refreshToken: '@ug_refresh_token',
    userId: '@ug_user_id',
    userType: '@ug_user_type',
    hasSeenOnboarding: '@ug_onboarding_complete',
    preferences: '@ug_preferences',
  },
  
  // Pagination
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
  
  // Upload limits
  upload: {
    maxImageSize: 5 * 1024 * 1024, // 5MB
    maxVideoSize: 50 * 1024 * 1024, // 50MB
    maxImagesPerProperty: 10,
    maxVideosPerProperty: 3,
    allowedImageFormats: ['image/jpeg', 'image/png', 'image/webp'],
    allowedVideoFormats: ['video/mp4', 'video/quicktime'],
  },
  
  // Onboarding
  onboarding: {
    splashScreenDuration: 3000, // 3 seconds
    totalSlides: 3,
  },
  
  // Features by Tier
  features: {
    unverified: {
      maxSwipesPerDay: 10,
      canSeeMatches: true,
      canChat: false,
      canViewLikedBy: false,
      canFavorite: false,
      canRollback: false,
    },
    verified: {
      maxSwipesPerDay: 50,
      canSeeMatches: true,
      canChat: true,
      canViewLikedBy: false,
      canFavorite: false,
      canRollback: false,
    },
    pro: {
      maxSwipesPerDay: 200,
      canSeeMatches: true,
      canChat: true,
      canViewLikedBy: true,
      canFavorite: true,
      canRollback: true,
      maxFavorites: 50,
    },
    premium: {
      maxSwipesPerDay: -1, // Unlimited
      canSeeMatches: true,
      canChat: true,
      canViewLikedBy: true,
      canFavorite: true,
      canRollback: true,
      maxFavorites: -1, // Unlimited
      prioritySupport: true,
      verifiedBadge: true,
    },
  },
} as const;

// ==========================================
// TIER INFORMATION
// ==========================================

export const TIERS = {
  UNVERIFIED: { name: 'Unverified', color: '#9CA3AF' },
  VERIFIED: { name: 'Verified', color: '#10B981' },
  PRO: { name: 'Pro', color: COLORS.primary },
  PREMIUM: { name: 'Premium', color: '#8B5CF6' },
};

export const TIER_INFO = {
  UNVERIFIED: {
    name: 'Unverified',
    description: 'Basic access to the platform',
    color: COLORS.tier.unverified,
    icon: '🔒',
    price: 0,
  },
  VERIFIED: {
    name: 'Verified',
    description: 'Identity verified user',
    color: COLORS.tier.verified,
    icon: '✓',
    price: 0,
  },
  PRO: {
    name: 'Pro',
    description: 'Enhanced features and visibility',
    color: COLORS.tier.pro,
    icon: '⭐',
    price: {
      monthly: 4999, // NGN 49.99 in cents
      annual: 49999, // NGN 499.99 in cents
    },
    features: [
      'View who liked you',
      'Favorite properties',
      'Rollback swipes',
      'Priority support',
      '200 swipes per day',
      'Up to 50 favorites',
    ],
  },
  PREMIUM: {
    name: 'Premium',
    description: 'Ultimate experience with all features',
    color: COLORS.tier.premium,
    icon: '💎',
    price: {
      monthly: 9999, // NGN 99.99 in cents
      annual: 99999, // NGN 999.99 in cents
    },
    features: [
      'Everything in Pro',
      'Unlimited swipes',
      'Unlimited favorites',
      'Verified badge',
      'Priority listings',
      '24/7 Premium support',
      'Advanced analytics',
    ],
  },
} as const;

// ==========================================
// USER ROLES
// ==========================================
export const USER_ROLES = {
  TENANT: 'TENANT',
  LANDLORD: 'LANDLORD',
  LANDLORD_AGENT: 'LANDLORD_AGENT',
  OFFICER_USER: 'OFFICER_USER',
  OFFICER_ADMIN: 'OFFICER_ADMIN',
  OFFICER_SUPER_ADMIN: 'OFFICER_SUPER_ADMIN',
} as const;

// ==========================================
// PROPERTY CONSTANTS
// ==========================================
export const PROPERTY_CONFIG = {
  minPrice: 10000, // NGN 100 in cents
  maxPrice: 100000000, // NGN 1,000,000 in cents
  minBeds: 1,
  maxBeds: 10,
  minBaths: 1,
  maxBaths: 10,
  
  amenities: [
    'WiFi',
    'Parking',
    'Security',
    'Generator',
    'Water Supply',
    'Swimming Pool',
    'Gym',
    'Elevator',
    'Balcony',
    'Garden',
    'Laundry',
    'Air Conditioning',
    'Heating',
    'Furnished',
    'Pet Friendly',
  ],
  
  visitorPolicies: [
    { value: 'STRICT', label: 'Strict - Prior approval required' },
    { value: 'MODERATE', label: 'Moderate - Reasonable hours' },
    { value: 'OPEN', label: 'Open - Anytime' },
  ],
} as const;

// ==========================================
// VALIDATION RULES
// ==========================================
export const VALIDATION = {
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: false,
  },
  phone: {
    pattern: /^(\+234|0)[789]\d{9}$/, // Nigerian phone format
    minLength: 11,
    maxLength: 14,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  nin: {
    length: 11,
    pattern: /^\d{11}$/,
  },
  bvn: {
    length: 11,
    pattern: /^\d{11}$/,
  },
} as const;

// ==========================================
// ERROR MESSAGES
// ==========================================
export const ERROR_MESSAGES = {
  auth: {
    invalidCredentials: 'Invalid email or password',
    emailExists: 'Email already exists',
    phoneExists: 'Phone number already exists',
    weakPassword: 'Password must be at least 8 characters',
    invalidEmail: 'Invalid email format',
    invalidPhone: 'Invalid phone number format',
    otpExpired: 'OTP has expired',
    otpInvalid: 'Invalid OTP',
  },
  network: {
    noConnection: 'No internet connection',
    timeout: 'Request timed out',
    serverError: 'Server error. Please try again',
  },
  validation: {
    required: 'This field is required',
    minLength: (min: number) => `Minimum ${min} characters required`,
    maxLength: (max: number) => `Maximum ${max} characters allowed`,
    invalidFormat: 'Invalid format',
  },
} as const;

// ==========================================
// SUCCESS MESSAGES
// ==========================================
export const SUCCESS_MESSAGES = {
  auth: {
    signupSuccess: 'Account created successfully!',
    loginSuccess: 'Welcome back!',
    otpSent: 'OTP sent successfully',
    passwordReset: 'Password reset successful',
  },
  profile: {
    updated: 'Profile updated successfully',
    verified: 'Verification submitted for review',
  },
  property: {
    created: 'Property listed successfully',
    updated: 'Property updated successfully',
    deleted: 'Property deleted successfully',
  },
} as const;

// ==========================================
// NAVIGATION ROUTES
// ==========================================
export const ROUTES = {
  // Auth
  AUTH_LOGIN: '/(auth)/login',
  AUTH_SIGNUP: '/(auth)/signup',
  AUTH_VERIFY_OTP: '/(auth)/verify-otp',
  AUTH_CHOOSE_ROLE: '/(auth)/choose-role',
  AUTH_BASIC_INFO: '/(auth)/basic-info',
  
  // Tenant
  TENANT_EXPLORE: '/(app)/(tenant)/explore',
  TENANT_HOMES: '/(app)/(tenant)/homes',
  TENANT_PREFERENCES: '/(app)/(tenant)/preferences',
  TENANT_PROFILE: '/(app)/(tenant)/profile',
  TENANT_MATCHES: '/(app)/(tenant)/matches',
  TENANT_LISTING_DETAIL: '/(app)/(tenant)/listing-detail',
  TENANT_CHAT: '/(app)/(tenant)/chat',
  
  // Landlord
  LANDLORD_EXPLORE: '/(app)/(landlord)/explore',
  LANDLORD_LISTINGS: '/(app)/(landlord)/listings',
  LANDLORD_PROFILE: '/(app)/(landlord)/profile',
  LANDLORD_CREATE_LISTING: '/(app)/(landlord)/create-listing',
  
  // Officer
  OFFICER_DASHBOARD: '/(app)/(officer)/dashboard',
  OFFICER_TENANTS: '/(app)/(officer)/tenants',
  OFFICER_LANDLORDS: '/(app)/(officer)/landlords',
  OFFICER_OFFICERS: '/(app)/(officer)/officers',
  
  // Settings
  SETTINGS_ACCOUNT: '/(app)/settings/account',
  SETTINGS_SECURITY: '/(app)/settings/security',
  SETTINGS_LOGOUT: '/(app)/settings/logout',
} as const;

// ==========================================
// TYPE EXPORTS
// ==========================================
export type UserRole = keyof typeof USER_ROLES;
export type TierLevel = keyof typeof TIER_INFO;
export type Route = typeof ROUTES[keyof typeof ROUTES];
