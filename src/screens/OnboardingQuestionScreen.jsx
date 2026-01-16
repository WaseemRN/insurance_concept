import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, Fonts } from '../constants/theme';
import backButton from '../assets/icons/backButton.png';
import verifiedIcon from '../assets/icons/verifiedIcon.png';
import { onboardingQuestions, TOTAL_QUESTIONS } from '../data/onboardingQuestions';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const OnboardingQuestionScreen = ({ route, navigation }) => {
  const { questionIndex = 0 } = route.params || {};
  const [currentIndex, setCurrentIndex] = useState(questionIndex);
  const [answers, setAnswers] = useState({});

  const currentQuestion = onboardingQuestions[currentIndex];

  const handleAnswer = (answer) => {
    // Save answer
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: answer,
    };
    setAnswers(newAnswers);

    // Move to next question or finish
    if (currentIndex < TOTAL_QUESTIONS - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // All questions completed - navigate to BiometricCheck screen
      console.log('Onboarding completed with answers:', newAnswers);
      navigation.navigate('BiometricCheck');
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      navigation.goBack();
    }
  };

  if (!currentQuestion) {
    return null;
  }

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

        {/* Segmented Progress Bar */}
        <View style={styles.progressBarContainer}>
          {Array.from({ length: TOTAL_QUESTIONS }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressSegment,
                index === currentIndex ? styles.progressSegmentActive : styles.progressSegmentInactive,
              ]}
            />
          ))}
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Question Text */}
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </View>

          {/* Verification Badge */}
          <View style={styles.verificationBadge}>
            <Image
              source={verifiedIcon}
              style={styles.verifiedIconImage}
              resizeMode="contain"
            />
            <Text style={styles.verificationText}>
              {currentQuestion.verificationText}
            </Text>
          </View>

          {/* Illustration Container */}
          <View style={styles.illustrationContainer}>
            <View
              style={
                styles.illustrationPlaceholder
              }
            >
              {currentQuestion.illustration && (
                <Image
                  source={currentQuestion.illustration}
                  style={styles.illustrationImage}
                  resizeMode="contain"
                />
              )}
            </View>
          </View>
        </ScrollView>

        {/* Answer Buttons */}
        <View style={styles.buttonsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.answerButton,
                index === 0 ? styles.primaryButton : styles.secondaryButton
              ]}
              onPress={() => handleAnswer(option.value)}
              activeOpacity={0.5}
            >
              <Text
                style={[
                  styles.answerButtonText,
                  index === 0 ? styles.primaryButtonText : styles.secondaryButtonText
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
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
  progressBarContainer: {
    flexDirection: 'row',
    paddingHorizontal: isTablet ? SPACING.xxl * 3 : SPACING.lg,
    paddingTop: SPACING.xxl + SPACING.md,
    paddingBottom: SPACING.md,
    gap: 8,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  progressSegmentActive: {
    backgroundColor: COLORS.progressActive,
  },
  progressSegmentInactive: {
    backgroundColor: COLORS.progressInactive,
  },
  scrollContent: {
    paddingHorizontal: isTablet ? SPACING.xxl * 2 : SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  questionText: {
    fontSize: isTablet ? 36 : FONT_SIZES.h3,
    fontFamily: Fonts.semiBold,
    color: COLORS.textPrimary,
    // letterSpacing: 0.2,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    top:18,
    backgroundColor:'#F7FAFF',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 10,
    borderWidth:1,
    borderColor:'#DBEAFE',
    marginBottom: SPACING.xl,
    alignSelf: 'flex-start',
  },
  verifiedIconImage: {
    width: 26,
    height: 26,
    marginRight: SPACING.sm,
  },
  verificationText: {
    fontSize: isTablet ? 18 : FONT_SIZES.body,
    fontFamily: Fonts.medium,
    color: COLORS.textSecondary,
    flex: 1,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SPACING.xl,
    minHeight: isTablet ? 400 : 280,
  },
  illustrationPlaceholder: {
    width: isTablet ? 380 : 380,
    height: isTablet ? 380 : 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
  buttonsContainer: {
    paddingHorizontal: isTablet ? SPACING.xxl * 2 : SPACING.lg,
    // paddingBottom: SPACING.xl,
    // gap: SPACING.md,
  },
  answerButton: {
    paddingVertical: isTablet ? 20 : 14,
    paddingHorizontal: isTablet ? SPACING.xxl * 2 : SPACING.xxl,
    borderRadius: BORDER_RADIUS.full,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: COLORS.buttonPrimary,
    marginBottom: SPACING.sm,
  },
  secondaryButton: {
    backgroundColor: COLORS.buttonSecondary,
    marginBottom: SPACING.md,
  },
  answerButtonText: {
    fontSize: isTablet ? 20 : FONT_SIZES.h3,
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  primaryButtonText: {
    color: COLORS.white,
  },
  secondaryButtonText: {
    color: COLORS.textPrimary,
  },
});

export default OnboardingQuestionScreen;
