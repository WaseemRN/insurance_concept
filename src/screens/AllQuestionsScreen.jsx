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
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
  Fonts,
} from '../constants/theme';
import backButton from '../assets/icons/backButton.png';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const questions = [
  {
    id: 1,
    question:
      'Do you currently use any nicotine products (cigarettes, vaping, patches)?',
  },
  {
    id: 2,
    question: 'Have you been hospitalized in the last 24 months?',
  },
  {
    id: 3,
    question:
      'Are you currently on daily medication for blood pressure or diabetes?',
  },
  {
    id: 4,
    question:
      'Has a doctor ever recommended surgery that you have not yet had?',
  },
  {
    id: 5,
    question: 'Do you engage in high-risk sports such as racing or skydiving?',
  },
];

const AllQuestionsScreen = ({ navigation }) => {
  const [answers, setAnswers] = useState({});

  const handleAnswer = (questionId, answer) => {
    ReactNativeHapticFeedback.trigger('impactHeavy');
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleBack = () => {
    ReactNativeHapticFeedback.trigger('impactHeavy');
    navigation.goBack();
  };

  const handleContinue = () => {
    ReactNativeHapticFeedback.trigger('impactHeavy');
    console.log('All questions answered:', answers);
    navigation.navigate('OnboardingQuestion');
  };

  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <SafeAreaView style={styles.safeArea}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
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
        {/* <View style={styles.header}>
          <Text style={styles.headerTitle}>Health Questions</Text>
          <Text style={styles.headerSubtitle}>
            Answer a few quick questions
          </Text>
        </View> */}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {questions.map((item, index) => (
            <View key={item.id} style={styles.questionCard}>
              <Text style={styles.questionNumber}>{index + 1}.</Text>
              <View style={styles.questionContent}>
                <Text style={styles.questionText}>{item.question}</Text>
                <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      answers[item.id] === 'yes' && styles.toggleButtonActive,
                    ]}
                    onPress={() => handleAnswer(item.id, 'yes')}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.toggleText,
                        answers[item.id] === 'yes' && styles.toggleTextActive,
                      ]}
                    >
                      Yes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      answers[item.id] === 'no' && styles.toggleButtonActive,
                    ]}
                    onPress={() => handleAnswer(item.id, 'no')}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.toggleText,
                        answers[item.id] === 'no' && styles.toggleTextActive,
                      ]}
                    >
                      No
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !allAnswered && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            activeOpacity={0.85}
            disabled={!allAnswered}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
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

  /* BACK BUTTON */
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

  /* HEADER */
  header: {
    paddingHorizontal: isTablet ? SPACING.xl * 2 : SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },

  headerTitle: {
    fontSize: isTablet ? 42 : FONT_SIZES.h1,
    fontFamily: Fonts.semiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    includeFontPadding: false,
    lineHeight: isTablet ? 48 : 40,
  },

  headerSubtitle: {
    fontSize: isTablet ? 18 : FONT_SIZES.body,
    fontFamily: Fonts.medium,
    color: COLORS.textSecondary,
    includeFontPadding: false,
    lineHeight: isTablet ? 24 : 20,
  },

  /* SCROLL */
  scrollContent: {
    paddingHorizontal: isTablet ? SPACING.xl * 2 : SPACING.lg,
    paddingBottom: SPACING.lg,
  },

  /* QUESTION CARD */
  questionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  questionNumber: {
    fontSize: isTablet ? 18 : FONT_SIZES.body,
    fontFamily: Fonts.semiBold,
    color: COLORS.textSecondary,
    marginRight: SPACING.sm,
    includeFontPadding: false,
    lineHeight: isTablet ? 26 : 22,
  },

  questionContent: {
    flex: 1,
  },

  questionText: {
    fontSize: isTablet ? 18 : FONT_SIZES.body,
    fontFamily: Fonts.medium,
    color: COLORS.textPrimary,
    lineHeight: isTablet ? 26 : 22,
    marginBottom: SPACING.md,
    includeFontPadding: false,
  },

  /* YES / NO TOGGLES */
  toggleContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },

  toggleButton: {
    height: 40,
    minWidth: 72,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  toggleButtonActive: {
    backgroundColor: COLORS.buttonPrimary,
  },

  toggleText: {
    fontSize: isTablet ? 16 : FONT_SIZES.bodySmall,
    fontFamily: Fonts.semiBold,
    color: COLORS.textSecondary,
    includeFontPadding: false,
    lineHeight: isTablet ? 20 : 18,
    textAlignVertical: 'center',
  },

  toggleTextActive: {
    color: COLORS.white,
  },

  /* CONTINUE BUTTON */
  buttonContainer: {
    paddingHorizontal: isTablet ? SPACING.xl * 2 : SPACING.lg,
    paddingBottom: SPACING.lg,
  },

  continueButton: {
    backgroundColor: COLORS.buttonPrimary,
    borderRadius: BORDER_RADIUS.full,
    height: isTablet ? 56 : 48,
    justifyContent: 'center',
    alignItems: 'center',
  },

  continueButtonDisabled: {
    backgroundColor: '#D0D0D0',
  },

  continueButtonText: {
    color: COLORS.white,
    fontSize: isTablet ? 20 : FONT_SIZES.h2,
    fontFamily: Fonts.semiBold,
    includeFontPadding: false,
    lineHeight: isTablet ? 24 : 20,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default AllQuestionsScreen;
