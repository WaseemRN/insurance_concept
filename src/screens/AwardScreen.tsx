import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  ScrollView,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, FONT_SIZES, SPACING, Fonts } from '../constants/theme';
// Using ScrollView instead of carousel to avoid initialization errors

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

// Gradient Text Component with proper sizing - using theme colors
const GradientText: React.FC<{ style?: any; colors?: string[]; children: React.ReactNode }> = ({
  style,
  colors = ['#FFFFFF', '#3D28DE', '#6B5CE6', '#9D8DFF'],
  children,
}) => {
  let textStyle: any = {};
  
  try {
    if (style) {
      if (Array.isArray(style)) {
        // Filter out any undefined/null values before flattening
        const validStyles = style.filter(s => s != null);
        if (validStyles.length > 0) {
          const flattened = StyleSheet.flatten(validStyles);
          textStyle = flattened || {};
        } else {
          textStyle = {};
        }
      } else if (typeof style === 'object') {
        textStyle = style;
      }
    }
  } catch (error) {
    console.warn('Error processing style in GradientText:', error);
    textStyle = {};
  }
  
  const textString = typeof children === 'string' ? children : String(children);
  
  // Use alignSelf from style if provided, otherwise default to flex-start
  const alignSelf = textStyle?.alignSelf || 'flex-start';
  
  // Ensure textStyle is always an object
  const safeTextStyle = textStyle && typeof textStyle === 'object' ? textStyle : {};
  
  // Fallback to regular text if MaskedView fails
  const fallbackColorValue = colors[0] || '#FFFFFF';
  try {
    return (
      <View style={{ alignSelf }}>
        <MaskedView
          style={{ 
            alignSelf,
          }}
          maskElement={
            <Text style={safeTextStyle || {}}>{textString}</Text>
          }
        >
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={[safeTextStyle || {}, { opacity: 0 }]}>{textString}</Text>
          </LinearGradient>
        </MaskedView>
      </View>
    );
  } catch (error) {
    // Fallback to regular text with first gradient color
    return (
      <Text style={[{ color: fallbackColorValue }, safeTextStyle || {}]}>
        {textString}
      </Text>
    );
  }
};

interface Tier {
  name: string;
  bioScore: number;
  riskLevel: string;
  price: string;
  color: string;
}

const TIERS: Tier[] = [
  {
    name: 'SILVER',
    bioScore: 75,
    riskLevel: 'Medium',
    price: 'AED 180 / Month',
    color: '#C0C0C0',
  },
  {
    name: 'GOLD',
    bioScore: 92,
    riskLevel: 'Low',
    price: 'AED 320 / Month',
    color: '#FFD700',
  },
  {
    name: 'PLATINUM',
    bioScore: 98,
    riskLevel: 'Very Low',
    price: 'AED 550 / Month',
    color: '#E5E4E2',
  },
];

// Define styles BEFORE the component to ensure they're available
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  carouselItem: {
    width: isTablet ? Math.min(width - 120, 600) : width - 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isTablet ? SPACING.xxl * 2 : SPACING.lg,
    paddingTop: isTablet ? SPACING.md : SPACING.sm,
    paddingBottom: isTablet ? SPACING.sm : SPACING.xs,
    marginBottom: SPACING.xs,
  },
  backButton: {
    marginRight: SPACING.md,
    marginTop: SPACING.sm,
  },
  backButtonCircle: {
    width: isTablet ? 48 : 40,
    height: isTablet ? 48 : 40,
    borderRadius: isTablet ? 24 : 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButtonIcon: {
    width: isTablet ? 24 : 20,
    height: isTablet ? 24 : 20,
  },
  headerText: {
    fontSize: isTablet ? 28 : FONT_SIZES.h2,
    fontFamily: Fonts.bold,
    color: COLORS.white,
    flex: 1,
    textAlign: 'left',
  },
  tierSliderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    gap: 15,
  },
  tierCard: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    opacity: 0.6,
  },
  tierCardActive: {
    opacity: 1,
    backgroundColor: `rgba(218, 165, 32, 0.2)`, // Glossy gold with opacity
    borderColor: '#DAA520',
    shadowColor: '#DAA520',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
  },
  tierCardText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  tierCardTextActive: {
    color: '#DAA520',
    fontWeight: 'bold',
  },
  glossyCardContainer: {
    width: isTablet ? Math.min(width - (SPACING.xxl * 4), 550) : width - (SPACING.lg * 4),
    marginBottom: SPACING.xl,
    marginRight: 0,
    marginLeft: 0,
    marginTop: 0,
    position: 'relative',
  },
  outerCard: {
    borderRadius: 30,
    borderWidth: 2, 
    padding: 3,
    borderColor: `rgba(184, 134, 11, 0.5)`, // Darker gold
    backgroundColor: `rgba(184, 134, 11, 0.15)`, // Subtle gold background
    shadowColor: `rgba(218, 165, 32, 0.6)`,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 12,
  },
  outerCardActive: {
    borderColor: `rgba(218, 165, 32, 0.8)`, // Glossy gold for active
    backgroundColor: `rgba(218, 165, 32, 0.3)`, // Glossy gold background
    shadowColor: `rgba(255, 215, 0, 0.8)`,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 35,
    elevation: 30,
    borderWidth: 3,
    padding: 4,
  },
  glossyCard: {
    borderRadius: 28,
    padding: 0,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 200,
    backgroundColor: 'rgba(139, 117, 78, 0.7)', // Darker, more muted gold background
    borderWidth: 2,
    borderColor: `rgba(184, 134, 11, 0.6)`, // Darker gold border
  },
  glossyCardActive: {
    backgroundColor: 'rgba(160, 140, 90, 0.8)', // Glossy gold for active card
    borderColor: `rgba(218, 165, 32, 0.9)`, // Glossy gold for active
    borderWidth: 3,
  },
  cardBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  starburstEffect: {
    position: 'absolute',
    width: 140,
    height: 140,
    left: '50%',
    top: '15%',
    marginLeft: -30,
    marginTop: -70,
    borderRadius: 70,
    backgroundColor: `rgba(218, 165, 32, 0.3)`, // Glossy gold
    shadowColor: `rgba(255, 215, 0, 0.7)`,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 45,
    transform: [{ scale: 1.3 }],
  },
  starburstEffectActive: {
    backgroundColor: `rgba(255, 215, 0, 0.4)`, // Glossy gold for active
    shadowColor: `rgba(255, 223, 0, 0.9)`,
    shadowOpacity: 0.9,
    shadowRadius: 70,
    transform: [{ scale: 1.6 }],
  },
  particleContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  particle: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: `rgba(218, 165, 32, 0.8)`, // Glossy gold
    shadowColor: `rgba(255, 215, 0, 0.9)`,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 3,
  },
  particleActive: {
    backgroundColor: `rgba(255, 215, 0, 0.9)`, // Glossy gold for active
    shadowColor: `rgba(255, 223, 0, 1)`,
    shadowOpacity: 0.9,
    shadowRadius: 5,
    width: 3,
    height: 3,
  },
  tierNameSection: {
    width: '100%',
    height: 65,
    backgroundColor: `rgba(184, 134, 11, 0.4)`, // Glossy gold
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    paddingVertical: SPACING.sm,
    position: 'relative',
    overflow: 'hidden',
  },
  tierNameSectionActive: {
    backgroundColor: `rgba(218, 165, 32, 0.6)`, // Glossy gold for active
  },
  tierNameGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `rgba(184, 134, 11, 0.25)`, // Glossy gold
    shadowColor: `rgba(218, 165, 32, 0.7)`,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
  },
  tierNameGlowActive: {
    backgroundColor: `rgba(218, 165, 32, 0.4)`, // Glossy gold for active
    shadowColor: `rgba(255, 215, 0, 0.9)`,
    shadowOpacity: 0.9,
    shadowRadius: 35,
  },
  cardSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,   
    backgroundColor: `rgba(184, 134, 11, 0.15)`, // Glossy gold
  },
  cardSectionActive: {
    backgroundColor: `rgba(218, 165, 32, 0.25)`, // Glossy gold for active
  },
  tierName: {
    fontSize: isTablet ? 42 : FONT_SIZES.h1,
    fontFamily: Fonts.bold,
    alignSelf: 'center',
    color: '#FFFFFF', // Pure white for maximum contrast
    textAlign: 'center',
    letterSpacing: isTablet ? 3 : 2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)', // Dark shadow for better readability
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  separator: {
    height: 1,
    backgroundColor: `rgba(184, 134, 11, 0.6)`, // Glossy gold
    shadowColor: `rgba(218, 165, 32, 0.8)`,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  separatorActive: {
    backgroundColor: `rgba(218, 165, 32, 0.9)`, // Glossy gold for active
    height: 2,
    shadowColor: `rgba(255, 215, 0, 0.9)`,
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  shieldBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `rgba(184, 134, 11, 0.35)`, // Glossy gold
    borderWidth: 1.5,
    borderColor: `rgba(218, 165, 32, 0.8)`, // Glossy gold
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    shadowColor: `rgba(255, 215, 0, 0.8)`,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  shieldBadgeActive: {
    backgroundColor: `rgba(218, 165, 32, 0.5)`, // Glossy gold for active
    borderColor: `rgba(255, 215, 0, 0.9)`,
    shadowColor: `rgba(255, 223, 0, 0.9)`,
    shadowOpacity: 0.9,
    shadowRadius: 12,
    borderWidth: 2,
  },
  checkmarkIcon: {
    color: `rgba(255, 248, 220, 1)`, // Light cream for contrast
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricText: {
    fontSize: FONT_SIZES.body,
    fontFamily: Fonts.regular,
    color: '#FFFFFF', // Pure white for maximum contrast
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  metricValue: {
    fontWeight: '600',
  },
  riskLowText: {
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: FONT_SIZES.h3,
    fontFamily: Fonts.semiBold,
    alignSelf: 'center',
    textAlign: 'center',
    letterSpacing: 1,
    color: '#FFFFFF', // Pure white for maximum contrast
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  applePayButton: {
    width: isTablet ? '40%' : width - (SPACING.lg * 2),
    height: isTablet ? 70 : 60,
    backgroundColor: COLORS.primary,
    borderRadius: isTablet ? 35 : 30,
    borderWidth: 1,
    borderColor: `rgba(61, 40, 222, 0.5)`, // COLORS.primary with opacity
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: SPACING.xxl,
    marginHorizontal: isTablet ? 0 : SPACING.lg,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 12,
  },
  applePayText: {
    color: COLORS.white,
    fontSize: isTablet ? 18 : FONT_SIZES.body,
    fontFamily: Fonts.semiBold,
    marginHorizontal: SPACING.xs,
  },
  appleLogo: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },
  qualificationContainer: {
    paddingHorizontal: isTablet ? SPACING.xxl * 2 : SPACING.lg,
    paddingTop: isTablet ? -SPACING.xl : -SPACING.md,
    paddingBottom: isTablet ? SPACING.sm : SPACING.md,
    alignItems: 'center',
  },
  qualificationTitle: {
    fontSize: isTablet ? 42 : FONT_SIZES.h1,
    fontFamily: Fonts.bold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  qualificationSubtitle: {
    fontSize: isTablet ? 18 : FONT_SIZES.body,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: isTablet ? 26 : 22,
    marginBottom: SPACING.xs,
  },
});

const AwardScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedTierIndex, setSelectedTierIndex] = useState(1); // Default to Gold
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Handle scroll to update selected tier
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const cardWidth = isTablet ? Math.min(width * 0.55, 500) : width * 0.65;
        const padding = isTablet ? width * 0.15 : width * 0.175;
        const index = Math.round((offsetX - padding) / cardWidth);
        if (index !== selectedTierIndex && index >= 0 && index < TIERS.length) {
          setSelectedTierIndex(index);
        }
      },
    }
  );

  // Handle tier selection
  const handleTierSelect = (index: number) => {
    setSelectedTierIndex(index);
    const cardWidth = isTablet ? Math.min(width * 0.55, 500) : width * 0.65;
    const padding = isTablet ? width * 0.15 : width * 0.175;
    scrollViewRef.current?.scrollTo({
      x: index * cardWidth + padding,
      animated: true,
    });
  };

  // Scroll to initial position (Gold tier - index 1) when screen loads
  useEffect(() => {
    const cardWidth = isTablet ? Math.min(width * 0.55, 500) : width * 0.65;
    const padding = isTablet ? width * 0.15 : width * 0.175;
    // Ensure GOLD (index 1) is selected and scrolled to on mount
    setSelectedTierIndex(1);
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: 1 * cardWidth + padding, // Always scroll to GOLD (index 1)
        animated: false,
      });
    }, 100);
  }, []);



  // Safety check for styles - ensure styles object exists
  // Styles are defined at module level, so should always be available
  if (!styles || typeof styles !== 'object') {
    console.error('Styles object is undefined!');
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#FFFFFF' }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container || { flex: 1, backgroundColor: '#000000' }}>
      {/* Background Image */}
      <ImageBackground
        source={require('../assets/bg.png')}
        style={styles.backgroundImage || StyleSheet.absoluteFillObject}
        resizeMode="cover"
      >
        {/* Optional overlay for better text visibility */}
        <View style={styles.backgroundOverlay || {}} />
      </ImageBackground>

      {/* Header with Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.5}
        >
          <View style={styles.backButtonCircle}>
            <Image
              source={require('../assets/icons/backButton.png')}
              style={styles.backButtonIcon}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Qualification Message */}
      <View style={styles.qualificationContainer}>
        <Text style={styles.qualificationTitle}>
          You qualify for Instant Gold Cover
        </Text>
        <Text style={styles.headerText}>
          {TIERS[selectedTierIndex]?.name || 'GOLD'} TIER APPROVED
        </Text>
        <Text style={styles.qualificationSubtitle}>
          Based on your Bio-Score, you have unlocked premium{'\n'}
          tier benefits at standard rates.
        </Text>
      </View>

      {/* Cards Carousel using ScrollView */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={isTablet ? Math.min(width * 0.55, 500) : width * 0.65}
        snapToAlignment="start"
        contentContainerStyle={{ 
          flexDirection: 'row',
          paddingHorizontal: isTablet ? width * 0.15 : width * 0.175, // Show 15% on tablet, 17.5% on phone
          paddingBottom: SPACING.md,
          marginTop: isTablet ? SPACING.sm : -110,
        }}
        style={{ flex: 1 }}
      >
        {TIERS.map((tier, index) => {
          const cardWidth = isTablet ? Math.min(width * 0.55, 500) : width * 0.65;
          const inputRange = [
            (index - 1) * cardWidth,
            index * cardWidth,
            (index + 1) * cardWidth,
          ];
          
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.85, 1, 0.85],
            extrapolate: 'clamp',
          });
          
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.6, 1, 0.6],
            extrapolate: 'clamp',
          });

          const isActive = index === selectedTierIndex;

          return (
            <Animated.View 
              key={index} 
              style={{ 
                width: cardWidth, 
                alignItems: 'center', 
                justifyContent: 'center', 
                paddingHorizontal: isActive ? SPACING.xl : SPACING.lg,
                marginRight: isActive ? SPACING.xl : SPACING.lg,
                marginLeft: isActive ? SPACING.xl : 0,
                marginTop: isActive ? SPACING.md : 0,
                marginBottom: isActive ? SPACING.md : 0,
                transform: [{ scale }],
                opacity,
              }}
            >
              {/* Glossy Tier Detail Card */}
              <View style={styles.glossyCardContainer}>
              {/* Outer Card with Strong Border */}
              <View style={[styles.outerCard, isActive && styles.outerCardActive]}>
                {/* Inner Card with Subtle Border */}
                <View style={[styles.glossyCard, isActive && styles.glossyCardActive]}>
                  {/* Glossy gold gradient background */}
                  <LinearGradient
                    colors={isActive 
                      ? ['rgba(139, 117, 78, 0.85)', 'rgba(160, 140, 90, 0.8)', 'rgba(184, 134, 11, 0.75)', 'rgba(218, 165, 32, 0.7)', 'rgba(139, 117, 78, 0.85)']
                      : ['rgba(120, 100, 65, 0.8)', 'rgba(139, 117, 78, 0.75)', 'rgba(160, 140, 90, 0.7)', 'rgba(184, 134, 11, 0.65)', 'rgba(120, 100, 65, 0.8)']
                    }
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.cardBackground}
                  />
                  {/* Additional glossy overlay gradient - polished gold shimmer */}
                  <LinearGradient
                    colors={isActive
                      ? ['rgba(255, 215, 0, 0.15)', 'transparent', 'transparent', 'rgba(218, 165, 32, 0.12)']
                      : ['rgba(218, 165, 32, 0.12)', 'transparent', 'transparent', 'rgba(184, 134, 11, 0.08)']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                    pointerEvents="none"
                  />
                  
                  {/* Star-burst/Lens flare effect for active card */}
                  {isActive && <View style={[styles.starburstEffect, styles.starburstEffectActive]} />}
                
                  {/* Particle effects */}
                  <View style={styles.particleContainer}>
                    {Array.from({ length: isActive ? 20 : 15 }).map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.particle,
                          isActive && styles.particleActive,
                          {
                            left: `${10 + (i * 7) % 80}%`,
                            top: `${15 + (i * 11) % 70}%`,
                          },
                        ]}
                      />
                    ))}
                  </View>

                  {/* Top Section - Tier Name with Gradient */}
                  <View style={[styles.tierNameSection, isActive && styles.tierNameSectionActive]}>
                    <View style={[styles.tierNameGlow, isActive && styles.tierNameGlowActive]} />
                    <GradientText
                      style={styles.tierName}
                      colors={isActive
                        ? ['#FFFFFF', '#FFFFFF', '#E8E0FF', '#FFFFFF', '#FFFFFF', '#FFFFFF']
                        : ['#FFFFFF', '#FFFFFF', '#D4C9FF', '#FFFFFF', '#FFFFFF']
                      }
                    >
                      {tier.name}
                    </GradientText>
                  </View>

                  {/* Separator */}
                  <View style={[styles.separator, isActive && styles.separatorActive]} />

                  {/* Middle Section - Metrics */}
                  <View style={[styles.cardSection, isActive && styles.cardSectionActive]}>
                    {/* Bio-Score */}
                    <View style={styles.metricRow}>
                      <View style={[styles.shieldBadge, isActive && styles.shieldBadgeActive]}>
                        <Text style={styles.checkmarkIcon}>✓</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <GradientText
                          style={styles.metricText}
                          colors={['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']}
                        >
                          Bio-Score:{' '}
                        </GradientText>
                        <GradientText
                          style={[styles.metricText, styles.metricValue]}
                          colors={['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']}
                        >
                          {tier.bioScore}/100
                        </GradientText>
                      </View>
                    </View>

                    {/* Risk Level */}
                    <View style={styles.metricRow}>
                      <View style={[styles.shieldBadge, isActive && styles.shieldBadgeActive]}>
                        <Text style={styles.checkmarkIcon}>✓</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <GradientText
                          style={styles.metricText}
                          colors={['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']}
                        >
                          Risk Level:{' '}
                        </GradientText>
                        <GradientText
                          style={[styles.metricText, styles.riskLowText]}
                          colors={['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']}
                        >
                          {tier.riskLevel}
                        </GradientText>
                      </View>
                    </View>
                  </View>

                  {/* Separator */}
                  <View style={[styles.separator, isActive && styles.separatorActive]} />

                  {/* Bottom Section - Price */}
                  <View style={[styles.cardSection, isActive && styles.cardSectionActive]}>
                    <GradientText
                      style={styles.priceText}
                      colors={['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']}
                    >
                      {tier.price}
                    </GradientText>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        );
        })}
      </ScrollView>

      {/* Apple Pay Button */}
      <TouchableOpacity 
        style={styles?.applePayButton || {}} 
        activeOpacity={0.5}
        onPress={() => navigation.navigate('CoverageSuccess')}
      >
        <Text style={styles?.applePayText || { color: '#FFFFFF', fontSize: 16 }}>Activate with</Text>
        <Image 
          source={require('../assets/apple.png')} 
          style={styles?.appleLogo || { width: 20, height: 20, tintColor: '#FFFFFF' }}
          resizeMode="contain"
        />
        <Text style={styles?.applePayText || { color: '#FFFFFF', fontSize: 16 }}>Pay</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AwardScreen;
