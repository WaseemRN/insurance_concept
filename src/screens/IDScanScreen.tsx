import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Alert,
  Platform,
  PermissionsAndroid,
  Animated,
  Image,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SPACING, FONT_SIZES, Fonts, COLORS } from '../constants/theme';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

const IDScanScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const scanLinePosition = useRef(new Animated.Value(0)).current;
  const scanLineAnimation = useRef<Animated.CompositeAnimation | null>(null);

  const device = useCameraDevice('back');
  const { hasPermission: cameraPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    checkCameraPermission();
  }, []);

  useEffect(() => {
    if (isScanning && hasPermission) {
      startScanLineAnimation();
    } else {
      stopScanLineAnimation();
    }
    return () => {
      stopScanLineAnimation();
    };
  }, [isScanning, hasPermission]);

  const checkCameraPermission = async () => {
    if (cameraPermission) {
      setHasPermission(true);
    } else {
      const permission = await requestPermission();
      setHasPermission(permission);
      if (!permission) {
        Alert.alert(
          'Permission Denied',
          'Camera permission is required to scan ID cards. Please enable it in app settings.'
        );
      }
    }
  };

  const startScanLineAnimation = () => {
    stopScanLineAnimation();
    scanLinePosition.setValue(0);
    scanLineAnimation.current = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLinePosition, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLinePosition, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    scanLineAnimation.current.start();
  };

  const stopScanLineAnimation = () => {
    if (scanLineAnimation.current) {
      scanLineAnimation.current.stop();
      scanLineAnimation.current = null;
    }
  };

  const handleStartScan = async () => {
    try {
      if (!hasPermission) {
        const permission = await requestPermission();
        setHasPermission(permission);
        if (!permission) {
          Alert.alert(
            'Permission Denied',
            'Camera permission is required to scan ID cards. Please enable it in app settings.'
          );
          return;
        }
      }

      setIsScanning(true);
      setScanResult(null);

      // Simulate scanning process (replace with actual OCR implementation)
      setTimeout(() => {
        setIsScanning(false);
        setScanResult('ID Card scanned successfully!');
        
        // Vibrate once on success
        console.log('Triggering vibration...', Platform.OS);
        
        // Call vibration immediately - use simple duration for both platforms
        // Android accepts both number and pattern, but number is simpler
        Vibration.vibrate(1000); // 1 second vibration - longer and more noticeable
        console.log('Vibration called with duration 1000ms');
        
        // Wait to ensure vibration is felt before navigation
        // Use longer delay to ensure vibration completes
        setTimeout(() => {
          console.log('Navigating to ConnectWatch...');
          navigation.navigate('ConnectWatch');
        }, 1200); // Wait 1.2 seconds to ensure vibration completes
      }, 8000);
    } catch (error) {
      console.error('Error starting scan:', error);
      setIsScanning(false);
      Alert.alert(
        'Scan Error',
        'Failed to start scanning. Please try again.'
      );
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.backgroundOverlay} />
        <View style={styles.content}>
          {/* Header */}
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
            <Text style={styles.title}>Identity verification</Text>
          </View>

          {/* Instructions - Above scan area */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>
              Place your (Emirates ID/Passport) within the frame
            </Text>
          </View>

          {/* Scan Area */}
          <View style={styles.scanAreaContainer}>
            <View style={styles.scanArea}>
              {hasPermission && device ? (
                <>
                  {/* Camera View */}
                  <Camera
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={isScanning || !scanResult}
                    enableZoomGesture={false}
                  />
                  
                  {/* Overlay with frame guide */}
                  <View style={styles.overlay}>
                    {/* Darkened edges */}
                    <View style={styles.overlayTop} />
                    <View style={styles.overlayBottom} />
                    <View style={styles.overlayLeft} />
                    <View style={styles.overlayRight} />
                    
                    {/* Frame guide corners */}
                    <View style={styles.frameGuide}>
                      <View style={styles.corner} />
                      <View style={[styles.corner, styles.cornerTopRight]} />
                      <View style={[styles.corner, styles.cornerBottomLeft]} />
                      <View style={[styles.corner, styles.cornerBottomRight]} />
                    </View>
                    
                    {/* Scanning line effect */}
                    {isScanning && (
                      <Animated.View
                        style={[
                          styles.scanLine,
                          {
                            transform: [
                              {
                                translateY: scanLinePosition.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [
                                    0, // Start from top
                                    ((width - 60) * 0.6) * 0.95, // 95% from top
                                  ],
                                }),
                              },
                            ],
                          },
                        ]}
                      >
                        <View style={styles.scanLineGradient} />
                      </Animated.View>
                    )}
                  </View>
                </>
              ) : scanResult ? (
                <View style={styles.resultContainer}>
                  <Text style={styles.resultText}>✓</Text>
                  <Text style={styles.resultMessage}>{scanResult}</Text>
                </View>
              ) : (
                <View style={styles.placeholderContainer}>
                  <Text style={styles.placeholderText}>
                    {hasPermission ? 'Position your ID card within the frame' : 'Requesting camera permission...'}
                  </Text>
                  <View style={styles.frameGuide}>
                    <View style={styles.corner} />
                    <View style={[styles.corner, styles.cornerTopRight]} />
                    <View style={[styles.corner, styles.cornerBottomLeft]} />
                    <View style={[styles.corner, styles.cornerBottomRight]} />
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Scan Button */}
          {!isScanning && (
            <TouchableOpacity
              style={styles.scanButton}
              onPress={handleStartScan}
              activeOpacity={0.5}
            >
              <Text style={styles.scanButtonText}>
                Start Scan
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    flex: 1,
    padding: isTablet ? SPACING.xxl : 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    left: isTablet ? -SPACING.xxl : -20,
    marginBottom: isTablet ? SPACING.xxl : 30,
    marginTop: isTablet ? SPACING.xl : 20,
  },
  backButton: {
    marginLeft: SPACING.md,
    marginRight: 15,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.white,
  },
  title: {
    fontSize: isTablet ? 36 : FONT_SIZES.h1,
    fontFamily: Fonts.semiBold,
    color: COLORS.white,
    flex: 1,
  },
  scanAreaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:  isTablet ? 20 : -160,
    marginBottom: 0,
  },
  scanArea: {
    width: isTablet ? width - (SPACING.xxl * 4) : width - 20,
    height: isTablet ? (width - (SPACING.xxl * 4)) * 0.4 : (width - 20) * 0.5,
    maxWidth: isTablet ? 600 : width - 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: isTablet ? 24 : 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 3,
    height: '3%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  overlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '3%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  overlayLeft: {
    position: 'absolute',
    top: '5%',
    bottom: '5%',
    left: 0,
    width: '3%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  overlayRight: {
    position: 'absolute',
    top: '5%',
    bottom: '5%',
    right: 0,
    width: '3%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  placeholderText: {
    fontSize: FONT_SIZES.h3,
    fontFamily: Fonts.medium,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 20,
  },
  frameGuide: {
    width: '95%',
    height: '95%',
    position: 'absolute',
    zIndex: 10,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00FF00', // Green color
    borderWidth: 3,
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    left: 'auto',
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 0,
  },
  cornerBottomLeft: {
    bottom: 0,
    top: 'auto',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 3,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    top: 'auto',
    left: 'auto',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: '5%',
    right: '5%',
    width: '90%',
    height: 4,
    zIndex: 12,
    overflow: 'hidden',
  },
  scanLineGradient: {
    width: '100%',
    height: '100%',
    backgroundColor: '#00FF00', // Green color
    shadowColor: '#00FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  resultContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 60,
    color: COLORS.primary,
    marginBottom: 10,
  },
  resultMessage: {
    fontSize: FONT_SIZES.h3,
    fontFamily: Fonts.semiBold,
    color: COLORS.white,
    textAlign: 'center',
  },
  instructionsContainer: {
    marginTop: isTablet ? 120 : 80,
    alignSelf: 'center',
    marginBottom: 15,
    position:  isTablet ? 'absolute' : 'relative',
    paddingHorizontal: 20,
  },
  instructionsText: {
    fontSize: isTablet ? 22 : FONT_SIZES.h3,
    fontFamily: Fonts.semiBold,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: isTablet ? 32 : 28,
  },
  scanButton: {
    width: isTablet ? Math.min(width - (SPACING.xxl * 4), 500) : width - 80,
    height: isTablet ? 70 : 60,
    borderRadius: isTablet ? 35 : 30,
    backgroundColor: COLORS.buttonPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: isTablet ? SPACING.xxl : SPACING.lg,
    marginBottom: isTablet ? SPACING.xl : 20,
    shadowColor: COLORS.buttonPrimary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  scanButtonActive: {
    backgroundColor: COLORS.buttonPrimary,
    shadowColor: COLORS.buttonPrimary,
    opacity: 0.8,
  },
  scanButtonText: {
    color: COLORS.white,
    fontSize: isTablet ? 22 : FONT_SIZES.h3,
    fontFamily: Fonts.semiBold,
  },
});

export default IDScanScreen;
