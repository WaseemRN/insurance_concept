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
} from 'react-native';
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

const { width } = Dimensions.get('window');
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
  const [showLine1, setShowLine1] = useState(false); // Calibrating Vitals
  const [showLine2, setShowLine2] = useState(false); // Detecting Heart Rate
  const [showLine3, setShowLine3] = useState(false); // Analyzing Vocal Tone
  const [showNextButton, setShowNextButton] = useState(false); // Next button visibility

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
    setCurrentTitle('Live Mesh');
    setLoading(true);

    // Show first URL after a short delay
    const showFirstUrlTimer = setTimeout(() => {
      setShowWebView(true);
      setWebViewKey(prev => prev + 1);
    }, 500); // Small delay before showing first URL

    // After 30 seconds, switch to second URL
    timerRef.current = setTimeout(() => {
      // Show toast message
      Toast.show({
        type: 'success',
        text1: 'Facial Identification Complete',
        text2: 'Your facial identification is done. Now vitals calculation are in process.',
        visibilityTime: 4000,
      });

      // Switch to second URL and update title
      setCurrentUrl(LIVE_MESH_REGION_URL);
      setCurrentTitle('Live Mesh Region');
      setWebViewKey(prev => prev + 1);
      setLoading(true);
    }, 30000); // 30 seconds

    return () => {
      clearTimeout(showFirstUrlTimer);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
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

  // Handle status lines and Next button timing - reset when screen is focused
  useFocusEffect(
    useCallback(() => {
      // Reset all states when screen is focused
      setShowLine1(false);
      setShowLine2(false);
      setShowLine3(false);
      setShowNextButton(false);

      // Show first line (Calculating Vitals) after 20 seconds
      const timer1 = setTimeout(() => {
        setShowLine1(true);
      }, 20000);

      // Show second line after 22 seconds (2 seconds after first)
      const timer2 = setTimeout(() => {
        setShowLine2(true);
      }, 22000);

      // Show third line after 24 seconds (2 seconds after second)
      const timer3 = setTimeout(() => {
        setShowLine3(true);
      }, 24000);

      // Show Next button after 30 seconds
      const timer4 = setTimeout(() => {
        setShowNextButton(true);
      }, 30000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }, [])
  );

  const handleBack = () => {
    // Clear timer if navigating away
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    navigation.goBack();
  };

  const handleNext = () => {
    // Clear timer if navigating away
    if (timerRef.current) {
      clearTimeout(timerRef.current);
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
              console.log('WebView load ended - URL:', currentUrl);
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

        {/* Status Lines - Bottom above Next button */}
        <View style={styles.statusLinesContainer}>
          {showLine1 && (
            <Text style={styles.statusLine}>Calculating Vitals...</Text>
          )}
          {showLine2 && (
            <Text style={styles.statusLine}>Detecting Heart Rate...</Text>
          )}
          {showLine3 && (
            <Text style={styles.statusLine}>Analyzing Vocal Tone...</Text>
          )}
        </View>

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
  // Status Lines Container
  statusLinesContainer: {
    position: 'absolute',
    bottom: 100,
    left: isTablet ? SPACING.xxl * 2 : SPACING.lg,
    right: isTablet ? SPACING.xxl * 2 : SPACING.lg,
    alignItems: 'flex-start',
    zIndex: 11,
  },
  statusLine: {
    fontSize: FONT_SIZES.body,
    fontFamily: Fonts.regular,
    color: COLORS.white,
    marginBottom: SPACING.xs,
    textAlign: 'left',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default LiveMeshScreen;
