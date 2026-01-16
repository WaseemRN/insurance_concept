import React, { useRef, useEffect, useState } from 'react';
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
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
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

// URL for LiveMeshRegion
const LIVE_MESH_REGION_URL = 'https://95a414344428.ngrok-free.app/live-face-regions';

const LiveMeshRegionScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [webViewKey, setWebViewKey] = useState(Date.now());
  const webViewRef = useRef(null);
  const isFocused = useIsFocused();
  const [shouldRender, setShouldRender] = useState(false);

  // Initialize render state when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      // Reset and prepare for new WebView instance
      setLoading(true);
      setShouldRender(false);
      
      // Force complete remount with new key
      const newKey = Date.now();
      setWebViewKey(newKey);
      
      // Delay rendering to ensure navigation transition completes
      const renderTimer = setTimeout(() => {
        setShouldRender(true);
      }, 200);

      // Additional delay for reload attempt
      const reloadTimer = setTimeout(() => {
        if (webViewRef.current) {
          webViewRef.current.reload();
        }
      }, 500);

      return () => {
        clearTimeout(renderTimer);
        clearTimeout(reloadTimer);
        // Clean up when screen loses focus
        setShouldRender(false);
        setLoading(false);
      };
    }, [])
  );

  // Clean up WebView when navigating away
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      // Clean up WebView when leaving screen
      if (webViewRef.current) {
        webViewRef.current.stopLoading();
      }
      setShouldRender(false);
    });

    return unsubscribe;
  }, [navigation]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    navigation.navigate('HealthScore');
  };

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

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Live Mesh Region</Text>
        </View>

        {/* WebView Container */}
        <View style={styles.webViewContainer}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          )}
          {isFocused && shouldRender && (
            <WebView
              key={webViewKey}
              ref={webViewRef}
              source={{ 
                uri: LIVE_MESH_REGION_URL,
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
              androidHardwareAccelerationDisabled={false}
              androidLayerType="hardware"
              onLoadStart={() => {
                setLoading(true);
                console.log('LiveMeshRegion WebView load started - URL:', LIVE_MESH_REGION_URL);
              }}
              onLoadEnd={() => {
                setLoading(false);
                console.log('LiveMeshRegion WebView load ended successfully');
              }}
              onLoadProgress={({ nativeEvent }) => {
                console.log('LiveMeshRegion WebView loading progress:', Math.round(nativeEvent.progress * 100) + '%');
              }}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.error('LiveMeshRegion WebView error:', nativeEvent);
                setLoading(false);
              }}
              onHttpError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.error('LiveMeshRegion WebView HTTP error:', nativeEvent.statusCode, nativeEvent.url);
                setLoading(false);
              }}
              onRenderProcessGone={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.error('LiveMeshRegion WebView render process gone:', nativeEvent);
                setLoading(false);
              }}
              onShouldStartLoadWithRequest={(request) => {
                console.log('LiveMeshRegion WebView should start load:', request.url);
                return true;
              }}
              onMessage={(event) => {
                console.log('LiveMeshRegion WebView message:', event.nativeEvent.data);
              }}
            />
          )}
        </View>

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.5}
          >
            <Text style={styles.nextButtonText}>Next</Text>
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
  header: {
    paddingHorizontal: isTablet ? SPACING.xxl * 2 : SPACING.lg,
    paddingTop: isTablet ? SPACING.xxl * 2 : SPACING.xxl + SPACING.xl,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: isTablet ? 36 : FONT_SIZES.h1,
    fontFamily: Fonts.semiBold,
    color: COLORS.textPrimary,
  },
  webViewContainer: {
    flex: 1,
    marginHorizontal: isTablet ? SPACING.xxl * 2 : SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    backgroundColor: COLORS.background,
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
    backgroundColor: COLORS.background,
    zIndex: 1,
  },
  webViewPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  buttonContainer: {
    paddingHorizontal: isTablet ? SPACING.xxl * 2 : SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  nextButton: {
    backgroundColor: COLORS.buttonPrimary,
    paddingVertical: isTablet ? 20 : 14,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: isTablet ? 20 : FONT_SIZES.h3,
    fontFamily: Fonts.semiBold,
    top:-2,
    color: COLORS.white,
  },
});

export default LiveMeshRegionScreen;
