import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, Fonts } from '../constants/theme';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const CoverageSuccessScreen = ({ navigation }) => {
  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddToWallet = () => {
    // Handle add to Apple Wallet
    console.log('Add to Apple Wallet');
  };

  const handleDownloadPDF = () => {
    // Handle PDF download
    console.log('Download PDF');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.safeArea}>
        {/* Top Section - Dark Background */}
        <View style={styles.topSection}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.5}>
            <View style={styles.backButtonCircle}>
              <Image
                source={require('../assets/icons/backButton.png')}
                style={styles.backButtonIcon}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>

          {/* Success Icon */}
          <View style={styles.successIconContainer}>
            <View style={styles.successIconGlow}>
              <View style={styles.successIcon}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
            </View>
          </View>

          {/* Success Message */}
          <Text style={styles.successTitle}>You are Covered!</Text>
          <Text style={styles.policyNumber}>Policy #8821-GLD-09</Text>
        </View>

        {/* Bottom Section - Light Background */}
        <View style={styles.bottomSection}>
          {/* Policy Card */}
          <View style={styles.policyCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Text style={styles.planTypeLabel}>Plan Type</Text>
                <Text style={styles.planTypeName}>GOLD STANDARD</Text>
              </View>
              <View style={styles.qrCodeContainer}>
                <View style={styles.qrCode}>
                  <Image
                    source={require('../assets/icons/QR.png')}
                    style={styles.qrImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>

            // <View style={styles.cardDivider} />

            <View style={styles.cardDetails}>
              <View style={styles.detailColumn}>
                <Text style={styles.detailLabel}>Start Date</Text>
                <Text style={styles.detailValue}>13-01-2026</Text>
              </View>
              <View style={styles.detailColumn}>
                <Text style={styles.detailLabel}>Beneficiary</Text>
                <Text style={styles.detailValue}>Alex Doe</Text>
              </View>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            {/* Add to Apple Wallet Button */}
            <TouchableOpacity
              style={styles.walletButton}
              onPress={handleAddToWallet}
              activeOpacity={0.5}
            >
              <Text style={styles.walletButtonText}>Add to Apple Wallet</Text>
            </TouchableOpacity>

            {/* Download PDF Button */}
            <TouchableOpacity
              style={styles.pdfButton}
              onPress={handleDownloadPDF}
              activeOpacity={0.5}
            >
              <Text style={styles.pdfButtonText}>Download PDF</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
  },
  topSection: {
    backgroundColor: '#040813',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl * 2,
    borderBottomLeftRadius: 70,
    borderBottomRightRadius: 70,
    alignItems: 'center',
    
  },
  backButton: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    zIndex: 10,
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
    width: 20,
    height: 20,
  },
  successIconContainer: {
    marginTop: SPACING.xxl + SPACING.md,
    marginBottom: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconGlow: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#22C55E45',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22C55E99',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 30,
  },
  successIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#00C950',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 40,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  successTitle: {
    fontSize: isTablet ? 36 : 32,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    marginBottom: SPACING.sm,
    letterSpacing: 0.3,
  },
  policyNumber: {
    fontSize: FONT_SIZES.body,
    fontFamily: Fonts.regular,
    color: '#62748E',
    letterSpacing: 0.5,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,

  },
  policyCard: {
    marginTop: -80,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
   
  },
  cardHeaderLeft: {
    flex: 1,
  },
  planTypeLabel: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  planTypeName: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  qrCodeContainer: {
    marginLeft: SPACING.md,
  },
  qrCode: {
    width: 60,
    height: 60,
    backgroundColor: '#E2E2E2',
    borderRadius: BORDER_RADIUS.sm,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrImage: {
    width: '100%',
    height: '100%',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginBottom: SPACING.lg,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailColumn: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: COLORS.textPrimary,
  },
  buttonsContainer: {
    marginTop: 'auto',
  },
  walletButton: {
    backgroundColor: '#3D28DE',
    paddingVertical: isTablet ? 20 : 18,
    paddingHorizontal: SPACING.xxl,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  walletButtonText: {
    color: COLORS.white,
    fontSize: isTablet ? 20 : FONT_SIZES.h3,
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  pdfButton: {
    backgroundColor: '#EAEAEA',
    paddingVertical: isTablet ? 20 : 18,
    paddingHorizontal: SPACING.xxl,
    borderRadius: BORDER_RADIUS.full,
  },
  pdfButtonText: {
    color: COLORS.textSecondary,
    fontSize: isTablet ? 20 : FONT_SIZES.h3,
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

export default CoverageSuccessScreen;