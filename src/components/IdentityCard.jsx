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

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const icons = {
  person: require('../assets/icons/Profile.png'),
  plane: require('../assets/icons/plane-solid.png'),
  building: require('../assets/icons/buildingFill.png'),
};

const IdentityCard = ({ icon, title, subtitle, onPress, selected }) => {
  return (
    <TouchableOpacity
      style={[styles.cardContainer, selected && styles.cardSelected]}
      onPress={onPress}
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: isTablet ? SPACING.lg : 18,
    paddingHorizontal: isTablet ? SPACING.lg : SPACING.md,
    marginBottom: SPACING.sm + 4,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FAFAFF',
  },
  iconContainer: {
    width: isTablet ? 52 : 40,
    height: isTablet ? 52 : 40,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md - 2,
  },
  iconContainerSelected: {
    backgroundColor: '#EEF2FF',
  },
  icon: {
    width: isTablet ? 24 : 20,
    height: isTablet ? 24 : 20,
    tintColor: COLORS.textPrimary,
  },
  iconSelected: {
    tintColor: COLORS.primary,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: isTablet ? FONT_SIZES.h3 : FONT_SIZES.body,
    fontFamily: Fonts.semiBold,
    color: COLORS.textPrimary,
    marginBottom: 1,
  },
  titleSelected: {
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: isTablet ? FONT_SIZES.bodySmall : FONT_SIZES.caption,
    fontFamily: Fonts.regular,
    color: COLORS.caption,
  },
});

export default IdentityCard;
