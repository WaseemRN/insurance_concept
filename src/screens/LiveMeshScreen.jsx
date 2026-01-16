import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
  Fonts,
} from '../constants/theme';
import backButton from '../assets/icons/backButton.png';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

// URLs
const LIVE_MESH_URL = 'https://insurancemena.vulcantech.tech/live-face-mesh';
const LIVE_MESH_REGION_URL = 'https://insurancemena.vulcantech.tech/live-face-regions';

const LiveMeshScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState(LIVE_MESH_URL);
  const [currentTitle, setCurrentTitle] = useState('Live Mesh');
  const [webViewKey, setWebViewKey] = useState(0);
  const webViewRef = useRef(null);
  const timerRef = useRef(null);
  const [showWebView, setShowWebView] = useState(false); // Control when to show first URL
  const [showLine1, setShowLine1] = useState(false); // Heart Rate
  const [showLine2, setShowLine2] = useState(false); // SpO2
  const [showLine3, setShowLine3] = useState(false); // Stress Load
  const [showNextButton, setShowNextButton] = useState(false); // Next button visibility
  const [showCalibratingMessage, setShowCalibratingMessage] = useState(false); // Hold Still message
  const [isSecondUrlLoaded, setIsSecondUrlLoaded] = useState(false); // Track if second URL has loaded
  const [stressLoadNormal, setStressLoadNormal] = useState(false); // Track if stress load should show "Normal"
  const [heartRate, setHeartRate] = useState(0);
  const [spo2, setSpo2] = useState(0);
  const vitalsTimerRef = useRef(null);
  const stressLoadTimerRef = useRef(null);
  const currentUrlRef = useRef(LIVE_MESH_URL); // Track current URL with ref
  
  // Floating animations for cards and analyzing bubble
  const analyzingBubbleAnim = useRef(new Animated.Value(0)).current;
  const heartRateTopAnim = useRef(new Animated.Value(0)).current;
  const spo2Anim = useRef(new Animated.Value(0)).current;
  const heartRateBottomAnim = useRef(new Animated.Value(0)).current;
  const stressLoadAnim = useRef(new Animated.Value(0)).current;

  // Clean up timers and WebView when navigating away
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      // Clean up WebView when leaving screen
      if (webViewRef.current) {
        webViewRef.current.stopLoading();
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    });

    return () => {
      unsubscribe();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [navigation]);

  // Initialize screen - delay showing first URL, then switch after 30 seconds
  useEffect(() => {
    // Reset states when screen mounts
    setShowWebView(false);
    setCurrentUrl(LIVE_MESH_URL);
    currentUrlRef.current = LIVE_MESH_URL; // Reset ref
    setCurrentTitle('Live Mesh');
    setLoading(true);
    setShowCalibratingMessage(false);
    setIsSecondUrlLoaded(false);
    setShowLine1(false);
    setShowLine2(false);
    setShowLine3(false);
    setShowNextButton(false);
    setStressLoadNormal(false);

    // Show first URL after a short delay
    const showFirstUrlTimer = setTimeout(() => {
      setShowWebView(true);
      setWebViewKey(prev => prev + 1);
      setShowCalibratingMessage(true); // Show calibrating message while first URL is active
    }, 500); // Small delay before showing first URL

    // After 30 seconds, switch to second URL
    timerRef.current = setTimeout(() => {
      // Switch to second URL and update title
      setCurrentUrl(LIVE_MESH_REGION_URL);
      currentUrlRef.current = LIVE_MESH_REGION_URL; // Update ref
      setCurrentTitle('Live Mesh Region');
      setWebViewKey(prev => prev + 1);
      setLoading(true);
      setShowCalibratingMessage(false); // Hide calibrating message when switching to second URL
    }, 30000); // 30 seconds

    return () => {
      clearTimeout(showFirstUrlTimer);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (vitalsTimerRef.current) {
        clearTimeout(vitalsTimerRef.current);
      }
      if (stressLoadTimerRef.current) {
        clearTimeout(stressLoadTimerRef.current);
      }
    };
  }, []);

  // Refresh WebView when screen is focused
  useFocusEffect(
    useCallback(() => {
      // Small delay to ensure WebView is mounted
      const timer = setTimeout(() => {
        if (webViewRef.current) {
          webViewRef.current.reload();
        }
      }, 100);

      return () => clearTimeout(timer);
    }, [])
  );

  // Clean up vitals timers when screen loses focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (vitalsTimerRef.current) {
          clearTimeout(vitalsTimerRef.current);
          vitalsTimerRef.current = null;
        }
        if (stressLoadTimerRef.current) {
          clearTimeout(stressLoadTimerRef.current);
          stressLoadTimerRef.current = null;
        }
      };
    }, [])
  );

  // Start floating bubbles animation when second URL loads
  useEffect(() => {
    if (isSecondUrlLoaded) {
      // Create floating animations for each bubble
      const createFloatingAnimation = (animValue, delay = 0, duration = 3000) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(animValue, {
              toValue: 1,
              duration: duration,
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 0,
              duration: duration,
              useNativeDriver: true,
            }),
          ])
        );
      };

      // Start all animations with different delays and durations
      Animated.parallel([
        createFloatingAnimation(analyzingBubbleAnim, 0, 2500),
        createFloatingAnimation(heartRateTopAnim, 200, 2800),
        createFloatingAnimation(spo2Anim, 400, 3000),
        createFloatingAnimation(heartRateBottomAnim, 300, 2700),
        createFloatingAnimation(stressLoadAnim, 500, 2900),
      ]).start();
    }
  }, [isSecondUrlLoaded]);

  const handleBack = () => {
    // Clear timers if navigating away
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (vitalsTimerRef.current) {
      clearTimeout(vitalsTimerRef.current);
    }
    if (stressLoadTimerRef.current) {
      clearTimeout(stressLoadTimerRef.current);
    }
    navigation.goBack();
  };

  const handleNext = () => {
    // Clear timers if navigating away
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (vitalsTimerRef.current) {
      clearTimeout(vitalsTimerRef.current);
    }
    if (stressLoadTimerRef.current) {
      clearTimeout(stressLoadTimerRef.current);
    }
    navigation.navigate('Recording');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Full Screen WebView */}
      <View style={styles.webViewFullScreen}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
        {showWebView && (
          <WebView
            key={webViewKey}
            ref={webViewRef}
            source={{ 
              uri: currentUrl,
              headers: {
                'ngrok-skip-browser-warning': 'true',
              }
            }}
            style={styles.webView}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            mixedContentMode="always"
            thirdPartyCookiesEnabled={true}
            sharedCookiesEnabled={true}
            cacheEnabled={false}
            originWhitelist={['*']}
            onLoadStart={() => {
              setLoading(true);
              console.log('WebView load started - URL:', currentUrl);
            }}
            onLoadEnd={() => {
              setLoading(false);
              console.log('WebView load ended - URL:', currentUrlRef.current);
              
              // Check if second URL has loaded
              if (currentUrlRef.current === LIVE_MESH_REGION_URL && !isSecondUrlLoaded) {
                setIsSecondUrlLoaded(true);
                
                // Generate random values for vitals
                const randomHeartRate = Math.floor(Math.random() * (100 - 60 + 1)) + 60; // 60-100 BPM
                const randomSpo2 = Math.floor(Math.random() * (100 - 95 + 1)) + 95; // 95-100%
                
                setHeartRate(randomHeartRate);
                setSpo2(randomSpo2);
                
                // Wait 5 seconds after second URL loads, then show vitals lines
                vitalsTimerRef.current = setTimeout(() => {
                  // Show first line (Heart Rate)
                  setShowLine1(true);
                  
                  // Show second line after 2 seconds
                  setTimeout(() => {
                    setShowLine2(true);
                  }, 2000);
                  
                  // Show third line after 4 seconds
                  setTimeout(() => {
                    setShowLine3(true);
                    // Change "Calculating..." to "Normal" after 2.5 seconds
                    stressLoadTimerRef.current = setTimeout(() => {
                      setStressLoadNormal(true);
                    }, 2500);
                  }, 4000);
                  
                  // Show Next button after 6 seconds
                  setTimeout(() => {
                    setShowNextButton(true);
                  }, 6000);
                }, 5000); // 5 seconds after second URL loads
              }
            }}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView error: ', nativeEvent);
              setLoading(false);
            }}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView HTTP error: ', nativeEvent);
            }}
            onRenderProcessGone={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView render process gone: ', nativeEvent);
            }}
          />
        )}
      </View>

      {/* Overlay Content */}
      <SafeAreaView style={styles.overlayContainer} edges={['top', 'bottom']}>
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

        {/* Calibrating Message - Top middle of screen */}
        {showCalibratingMessage && (
          <View style={styles.statusLinesContainer}>
            <View style={styles.calibratingContainer}>
              <Text style={styles.holdStillText}>Hold Still.</Text>
              <Text style={styles.calibratingText}>Calibrating Sensors...</Text>
            </View>
          </View>
        )}

        {/* Floating Analyzing Bubble */}
        {isSecondUrlLoaded && (
          <Animated.View
            style={[
              styles.floatingBubble,
              {
                top: height * 0.25,
                left: width * 0.5 - 40,
                opacity: analyzingBubbleAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.6, 1, 0.6],
                }),
                transform: [
                  {
                    translateY: analyzingBubbleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -20],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.bubbleText}>Analyzing...</Text>
          </Animated.View>
        )}

        {/* Vitals Cards - Positioned around the face */}
        {isSecondUrlLoaded && (
          <>
            {/* Top Left Card - Heart Rate */}
            {showLine1 && (
              <Animated.View
                style={[
                  styles.vitalCard,
                  styles.topLeftCard,
                  {
                    transform: [
                      {
                        translateY: heartRateTopAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -15],
                        }),
                      },
                    ],
                    opacity: heartRateTopAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.8, 1, 0.8],
                    }),
                  },
                ]}
              >
                <LinearGradient
                  colors={['rgba(0, 255, 255, 0.2)', 'rgba(0, 255, 255, 0.05)', 'rgba(0, 255, 255, 0.2)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.vitalCardStatus}>Heart Rate: Detecting...</Text>
                    <Text style={styles.vitalCardValue}>{heartRate} BPM</Text>
                  </View>
                </LinearGradient>
              </Animated.View>
            )}

            {/* Top Right Card - SpO2 */}
            {showLine2 && (
              <Animated.View
                style={[
                  styles.vitalCard,
                  styles.topRightCard,
                  {
                    transform: [
                      {
                        translateX: spo2Anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 12],
                        }),
                      },
                      {
                        translateY: spo2Anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -12],
                        }),
                      },
                    ],
                    opacity: spo2Anim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.8, 1, 0.8],
                    }),
                  },
                ]}
              >
                <LinearGradient
                  colors={['rgba(0, 255, 255, 0.2)', 'rgba(0, 255, 255, 0.05)', 'rgba(0, 255, 255, 0.2)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.vitalCardStatus}>SpO2: Analysis...</Text>
                    <View style={styles.valueRow}>
                      <Text style={styles.arrowSymbol}>↑ </Text>
                      <Text style={styles.vitalCardValue}>{spo2}%</Text>
                    </View>
                  </View>
                </LinearGradient>
              </Animated.View>
            )}

            {/* Bottom Left Card - Heart Rate (duplicate) */}
            {showLine1 && (
              <Animated.View
                style={[
                  styles.vitalCard,
                  styles.bottomLeftCard,
                  {
                    transform: [
                      {
                        translateX: heartRateBottomAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -12],
                        }),
                      },
                      {
                        translateY: heartRateBottomAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 15],
                        }),
                      },
                    ],
                    opacity: heartRateBottomAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.8, 1, 0.8],
                    }),
                  },
                ]}
              >
                <LinearGradient
                  colors={['rgba(0, 255, 255, 0.2)', 'rgba(0, 255, 255, 0.05)', 'rgba(0, 255, 255, 0.2)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.vitalCardStatus}>Heart Rate:</Text>
                    <Text style={styles.vitalCardValue}>{heartRate} BPM</Text>
                  </View>
                </LinearGradient>
              </Animated.View>
            )}

            {/* Bottom Right Card - Stress Load */}
            {showLine3 && (
              <Animated.View
                style={[
                  styles.vitalCard,
                  styles.bottomRightCard,
                  {
                    transform: [
                      {
                        translateX: stressLoadAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 12],
                        }),
                      },
                      {
                        translateY: stressLoadAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 15],
                        }),
                      },
                    ],
                    opacity: stressLoadAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.8, 1, 0.8],
                    }),
                  },
                ]}
              >
                <LinearGradient
                  colors={['rgba(0, 255, 255, 0.2)', 'rgba(0, 255, 255, 0.05)', 'rgba(0, 255, 255, 0.2)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.vitalCardStatus}>
                      Stress Load: {stressLoadNormal ? 'Normal' : 'Calculating...'}
                    </Text>
                  </View>
                </LinearGradient>
              </Animated.View>
            )}
          </>
        )}

        {/* Next Button */}
        {showNextButton && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              activeOpacity={0.5}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  webViewFullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  webView: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    zIndex: 1,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    pointerEvents: 'box-none',
  },
  backButton: {
    position: 'absolute',
    top: isTablet ? SPACING.xxl : SPACING.lg,
    left: SPACING.md,
    zIndex: 11,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  backButtonIcon: {
    width: 16,
    height: 16,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: SPACING.xl,
    left: 0,
    right: 0,
    paddingHorizontal: isTablet ? SPACING.xxl * 2 : SPACING.lg,
    zIndex: 11,
  },
  nextButton: {
    backgroundColor: COLORS.buttonPrimary,
    paddingVertical: isTablet ? 20 : 14,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    width: isTablet ? '40%' : '100%',
    alignSelf: isTablet ? 'center' : 'auto',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  nextButtonText: {
    fontSize: isTablet ? 20 : FONT_SIZES.h3,
    fontFamily: Fonts.semiBold,
    top:-2,
    color: COLORS.white,
  },
  // Status Lines Container (for calibrating message)
  statusLinesContainer: {
    position: 'absolute',
    top: isTablet ? SPACING.xxl * 2 : SPACING.xl * 2,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 11,
  },
  calibratingContainer: {
    alignItems: 'center',
  },
  holdStillText: {
    fontSize: isTablet ? FONT_SIZES.h2 : FONT_SIZES.h3,
    fontFamily: Fonts.bold,
    fontWeight: '700',
    color: '#00FFFF', // Cyan color
    textAlign: 'center',
    marginBottom: SPACING.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  calibratingText: {
    fontSize: FONT_SIZES.body,
    fontFamily: Fonts.medium,
    fontWeight: '500',
    color: '#00FFFF', // Cyan color
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    top: -5,
  },
  // Vitals Cards
  vitalCard: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.35)', // Decreased opacity for more transparency
    borderWidth: 2,
    borderColor: '#00FFFF', // Cyan border
    borderRadius: isTablet ? 50 : 45, // Make it circular - decreased size
    width: isTablet ? 100 : 90, // Fixed width for circle - decreased
    height: isTablet ? 100 : 90, // Fixed height for circle - decreased
    zIndex: 11,
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardGradient: {
    borderRadius: isTablet ? 48 : 43, // Match parent border radius
    paddingHorizontal: isTablet ? 10 : 8, // Decreased padding
    paddingVertical: isTablet ? 8 : 6,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Add dark background to gradient for text readability
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    backgroundColor: 'transparent', // Ensure content doesn't have background
  },
  topLeftCard: {
    top: isTablet ? '10%' : '8%', // Moved more up
    left: isTablet ? SPACING.xxl * 2 : SPACING.md,
    marginTop: isTablet ? SPACING.lg : SPACING.md, // Add margin top
    marginHorizontal: isTablet ? SPACING.xxl * 2 : 0,
  },
  topRightCard: {
    top: isTablet ? '20%' : '18%',
    right: isTablet ? SPACING.xxl * 2 : SPACING.md,
    marginHorizontal: isTablet ? SPACING.xxl * 2 : 0,
  },
  bottomLeftCard: {
    bottom: isTablet ? '35%' : '33%', // Moved more up
    left: isTablet ? SPACING.xxl * 2 : SPACING.md,
    marginHorizontal: isTablet ? SPACING.xxl * 2 : 0,
  },
  bottomRightCard: {
    bottom: isTablet ? '35%' : '33%', // Moved more up
    right: isTablet ? SPACING.xxl * 2 : SPACING.md,
    marginHorizontal: isTablet ? SPACING.xxl * 2 : 0,
  },
  vitalCardStatus: {
    fontSize: isTablet ? 11 : 10, // Decreased font size
    fontFamily: Fonts.medium,
    fontWeight: '500',
    color: '#00FFFF', // Bright cyan for status
    marginBottom: isTablet ? 6 : 4,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    backgroundColor: 'transparent', // Ensure no background color
    textAlign: 'center',
  },
  vitalCardValue: {
    fontSize: isTablet ? FONT_SIZES.h3 : FONT_SIZES.body, // Decreased font size
    fontFamily: Fonts.bold,
    fontWeight: '700',
    color: '#00FFFF', // Bright cyan for values
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    backgroundColor: 'transparent', // Ensure no background color
    textAlign: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent', // Ensure no background color
  },
  arrowSymbol: {
    fontSize: isTablet ? FONT_SIZES.body : 14, // Decreased font size
    fontFamily: Fonts.bold,
    fontWeight: '700',
    color: '#00FFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    backgroundColor: 'transparent', // Ensure no background color
  },
  // Floating Bubbles
  floatingBubble: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
    borderWidth: 1.5,
    borderColor: '#00FFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    zIndex: 9,
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 5,
  },
  bubbleText: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    fontWeight: '500',
    color: '#00FFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default LiveMeshScreen;
