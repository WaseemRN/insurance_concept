import React, { useEffect } from 'react';
import {
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
  ImageBackground,
  View,
} from 'react-native';

import background from '../assets/images/background.png';
import logo from '../assets/icons/logo.png';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('InsuranceApproved');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground
      source={background}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" translucent />
      
      {/* Centered Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={logo}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: isTablet ? 260 : 360,
    height: isTablet ? 260 : 360,
  },
});

export default SplashScreen;
