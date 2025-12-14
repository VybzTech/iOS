// import { useAuth as useClerkAuth } from '@clerk/clerk-expo';
// import { useEffect, useState } from 'react';
// import * as SecureStore from 'expo-secure-store';

// export function useAuth() {
//   const { isSignedIn, getToken } = useClerkAuth();
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const setupAuth = async () => {
//       try {
//         if (isSignedIn) {
//           const token = await getToken();
//           if (token) {
//             await SecureStore.setItemAsync('jwt_token', token);
//           }
//         } else {
//           await SecureStore.deleteItemAsync('jwt_token');
//         }
//       } catch (err) {
//         console.error('Auth setup error:', err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     setupAuth();
//   }, [isSignedIn, getToken]);

//   return {
//     isSignedIn: !!isSignedIn,
//     isLoading,
//   };
// }



import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

