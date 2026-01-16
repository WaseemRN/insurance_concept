import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, Fonts } from '../constants/theme';
import IdentityCard from '../components/IdentityCard';
import backButton from '../assets/icons/backButton.png';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const IdentitySelectionScreen = ({ navigation }) => {
  const [selectedIdentity, setSelectedIdentity] = useState(null);

  const handleNext = () => {
    if (!selectedIdentity) {
      // Don't navigate - user must select an identity first
      return;
    }

    // If identity is selected, navigate directly to IDScanScreen
    navigation.navigate('IDScan', { selectedIdentity });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <SafeAreaView style={styles.safeArea}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.5}
        >
          <View style={styles.backButtonCircle}>
            <Image
              source={backButton}
              style={styles.backButtonIcon}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.subtitleText}>Please select your identity to continue</Text>
        </View>

        {/* Cards Container */}
        <View style={styles.cardsContainer}>
          <IdentityCard
            icon="person"
            title="UAE Resident"
            subtitle="Renew Visa & Insurance"
            selected={selectedIdentity === 'uae'}
            onPress={() => setSelectedIdentity('uae')}
          />

          <IdentityCard
            icon="plane"
            title="International Traveler"
            subtitle="Instant Tourist Cover"
            selected={selectedIdentity === 'international'}
            onPress={() => setSelectedIdentity('international')}
          />

          <IdentityCard
            icon="building"
            title="Corporate Member"
            subtitle="Activate Group Policy"
            selected={selectedIdentity === 'corporate'}
            onPress={() => setSelectedIdentity('corporate')}
          />
        </View>

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.5}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  safeArea: {
    flex: 1,
  },
  backButton: {
    marginLeft: SPACING.md,
    marginTop: SPACING.sm,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonIcon: {
    width: 16,
    height: 16,
  },
  header: {
    paddingHorizontal: isTablet ? SPACING.xl * 2 : SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  welcomeText: {
    fontSize: isTablet ? 42 : FONT_SIZES.h1,
    fontFamily: Fonts.semiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitleText: {
    fontSize: isTablet ? 18 : FONT_SIZES.body,
    fontFamily: Fonts.medium,
    color: COLORS.textSecondary,
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: isTablet ? SPACING.xl * 2 : SPACING.lg,
  },
  buttonContainer: {
    paddingHorizontal: isTablet ? SPACING.xl * 2 : SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  nextButton: {
    backgroundColor: COLORS.buttonPrimary,
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: isTablet ? 18 : 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: isTablet ? '60%' : '100%',
  },
  nextButtonText: {
    color: COLORS.white,
    top:-2,
    fontSize: isTablet ? 20 : FONT_SIZES.h2,
    fontFamily: Fonts.semiBold,
  },
});

export default IdentitySelectionScreen;
