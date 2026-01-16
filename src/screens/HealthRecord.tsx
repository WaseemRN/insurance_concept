import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Image,
  ScrollView,
} from 'react-native';
import Video from 'react-native-video';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, Fonts } from '../constants/theme';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

// Health tags with different colors
interface HealthTag {
  text: string;
  color: string;
}

const HEALTH_TAGS: HealthTag[] = [
  { text: 'Heart Healthy', color: '#4CAF50' },
  { text: 'Metabolic Focus', color: '#FFD700' },
  { text: 'Lung Capacity', color: '#4CAF50' },
  { text: 'Optimal Blood Flow', color: '#4CAF50' },
  { text: 'Strong Immunity', color: '#4CAF50' },
  { text: 'Active Metabolism', color: '#FFD700' },
  { text: 'Healthy Respiration', color: '#4CAF50' },
  { text: 'Cardiovascular Health', color: '#4CAF50' },
  { text: 'Energy Levels', color: '#FFD700' },
  { text: 'Vitality Score', color: '#4CAF50' },
];

// Random positions for tags around the video (as percentage values for calculation)
const TAG_POSITIONS = [
  { topPercent: 15, rightPercent: 10 }, // Top right
  { topPercent: 45, rightPercent: 8 },   // Mid right
  { topPercent: 35, leftPercent: 8 },    // Mid left
  { topPercent: 60, rightPercent: 12 }, // Lower right
  { topPercent: 55, leftPercent: 10 },   // Lower left
  { topPercent: 25, leftPercent: 6 },    // Upper left
];

const HealthRecord: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [healthScore, setHealthScore] = useState(92);
  const [selectedTags, setSelectedTags] = useState<HealthTag[]>([]);
  const videoRef = useRef<any>(null);

  // Generate random results on mount
  useEffect(() => {
    // Set static health score to 92
    setHealthScore(92);

    // Select 3 random health tags
    const shuffled = [...HEALTH_TAGS].sort(() => 0.5 - Math.random());
    setSelectedTags(shuffled.slice(0, 3));
  }, []);

  // Hexagonal grid pattern component - simplified for better performance
  const HexagonalGrid = () => {
    const hexagons = [];
    const rows = 6;
    const cols = 8;
    const hexSize = 35;
    const spacing = hexSize * 0.85;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const offsetX = (row % 2) * (hexSize * 0.5);
        const x = col * spacing + offsetX;
        const y = row * spacing * 0.75;
        
        hexagons.push(
          <View
            key={`${row}-${col}`}
            style={[
              styles.hexagon,
              {
                left: x,
                top: y,
              },
            ]}
          />
        );
      }
    }

    return <View style={styles.hexGridContainer}>{hexagons}</View>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Dark overlay */}
        <View style={styles.backgroundOverlay} />
        
        {/* Hexagonal grid pattern */}
        <View style={styles.hexGridWrapper}>
          <HexagonalGrid />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header with Back Button and Gold Tier */}
            <View style={styles.header}>
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

            {/* <View style={styles.goldTierButton}>
              <Text style={styles.goldTierText}>GOLD TIER</Text>
            </View> */}
          </View>

          {/* Health Score Heading at Top */}
          <View style={styles.titleSection}>
            <View>
            <Text style={styles.title}>Health Score</Text>
            <Text style={styles.subtitle}>Bio Score</Text>
            </View>
            
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreValue}>{healthScore}</Text>
              <Text style={styles.scoreMax}>/100</Text>
            </View>
          </View>

          {/* Video Container */}
          <View style={styles.videoContainer}>
            <View style={styles.videoBackground}>
              <Video
                ref={videoRef}
                source={require('../assets/images/person.mp4')}
                style={styles.video}
                resizeMode="contain"
                repeat
                muted={false}
                paused={false}
                playInBackground={false}
                playWhenInactive={false}
                ignoreSilentSwitch="ignore"
              />
            </View>
            
            {/* Health Tags */}
            {selectedTags.map((tag, index) => {
              const position = TAG_POSITIONS[index % TAG_POSITIONS.length];
              const videoHeight = height * 0.55;
              const videoWidth = width * 0.75;
              
              // Convert percentage to pixel values
              const positionStyle: any = {
                backgroundColor: tag.color,
              };
              
              if (position.topPercent !== undefined) {
                positionStyle.top = (videoHeight * position.topPercent) / 100;
              }
              if (position.rightPercent !== undefined) {
                positionStyle.right = (videoWidth * position.rightPercent) / 100;
              }
              if (position.leftPercent !== undefined) {
                positionStyle.left = (videoWidth * position.leftPercent) / 100;
              }
              
              return (
                <View
                  key={index}
                  style={[
                    styles.healthTag,
                    positionStyle,
                  ]}
                >
                  <View style={styles.tagDot} />
                  <Text style={styles.tagText}>{tag.text}</Text>
                </View>
              );
            })}
          </View>

            {/* Proceed Button */}
            <View style={styles.proceedButtonContainer}>
              <TouchableOpacity
                style={styles.proceedButton}
                onPress={() => navigation.navigate('Award')}
                activeOpacity={0.5}
              >
                <Text style={styles.proceedButtonText}>Proceed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1E',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 15, 30, 0.85)',
  },
  hexGridWrapper: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
    overflow: 'hidden',
  },
  hexGridContainer: {
    position: 'absolute',
    width: width * 1.5,
    height: height * 0.6,
    bottom: 0,
    left: -width * 0.1,
  },
  hexagon: {
    position: 'absolute',
    width: 35,
    height: 35,
    borderWidth: 1,
    borderColor: '#2196F3',
    backgroundColor: 'transparent',
    opacity: 0.2,
    transform: [{ rotate: '30deg' }],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xxl,
  },
  content: {
    paddingHorizontal: isTablet ? SPACING.xxl * 2 : SPACING.lg,
    paddingTop: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    top:10,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  backButton: {
    marginTop: SPACING.sm,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    width: 20,
    height: 20,
  },
  goldTierButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    elevation: 3,
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  goldTierText: {
    fontSize: FONT_SIZES.bodySmall,
    fontFamily: Fonts.bold,
    color: '#0A0F1E',
    letterSpacing: 0.5,
  },
  titleSection: {
    top:2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  scoreSection: {
    marginTop: 2,
    marginBottom: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: isTablet ? 42 : FONT_SIZES.h1,
    fontFamily: Fonts.bold,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: isTablet ? 18 : FONT_SIZES.body,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.65)',
    top:-10,
    marginBottom: SPACING.xs,
  },
  scoreContainer: {
    flexDirection: 'row',
    top:-30,
    alignItems: 'baseline',
  },
  scoreValue: {
    fontSize: isTablet ? 80 : 64,
    fontFamily: Fonts.bold,
    color: 'rgba(255, 255, 255, 0.9)',
    marginRight: SPACING.xs,
  },
  scoreMax: {
    fontSize: isTablet ? 32 : FONT_SIZES.h2,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  videoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: -20,
    marginBottom: SPACING.xl,
  },
  videoBackground: {
    width: isTablet ? Math.min(width * 0.7, 600) : width * 1,
    height: isTablet ? height * 0.5 : height * 0.65,
    maxWidth: isTablet ? 600 : width * 1,
    backgroundColor: 'rgba(4, 8, 19, 1)',
    borderRadius: isTablet ? 20 : 16,
    top: isTablet ? 40 : 30,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  video: {
    width: '100%',
    height: isTablet ? '100%' : '110%',
    alignSelf: 'center',
  },
  healthTag: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    marginHorizontal: isTablet ? width * 0.15 : 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.white,
    marginRight: SPACING.xs,
  },
  tagText: {
    fontSize: isTablet ? 14 : FONT_SIZES.bodySmall,
    fontFamily: Fonts.semiBold,
    color: COLORS.white,
  },
  proceedButtonContainer: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  proceedButton: {
    backgroundColor: COLORS.buttonPrimary,
    paddingVertical: isTablet ? SPACING.lg : SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    width: isTablet ? '40%' : '100%',
    alignSelf: isTablet ? 'center' : 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.buttonPrimary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  proceedButtonText: {
    color: COLORS.white,
    fontSize: isTablet ? 22 : FONT_SIZES.h3,
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
  },
});

export default HealthRecord;
