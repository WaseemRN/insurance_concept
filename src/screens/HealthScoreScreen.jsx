import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, Fonts } from '../constants/theme';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const HealthScoreScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.5}>
            <View style={styles.backButton}>
              <Text style={styles.backText}>‹</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.tierBadge}>
            <Text style={styles.tierText}>GOLD TIER</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Health Score Card */}
            <View style={styles.scoreCard}>
              <View style={styles.scoreLeft}>
                <Text style={styles.mainTitle}>Health Score</Text>
                <Text style={styles.bioScoreLabel}>Bio Score</Text>

                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreNumber}>92</Text>
                  <Text style={styles.scoreTotal}>/100</Text>
                </View>
              </View>

              {/* Body Illustration */}
              <View style={styles.bodyWrapper}>
                <View style={styles.bodyShape} />
       

                <View style={[styles.tag, styles.tagMetabolic]}>
                  <Text style={[styles.tagText, {color: '#DFB405'} ]}>Metabolic Focus</Text>
                </View>

                <View style={[styles.tag, styles.tagLung]}>
                  <Text style={[styles.tagText, {color: '#34C759'}]}>Lung Capacity</Text>
                </View>

                <View style={[styles.tag, styles.tagHeart]}>
                  <Text style={[styles.tagText, {color: '#34C759'}]}>Heart Healthy</Text>
                </View>
              </View>
            </View>

            {/* Coverage Info */}
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Excellent Health</Text>
            </View>
            <Text style={styles.coverageTitle}>
              You qualify for Instant Gold Cover
            </Text>
            <Text style={styles.coverageSubtitle}>
              Based on your Bio-Score of 92, you have unlocked gold tier
              benefits at standard rates.
            </Text>

            {/* Benefits */}
            <View style={styles.benefitSection}>
              <View style={styles.benefitCard}>
                <Text style={styles.benefitIcon}>🏥</Text>
                <Text style={styles.benefitText}>
                  Hospitalization & Emergency
                </Text>
              </View>

              <View style={styles.benefitCard}>
                <Text style={styles.benefitIcon}>🌍</Text>
                <Text style={styles.benefitText}>Global Network Access</Text>
              </View>
            </View>

            {/* Pricing */}
            <View style={styles.pricingContainer}>
              <Text style={styles.pricingLabel}>Monthly Premium</Text>
              <Text style={styles.pricingAmount}>$49.00</Text>
            </View>

            {/* CTA */}
            <TouchableOpacity
              style={styles.activateButton}
              onPress={() => navigation.navigate('Payment')}
              activeOpacity={0.5}>
              <Text style={styles.activateText}>Activate Coverage</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
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

  /* Header */
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  backText: {
    fontSize: 30,
    marginTop: -4,
    color: COLORS.textPrimary,
  },
  tierBadge: {
    borderWidth: 1,
    borderColor: '#FEE685',
    backgroundColor: '#FEF3C6',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tierText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#BB4D00',
    letterSpacing: 0.5,
  },

  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },

  /* Score Card */
  scoreCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    border: 2,
    borderColor: '#F1F5F9',
    padding: SPACING.lg,
    // shadowColor: '#000',
    // shadowOpacity: 0.08,
    // shadowRadius: 18,
    // elevation: 6,
    marginBottom: SPACING.xl,
  },
  scoreLeft: {
    flex: 1,
  },
  mainTitle: {
    fontSize: isTablet ? 34 : 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  bioScoreLabel: {
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: SPACING.sm,
  },
  scoreNumber: {
    fontSize: isTablet ? 64 : 56,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  scoreTotal: {
    fontSize: 28,
    marginLeft: 4,
    color: COLORS.textSecondary,
  },

  /* Status */
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00C853',
    marginRight: 8,
  },
  statusText: {
    color: '#00C853',
    fontWeight: '600',
  },

  /* Body */
  bodyWrapper: {
    width: 150,
    alignItems: 'center',
    position: 'relative',
  },
  bodyShape: {
    width: 90,
    height: 240,
    backgroundColor: '#2F6BFF',
    borderRadius: 45,
  },

  /* Tags */
  tag: {
    position: 'absolute',

    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 2,

    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowRadius: 6,
    // elevation: 4,/
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  tagMetabolic: {
    backgroundColor: '#FFFF5233',
    borderColor: '#DFB405',
    top: 10,
    right: -12,
  },
  tagLung: {
    backgroundColor: '#52FF6C33',
    borderColor: '#34C759',
    top: 100,
    left: -22,
  },
  tagHeart: {
    backgroundColor: '#52FF6C33',
    borderColor: '#34C759',
    bottom: 30,
    right: -12,
  },

  /* Coverage */
  coverageTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    color: COLORS.textPrimary,
  },
  coverageSubtitle: {
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },

  /* Benefits */
  benefitSection: {
    backgroundColor: '#F8FAFC',
    border: 2,
    borderColor: '#F1F5F9',
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: COLORS.white,
    padding: SPACING.md,
    // borderRadius: 16,
    marginBottom: SPACING.md,
    // elevation: 4,
  },
  benefitIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  benefitText: {
    fontSize: FONT_SIZES.body,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },

  /* Pricing */
  pricingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  pricingLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.body,
  },
  pricingAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  /* Button */
  activateButton: {
    backgroundColor: '#4338CA',
    paddingVertical: 20,
    borderRadius: 30,
    elevation: 6,
  },
  activateText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default HealthScoreScreen;