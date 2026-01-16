import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
  Fonts,
} from '../constants/theme';

import familyImage from '../assets/images/familyImage.png';
import background from '../assets/images/background.png';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const InsuranceApprovedScreen = ({ navigation, route }) => {
  const [selectedIdentity, setSelectedIdentity] = useState(route.params?.selectedIdentity || null);

  // Update identity when route params change
  useEffect(() => {
    if (route.params?.selectedIdentity) {
      setSelectedIdentity(route.params.selectedIdentity);
    }
  }, [route.params]);

  const handleGetCovered = () => {
    if (!selectedIdentity) {
      // Show toast if no identity is selected
      // Toast.show({
      //   type: 'error',
      //   text1: 'Please select an identity',
      //   text2: 'Select any identity to continue',
      //   position: 'top',
      //   visibilityTime: 3000,
      // });
      // Navigate to IdentitySelectionScreen to select identity
      navigation.navigate('IdentitySelection');
      return;
    }

    // If identity is selected, navigate to IDScanScreen
    navigation.navigate('IDScan');
  };

  return (
    <ImageBackground
      source={background}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" translucent />

      <SafeAreaView style={styles.safeArea}>
        {/* Top Image Section */}
        <View style={styles.imageSection}>
          <Image
            source={familyImage}
            style={styles.familyImage}
            resizeMode="cover"
          />
        </View>

        {/* Content Card */}
        <View style={styles.contentCard}>
          <View style={styles.cardInner}>
            <Text style={styles.title}>Insurance Approved</Text>

            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>in </Text>
              <Text style={styles.subtitleHighlight}>60 Seconds</Text>
            </View>

            <Text style={styles.description}>
              Clinically validated. Legally binding. No paperwork.
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={handleGetCovered}
              activeOpacity={0.5}
            >
              <Text style={styles.buttonText}>Get Covered Now</Text>
            </TouchableOpacity>

            <Text style={styles.footer}>
              Powered by Global Re & HealthExchange™
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    top: isTablet ? '18%' : '8%',
  },

  /* IMAGE SECTION */
  imageSection: {
    flex: isTablet ? 0.5 : 0.5,
    width: '100%',
    // top:160,
  },
  familyImage: {
    width: '100%',
    height: '100%',
  },

  /* CARD */
  contentCard: {
    flex: isTablet ? 0.4 : 0.45,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingTop: SPACING.xl,
    paddingHorizontal: isTablet ? SPACING.xl * 2 : SPACING.md,
  },
  cardInner: {
    alignItems: 'flex-start',
  },

  title: {
    fontSize: isTablet ? 32 : FONT_SIZES.h1,
    // fontWeight: '700',
    fontFamily: Fonts.semiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitleContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: isTablet ? 28 : FONT_SIZES.h1,
    // fontWeight: '600',
    top:-10,
    fontFamily: Fonts.semiBold,
    color: COLORS.textPrimary,
  },
  subtitleHighlight: {
    fontFamily: Fonts.semiBold,
    fontSize: isTablet ? 28 : FONT_SIZES.h1,
    top:-10,
    color: COLORS.primary,
  },
  description: {
    fontSize: isTablet ? 18 : FONT_SIZES.body,
    fontFamily: Fonts.medium,

    color: COLORS.textSecondary,
    textAlign: 'left',
    marginBottom: SPACING.lg,
    // paddingHorizontal: SPACING.md,
  },

  button: {
    backgroundColor: COLORS.buttonPrimary,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.sm,
    width: isTablet ? '60%' : '100%',
    // height: isTablet ? 56 : 52,
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingVertical: 14,
  },

  buttonText: {
    color: COLORS.white,
    textAlign: 'center',
    top:-2,
    fontSize: isTablet ? 20 : FONT_SIZES.h2,
    fontFamily: Fonts.semiBold,
  },

  footer: {
    fontSize: isTablet ? 14 : FONT_SIZES.caption,
    color: COLORS.caption,
    // marginTop: SPACING.sm,
    fontFamily: Fonts.medium,
    textAlign: 'center',
    alignSelf: 'center',
  },
});

export default InsuranceApprovedScreen;
