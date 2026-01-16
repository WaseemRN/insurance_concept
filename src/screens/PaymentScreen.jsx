import React from 'react';
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

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const PaymentScreen = ({ navigation }) => {
  const handleBack = () => {
    navigation.goBack();
  };

  const handlePay = () => {
    // Handle payment
    console.log('Process payment');
    navigation.navigate('CoverageSuccess');
  };

  const handleApplePay = () => {
    console.log('Apple Pay selected');
  };

  const handleCreditCard = () => {
    console.log('Credit Card selected');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <SafeAreaView style={styles.safeArea}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
                activeOpacity={0.5}>
          <View style={styles.backButtonCircle}>
            <Image
              source={require('../assets/icons/backButton.png')}
              style={styles.backButtonIcon}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Title */}
            <Text style={styles.title}>One-Tap Activation</Text>

            {/* Payment Methods */}
            <View style={styles.paymentMethods}>
              {/* Apple Pay */}
              <TouchableOpacity
                style={styles.applePayButton}
                onPress={handleApplePay}
                activeOpacity={0.5}>
                <Image
                  source={require('../assets/apple.png')}
                  style={styles.appleIcon}
                  resizeMode="contain"
                />
                <Text style={styles.applePayText}>Apple Pay</Text>
              </TouchableOpacity>

              {/* Credit Card */}
              <TouchableOpacity
                style={styles.creditCardButton}
                onPress={handleCreditCard}
                activeOpacity={0.5}>
                <View style={styles.creditCardIconContainer}>
                  <Text style={styles.creditCardIcon}>💳</Text>
                </View>
                <Text style={styles.creditCardText}>Credit Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Section - Fixed */}
        <View style={styles.bottomSection}>
          {/* Total Due */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total due today</Text>
            <Text style={styles.totalAmount}>$49.00</Text>
          </View>

          {/* Pay Button */}
          <TouchableOpacity
            style={styles.payButton}
            onPress={handlePay}
            activeOpacity={0.5}>
            <Text style={styles.payButtonText}>Pay</Text>
          </TouchableOpacity>
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
  backButton: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    zIndex: 10,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    top:30,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonIcon: {
    width: 20,
    height: 20,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: isTablet ? SPACING.xxl * 2 : SPACING.lg,
    paddingTop: SPACING.xxl + SPACING.lg,
  },
  title: {
    fontSize: isTablet ? 36 : 32,
    fontFamily: Fonts.semiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
    letterSpacing: 0.3,
  },
  paymentMethods: {
    marginBottom: SPACING.xl,
  },
  applePayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFF',
    borderRadius: 10,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  appleIcon: {
    width: 28,
    height: 28,
    marginRight: SPACING.md,
  },
  applePayText: {
    fontSize: FONT_SIZES.body,
    fontFamily: Fonts.medium,
    color: '#62748E',
  },
  creditCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFF',
    borderRadius: 10,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  creditCardIconContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  creditCardIcon: {
    fontSize: 20,
  },
  creditCardText: {
    fontSize: FONT_SIZES.body,
    fontFamily: Fonts.medium,
    color: '#62748E',
  },
  bottomSection: {
    paddingHorizontal: isTablet ? SPACING.xxl * 2 : SPACING.lg,
    paddingBottom: SPACING.lg,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.background,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  totalLabel: {
    fontSize: FONT_SIZES.body,
    fontFamily: Fonts.regular,
    color: COLORS.textSecondary,
  },
  totalAmount: {
    fontSize: isTablet ? 32 : 28,
    fontFamily: Fonts.bold,
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  payButton: {
    backgroundColor: '#3D28DE',
    paddingVertical: isTablet ? 20 : 18,
    paddingHorizontal: isTablet ? SPACING.xxl * 2 : SPACING.xxl,
    borderRadius: BORDER_RADIUS.full,
    width: '100%',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  payButtonText: {
    color: COLORS.white,
    fontSize: isTablet ? 20 : FONT_SIZES.h3,
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

export default PaymentScreen;