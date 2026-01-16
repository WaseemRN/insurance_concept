import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, Fonts } from '../constants/theme';
import AppleWatchImage from '../assets/images/AppleWatch.png';
import backButton from '../assets/icons/backButton.png';
const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

const ConnectWatchScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(height));

  useEffect(() => {
    if (modalVisible) {
      // Reset animation value and animate in
      slideAnim.setValue(height);
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }).start();
      }, 50);
    } else {
      // Reset to off-screen when closed
      slideAnim.setValue(height);
    }
  }, [modalVisible]);

  const handleConnectDevice = () => {
    // Show modal with connection guide
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };


  const handleSkip = () => {
    // Skip to onboarding questions
    navigation.navigate('OnboardingQuestion', { questionIndex: 0 });
  };

  const handleProceed = () => {
    // Close modal and navigate to onboarding questions
    handleCloseModal();
    setTimeout(() => {
      navigation.navigate('OnboardingQuestion', { questionIndex: 0 });
    }, 300);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <SafeAreaView style={styles.safeArea}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.5}>
          <View style={styles.backButtonCircle}>
            <Image
              source={backButton}
              style={styles.backButtonText}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>

        {/* Content Container */}
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Connect Your Watch</Text>
            <Text style={styles.subtitle}>
              Boost your Bio-Score, unlock instant discounts, and automate claims with real-time health data.
            </Text>
          </View>

          {/* Watch Image Container */}
          <View style={styles.watchContainer}>
            {/* Placeholder for Apple Watch image */}
            <View style={styles.watchImage}>
              <Image source={AppleWatchImage} 
                style={styles.watchImage}
              />
            </View>
          </View>

          {/* Buttons Container */}
          <View style={styles.buttonsContainer}>
            {/* Connect Device Button */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleConnectDevice}
              activeOpacity={0.5}
            >
              <Text style={styles.primaryButtonText}>Connect Device</Text>
            </TouchableOpacity>

            {/* Skip Button */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSkip}
              activeOpacity={0.5}
            >
              <Text style={styles.secondaryButtonText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Connection Guide Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={handleCloseModal}
          />
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.modalSafeArea}>
              {/* Modal Handle */}
              <View style={styles.modalHandle} />

              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>How to Connect Your Watch</Text>
              </View>

              {/* Connection Guide - Bullet Points */}
              <ScrollView
                style={styles.modalScrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
              >
                <View style={styles.guideContainer}>
                  <View style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>
                      Ensure your smartwatch is charged and powered on
                    </Text>
                  </View>

                  <View style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>
                      Enable Bluetooth on your phone in Settings
                    </Text>
                  </View>

                  <View style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>
                      Open the Watch app on your phone and tap "Pair New Watch"
                    </Text>
                  </View>

                  <View style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>
                      Position your phone near the watch and follow on-screen instructions
                    </Text>
                  </View>

                  <View style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>
                      Grant necessary permissions for health data access
                    </Text>
                  </View>

                  <View style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>
                      Wait for the connection to complete and verify sync status
                    </Text>
                  </View>
                </View>
              </ScrollView>

              {/* Proceed Button - Outside ScrollView to always be visible */}
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.modalProceedButton}
                  onPress={handleProceed}
                  activeOpacity={0.5}
                >
                  <Text style={styles.modalProceedButtonText}>Proceed</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: '6%',
    left: SPACING.md,
    // zIndex: 100,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  backButtonText: {
    width: 16,
    height: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: isTablet ? SPACING.xxl * 2 : SPACING.md,
    paddingTop: SPACING.xxl,
  },
  header: {
    // alignItems: 'center',
    // marginBottom: SPACING.xl,
  },
  title: {
    fontSize: isTablet ? 36 : FONT_SIZES.h1,
    fontFamily:Fonts.semiBold,
    color: COLORS.textPrimary,
    // textAlign: 'center',
    marginBottom: SPACING.md,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: isTablet ? 18 : FONT_SIZES.body,
    fontFamily:Fonts.medium,
    color: COLORS.textSecondary,
    // textAlign: 'center',
    // lineHeight: isTablet ? 28 : 24,
    // paddingHorizontal: isTablet ? SPACING.xxl : SPACING.md,
  },
  watchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginVertical: SPACING.xl,
  },

  watchImage: {
    width: isTablet ? 400 : 380,
    height: isTablet ? 400 : 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.buttonPrimary,
    paddingVertical: isTablet ? 20 : 14,
    paddingHorizontal: isTablet ? SPACING.xxl * 2 : SPACING.xxl,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.sm,
    width: isTablet ? '60%' : '100%',
   
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: isTablet ? 20 : FONT_SIZES.h3,
    fontFamily:Fonts.semiBold,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    backgroundColor: COLORS.buttonSecondary,
    paddingVertical: isTablet ? 20 : 14,
    paddingHorizontal: isTablet ? SPACING.xxl * 2 : SPACING.xxl,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.md,
    width: isTablet ? '60%' : '100%',
  },
  secondaryButtonText: {
    color: COLORS.textPrimary,
    fontSize: isTablet ? 20 : FONT_SIZES.h3,
    fontFamily:Fonts.semiBold,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: height * 0.68,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalSafeArea: {
    height: '100%',
    paddingBottom: SPACING.sm,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.progressInactive,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  modalHeader: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.progressInactive,
  },
  modalTitle: {
    fontSize: isTablet ? 22 : FONT_SIZES.h1,
    fontFamily: Fonts.semiBold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  modalScrollView: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  scrollContent: {
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  guideContainer: {
    paddingBottom: SPACING.sm,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: FONT_SIZES.h2,
    color: COLORS.primary,
    marginRight: SPACING.md,
    fontFamily: Fonts.semiBold,
    lineHeight: 24,
  },
  bulletText: {
    flex: 1,
    fontSize: FONT_SIZES.body,
    fontFamily: Fonts.regular,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  modalButtonContainer: {
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.progressInactive,
  },
  modalProceedButton: {
    backgroundColor: COLORS.buttonPrimary,
    paddingVertical: isTablet ? 18 : 14,
    paddingHorizontal: isTablet ? SPACING.xxl * 2 : SPACING.xxl,
    borderRadius: BORDER_RADIUS.full,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalProceedButtonText: {
    color: COLORS.white,
    fontSize: isTablet ? 20 : FONT_SIZES.h3,
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

export default ConnectWatchScreen;
