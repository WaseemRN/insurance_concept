import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, Fonts } from '../constants/theme';
import { triggerHeavyHaptic } from '../utils/haptics';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const icons = {
  person: require('../assets/icons/idCard.png'),
  plane: require('../assets/icons/plane-solid.png'),
  building: require('../assets/icons/buildingFill.png'),
};

const IdentityCard = ({ icon, title, subtitle, onPress, selected }) => {
  const handlePress = () => {
    triggerHeavyHaptic();
    onPress?.();
  };

  return (
    <TouchableOpacity
      style={[styles.cardContainer, selected && styles.cardSelected]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, selected && styles.iconContainerSelected]}>
        <Image
          source={icons[icon]}
          style={[styles.icon, selected && styles.iconSelected]}
          resizeMode="contain"
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.title, selected && styles.titleSelected]}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '80%',
    maxWidth: isTablet ? 560 : '100%', // 🔥 narrower cards on tablet
    alignSelf: 'center',               // 🔥 center horizontally
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: isTablet ? SPACING.lg : SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    alignItems: 'center',              // 🔥 center content
    borderWidth: 1,
    borderColor: '#E6EEFF',
  },

  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FAFAFF',
  },

  iconContainer: {
    width: isTablet ? 56 : 48,
    height: isTablet ? 56 : 48,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: '#E6EEFF',
    backgroundColor: '#F8FAFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm, // 🔥 vertical stack
  },

  iconContainerSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: COLORS.primary,
  },

  icon: {
    width: isTablet ? 28 : 24,
    height: isTablet ? 28 : 24,
    tintColor:COLORS.textSecondary
  },

  iconSelected: {
    tintColor: COLORS.primary,
  },

  textContainer: {
    alignItems: 'center', // 🔥 center text
  },

  title: {
    fontSize: isTablet ? 20 : 20,
    fontFamily: Fonts.semiBold,
    color: COLORS.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },

  titleSelected: {
    color: COLORS.primary,
  },

  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: COLORS.caption,
    textAlign: 'center',
  },
});


export default IdentityCard;
