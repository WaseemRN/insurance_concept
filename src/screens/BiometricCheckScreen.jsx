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
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
  Fonts,
} from '../constants/theme';

// Import assets
import backButton from '../assets/icons/backButton.png';
import faceIcon from '../assets/icons/faceIcon.png';
import sunIcon from '../assets/icons/Sun icon.png';
import phoneIcon from '../assets/icons/phone icon.png';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const checklistItems = [
  {
    id: 1,
    icon: sunIcon,
    title: 'Well-lit environment',
    subtitle: 'Avoid strong backlight',
  },
  {
    id: 2,
    icon: phoneIcon,
    title: 'Hold phone at eye level',
    subtitle: 'Keep your hand steady',
  },
];

const BiometricCheckScreen = ({ navigation }) => {
  const handleStartScan = () => {
    console.log('Starting biometric scan...');
    navigation.navigate('LiveMesh');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

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

        {/* Content */}
        <View style={styles.content}>
          {/* Icon Container */}
          <View style={styles.iconContainer}>
            <Image
              source={faceIcon}
              style={styles.faceIconImage}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Biometric Check</Text>

          {/* Description */}
          <Text style={styles.description}>
            A quick biometric check is required to issue instant coverage.{'\n'}
            Takes less than 15 seconds.
          </Text>

          {/* Checklist Card */}
          <View style={styles.checklistCard}>
            {checklistItems.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.checklistItem,
                  index !== checklistItems.length - 1 &&
                    styles.checklistItemBorder,
                ]}
              >
                <View style={styles.checklistIconContainer}>
                  <Image
                    source={item.icon}
                    style={styles.checklistIcon}
                    resizeMode="contain"
                  />
                </View>

                <View style={styles.checklistTextContainer}>
                  <Text style={styles.checklistTitle}>
                    {item.title}
                  </Text>
                  <Text style={styles.checklistSubtitle}>
                    {item.subtitle}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Start Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartScan}
            activeOpacity={0.5}
          >
            <Text style={styles.startButtonText}>
              Start Scan
            </Text>
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
    position: 'absolute',
    top: '6%',
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
    width: 16,
    height: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: isTablet ? SPACING.xxl * 2 : SPACING.lg,
    paddingTop: isTablet
      ? SPACING.xxl * 2
      : SPACING.xxl + SPACING.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: isTablet ? 120 : 100,
    height: isTablet ? 120 : 100,
    borderRadius: isTablet ? 60 : 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  faceIconImage: {
    width: isTablet ? 60 : 50,
    height: isTablet ? 60 : 50,
  },
  title: {
    fontSize: isTablet ? 36 : FONT_SIZES.h1,
    fontFamily: Fonts.semiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: isTablet ? 18 : FONT_SIZES.body,
    fontFamily: Fonts.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: isTablet ? 26 : 24,
    marginBottom: SPACING.xl + SPACING.md,
  },
  checklistCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    width: '100%',
    maxWidth: isTablet ? 500 : 400,
    elevation: 4,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md + 4,
  },
  checklistItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  checklistIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.lightBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  checklistIcon: {
    width: 22,
    height: 22,
  },
  checklistTextContainer: {
    flex: 1,
  },
  checklistTitle: {
    fontSize: isTablet ? 18 : FONT_SIZES.body,
    fontFamily: Fonts.semiBold,
    color: COLORS.textPrimary,
  },
  checklistSubtitle: {
    fontSize: isTablet ? 15 : FONT_SIZES.bodySmall,
    fontFamily: Fonts.regular,
    color: COLORS.textSecondary,
  },
  buttonContainer: {
    paddingHorizontal: isTablet ? SPACING.xxl * 2 : SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  startButton: {
    backgroundColor: COLORS.buttonPrimary,
    paddingVertical: isTablet ? 20 : 14,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: isTablet ? 20 : FONT_SIZES.h3,
    fontFamily: Fonts.semiBold,
    color: COLORS.white,
  },
});
export default BiometricCheckScreen;