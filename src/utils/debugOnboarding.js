// Debug utility to check onboarding data
// Use this in browser console: window.debugOnboarding()

import { onboardingStorage } from './onboardingStorage.js';

const debugOnboarding = () => {
  const data = onboardingStorage.getAll();
  const validation = onboardingStorage.validate();
  
  console.group('🔍 Onboarding Debug Info');
  console.log('📦 Stored Data:', data);
  console.log('✅ Validation:', validation);
  
  if (validation.isValid) {
    try {
      const payload = onboardingStorage.buildPayload();
      console.log('📤 Generated Payload:', payload);
    } catch (error) {
      console.error('❌ Payload Generation Error:', error);
    }
  } else {
    console.warn('⚠️ Missing required fields:', validation.missingFields);
  }
  
  console.groupEnd();
  
  return { data, validation };
};

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  window.debugOnboarding = debugOnboarding;
}

export default debugOnboarding;

