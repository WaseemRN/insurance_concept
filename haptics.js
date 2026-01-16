import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
};

export const triggerHeavyHaptic = () => {
  ReactNativeHapticFeedback.trigger('impactHeavy', options);
};

export default {
  triggerHeavyHaptic,
};
