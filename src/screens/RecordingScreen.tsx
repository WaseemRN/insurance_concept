import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  PermissionsAndroid,
  Alert,
  ImageBackground,
  Image,
} from 'react-native';
import { useSoundRecorder } from 'react-native-nitro-sound';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, Fonts } from '../constants/theme';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');
const MAX_RECORDING_TIME = 6000; // 6 seconds in milliseconds
const WAVE_BAR_COUNT = 50; // More bars for full width smoother wave effect

// Color array for wave bars - using electric blue theme
const WAVE_COLORS = [
  '#2196F3', // Electric Blue
  '#00BCD4', // Cyan
  '#3F51B5', // Indigo
  '#2196F3', // Blue
  '#00BCD4', // Cyan
  '#2196F3', // Electric Blue
];

const RecordingScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [waveData, setWaveData] = useState<number[]>([]);
  const [showLine, setShowLine] = useState(false);
  const [barColors, setBarColors] = useState<string[]>([]); // Store colors for each bar
  const [countdown, setCountdown] = useState(6); // Countdown from 6 to 0
  const timerRef = useRef<number | null>(null);
  const countdownTimerRef = useRef<number | null>(null);
  const animationLoopRef = useRef<number | null>(null);
  const colorChangeIntervalRef = useRef<number | null>(null);
  const isRecordingRef = useRef<boolean>(false); // Ref to track recording state
  const countdownReachedZeroRef = useRef<boolean>(false); // Track if countdown reached 0 naturally
  const waveAnimations = useRef<Animated.Value[]>(
    Array.from({ length: WAVE_BAR_COUNT }, () => new Animated.Value(0.3))
  ).current;
  const opacityAnimations = useRef<Animated.Value[]>(
    Array.from({ length: WAVE_BAR_COUNT }, () => new Animated.Value(0.6))
  ).current;
  // Color fade animations for wave bars
  const colorAnimations = useRef<Animated.Value[]>(
    Array.from({ length: WAVE_BAR_COUNT }, () => new Animated.Value(0))
  ).current;
  // Second effect: Pulsing ring animation
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.8)).current;
  // Second effect: Scanning line animation
  const scanLinePosition = useRef(new Animated.Value(0)).current;

  const { startRecorder, stopRecorder, dispose } = useSoundRecorder({
    subscriptionDuration: 50, // Update every 50ms for smooth animation
    onRecord: (e) => {
      if (isRecording) {
        let amplitude = 0.4; // Default base amplitude (higher for visibility)
        
        if (e.currentMetering !== undefined && !isNaN(e.currentMetering)) {
          // Convert metering (dB, typically -160 to 0) to amplitude (0-1 range)
          // Normalize: -100dB to -20dB maps to 0.3 to 1.0
          // This range is more sensitive to voice input
          const normalizedMetering = Math.max(-100, Math.min(-20, e.currentMetering));
          amplitude = Math.max(0.4, Math.min(1, ((normalizedMetering + 100) / 80) * 0.6 + 0.4));
          
          // Debug log (remove in production if needed)
          // console.log('Metering:', e.currentMetering, 'Amplitude:', amplitude);
        }
        
        updateWaveData(amplitude);
      }
    },
  });

  const updateWaveData = (amplitude: number) => {
    // Create wave pattern that responds to audio amplitude
    // Each bar will have different height based on its position and amplitude
    const time = Date.now() / 70; // Faster animation for more movement
    const newWaveData = Array.from({ length: WAVE_BAR_COUNT }, (_, i) => {
      // Create a wave pattern that moves across bars
      // Use different frequencies for different bars to create visual interest
      const phase1 = (i / WAVE_BAR_COUNT) * Math.PI * 10; // Primary wave
      const phase2 = (i / WAVE_BAR_COUNT) * Math.PI * 4; // Secondary wave
      const phase3 = (i / WAVE_BAR_COUNT) * Math.PI * 7; // Tertiary wave
      const wave1 = Math.sin(phase1 + time);
      const wave2 = Math.cos(phase2 + time * 0.8);
      const wave3 = Math.sin(phase3 + time * 1.2);
      
      // Combine waves and scale with amplitude
      const combinedWave = (wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2);
      
      // Base height increases with amplitude, wave adds variation
      // Smaller range: Minimum 0.3 (30%), maximum 0.8 (80%)
      const baseHeight = 0.3 + (amplitude * 0.25); // Base scales with amplitude
      const waveVariation = (combinedWave + 1) * 0.25 * amplitude; // Wave variation scales with amplitude
      const finalHeight = Math.max(0.3, Math.min(0.8, baseHeight + waveVariation));
      
      return finalHeight;
    });
    
    // Update animations smoothly with new data
    newWaveData.forEach((value, index) => {
      // Directly update animation for immediate response
      Animated.timing(waveAnimations[index], {
        toValue: value,
        duration: 50, // Very fast for responsive feel
        useNativeDriver: true,
      }).start();
      
      // Update opacity based on amplitude for pulsing effect
      const opacityValue = 0.5 + (amplitude * 0.4);
      Animated.timing(opacityAnimations[index], {
        toValue: Math.max(0.4, Math.min(0.9, opacityValue)),
        duration: 50,
        useNativeDriver: true,
      }).start();
      
      // Update color animation for color fade effect
      // Create a wave pattern for color opacity that moves across bars
      const colorPhase = (index / WAVE_BAR_COUNT) * Math.PI * 6 + time * 2;
      const colorWave = (Math.sin(colorPhase) + 1) / 2; // 0 to 1 range
      const colorValue = colorWave * amplitude; // Scale with audio amplitude
      
      Animated.timing(colorAnimations[index], {
        toValue: colorValue,
        duration: 100,
        useNativeDriver: false, // Color needs false
      }).start();
    });
  };

  // Function to randomly assign colors to bars
  const assignRandomColors = () => {
    const newColors = Array.from({ length: WAVE_BAR_COUNT }, () => {
      return WAVE_COLORS[Math.floor(Math.random() * WAVE_COLORS.length)];
    });
    setBarColors(newColors);
    return newColors;
  };

  const startWaveAnimation = () => {
    // Reset and assign random colors
    const colors = assignRandomColors();
    
    // Initialize with varying heights to show wave effect immediately
    const time = Date.now() / 80; // Faster initial animation
    waveAnimations.forEach((anim, index) => {
      const phase = (index / WAVE_BAR_COUNT) * Math.PI * 10;
      const wave = Math.sin(phase + time);
      const initialValue = 0.3 + (wave + 1) * 0.25; // Smaller initial values
      anim.setValue(initialValue);
    });
    
    // Initialize opacity animations
    opacityAnimations.forEach((anim, index) => {
      const phase = (index / WAVE_BAR_COUNT) * Math.PI * 6;
      const opacity = 0.5 + Math.sin(phase + time) * 0.3;
      anim.setValue(Math.max(0.4, Math.min(0.9, opacity)));
    });
    
    // Initialize color animations
    colorAnimations.forEach((anim, index) => {
      const colorPhase = (index / WAVE_BAR_COUNT) * Math.PI * 6 + time * 2;
      const colorWave = (Math.sin(colorPhase) + 1) / 2;
      anim.setValue(colorWave * 0.5);
    });
    
    // Start continuous color changes during full 6 seconds
    const startColorChanges = () => {
      // Clear any existing interval first
      if (colorChangeIntervalRef.current) {
        clearInterval(colorChangeIntervalRef.current);
        colorChangeIntervalRef.current = null;
      }
      
      // Change random bars' colors every 400ms for continuous effect
      colorChangeIntervalRef.current = setInterval(() => {
        // Check if still recording using ref (avoids stale closure)
        if (!isRecordingRef.current) {
          if (colorChangeIntervalRef.current) {
            clearInterval(colorChangeIntervalRef.current);
            colorChangeIntervalRef.current = null;
          }
          return;
        }
        
        // Randomly change some bars' colors
        setBarColors((prevColors) => {
          if (prevColors.length === 0) {
            // If colors are empty, reinitialize
            return assignRandomColors();
          }
          const newColors = [...prevColors];
          // Change 4-6 random bars at a time for more dynamic effect
          const changeCount = Math.floor(Math.random() * 3) + 4;
          for (let i = 0; i < changeCount; i++) {
            const randomIndex = Math.floor(Math.random() * WAVE_BAR_COUNT);
            newColors[randomIndex] = WAVE_COLORS[Math.floor(Math.random() * WAVE_COLORS.length)];
          }
          return newColors;
        });
      }, 400); // Change colors every 400ms - faster for continuous effect
    };
    
    // Start color changes immediately
    startColorChanges();
    
    // Start second effect: Pulsing ring animation (repeats continuously for 6 seconds)
    const startPulseAnimation = () => {
      // Reset to initial values
      pulseScale.setValue(1);
      pulseOpacity.setValue(0.8);
      
      const pulseLoop = () => {
        if (!isRecording) return;
        
        // Expand and fade out
        Animated.parallel([
          Animated.timing(pulseScale, {
            toValue: 1.6,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0,
            duration: 900,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (!isRecording) return;
          
          // Reset immediately and repeat
          pulseScale.setValue(1);
          pulseOpacity.setValue(0.8);
          
          // Continue loop immediately for continuous effect
          if (isRecording) {
            pulseLoop();
          }
        });
      };
      
      // Start the loop immediately
      pulseLoop();
    };
    
    // Start second effect: Scanning line animation (repeats continuously for 6 seconds)
    const startScanLineAnimation = () => {
      const scanLoop = () => {
        if (!isRecording) return;
        
        // Reset to start
        scanLinePosition.setValue(0);
        
        // Move from left to right
        Animated.timing(scanLinePosition, {
          toValue: 1,
          duration: 1500, // 1.5 seconds to cross
          useNativeDriver: true,
        }).start(() => {
          if (!isRecording) return;
          
          // Immediately restart for continuous effect
          setTimeout(() => {
            if (isRecording) {
              scanLoop();
            }
          }, 100);
        });
      };
      
      // Start the loop
      scanLoop();
    };
    
    // Start both second effects
    startPulseAnimation();
    startScanLineAnimation();
    
    // Start continuous animation loop for visible movement
    const animateContinuously = () => {
      if (!isRecording) return;
      
      const currentTime = Date.now() / 80; // Faster animation
      waveAnimations.forEach((anim, index) => {
        const phase = (index / WAVE_BAR_COUNT) * Math.PI * 10;
        const phase2 = (index / WAVE_BAR_COUNT) * Math.PI * 4;
        const phase3 = (index / WAVE_BAR_COUNT) * Math.PI * 7;
        const wave1 = Math.sin(phase + currentTime);
        const wave2 = Math.cos(phase2 + currentTime * 0.8);
        const wave3 = Math.sin(phase3 + currentTime * 1.2);
        const combinedWave = (wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2);
        const value = 0.3 + (combinedWave + 1) * 0.25; // Smaller range
        
        Animated.timing(anim, {
          toValue: value,
          duration: 80, // Faster updates
          useNativeDriver: true,
        }).start();
      });
      
      // Animate opacity for pulsing effect
      opacityAnimations.forEach((anim, index) => {
        const phase = (index / WAVE_BAR_COUNT) * Math.PI * 6;
        const opacity = 0.5 + Math.sin(phase + currentTime * 1.5) * 0.3;
        const opacityValue = Math.max(0.4, Math.min(0.9, opacity));
        
        Animated.timing(anim, {
          toValue: opacityValue,
          duration: 80,
          useNativeDriver: true,
        }).start();
      });
      
      // Animate color for continuous color fade effect
      colorAnimations.forEach((anim, index) => {
        const colorPhase = (index / WAVE_BAR_COUNT) * Math.PI * 6 + currentTime * 2;
        const colorWave = (Math.sin(colorPhase) + 1) / 2; // 0 to 1 range
        const colorValue = colorWave * 0.6; // Base color animation
        
        Animated.timing(anim, {
          toValue: colorValue,
          duration: 100,
          useNativeDriver: false, // Color needs false
        }).start();
      });
      
      animationLoopRef.current = setTimeout(animateContinuously, 80);
    };
    
    // Start the animation loop
    animationLoopRef.current = setTimeout(animateContinuously, 80);
  };

  const stopWaveAnimation = () => {
    // Clear any animation loops
    if (animationLoopRef.current !== null) {
      clearTimeout(animationLoopRef.current);
      animationLoopRef.current = null;
    }
    
    // Clear color change interval
    if (colorChangeIntervalRef.current !== null) {
      clearInterval(colorChangeIntervalRef.current);
      colorChangeIntervalRef.current = null;
    }
    
    // Reset colors
    setBarColors([]);
    
    // Stop wave animations
    waveAnimations.forEach((anim) => {
      anim.stopAnimation();
      Animated.timing(anim, {
        toValue: 0.3,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
    
    opacityAnimations.forEach((anim) => {
      anim.stopAnimation();
      Animated.timing(anim, {
        toValue: 0.6,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
    
    // Stop second effects
    pulseScale.stopAnimation();
    pulseOpacity.stopAnimation();
    scanLinePosition.stopAnimation();
    
    // Reset second effects
    Animated.parallel([
      Animated.timing(pulseScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(pulseOpacity, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scanLinePosition, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const requestAudioPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'This app needs access to your microphone to record audio.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission request error:', err);
        return false;
      }
    }
    // iOS permissions are handled automatically by the system
    return true;
  };

  const handleStartRecording = async () => {
    try {
      // Request permission first
      const hasPermission = await requestAudioPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Denied',
          'Microphone permission is required to record audio. Please enable it in app settings.'
        );
        return;
      }

      setIsRecording(true);
      isRecordingRef.current = true; // Update ref
      setShowLine(false);
      setRecordingTime(0);
      setWaveData(Array.from({ length: WAVE_BAR_COUNT }, () => 0.3));
      setCountdown(6); // Reset countdown to 6
      countdownReachedZeroRef.current = false; // Reset flag
      
      // Start recording with metering enabled
      await startRecorder(undefined, undefined, true);
      startWaveAnimation();

      // Start countdown timer (decreases every second)
      countdownTimerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // When countdown reaches 0
            countdownReachedZeroRef.current = true; // Mark that countdown reached 0
            if (countdownTimerRef.current) {
              clearInterval(countdownTimerRef.current);
              countdownTimerRef.current = null;
            }
            handleStopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Start timer for recording time tracking
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setRecordingTime(elapsed);

        if (elapsed >= MAX_RECORDING_TIME) {
          handleStopRecording();
        }
      }, 10);
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      Alert.alert(
        'Recording Error',
        'Failed to start recording. Please check microphone permissions and try again.'
      );
    }
  };

  const handleStopRecording = async () => {
    try {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }

      stopWaveAnimation();
      await stopRecorder();
      
      setIsRecording(false);
      isRecordingRef.current = false; // Update ref
      setShowLine(true);
      
      // Show toast and navigate to health record screen if countdown reached 0
      if (countdownReachedZeroRef.current) {
        Toast.show({
          type: 'success',
          text1: 'Record Submitted',
          text2: 'Your voice recording has been successfully submitted.',
        });
        
        // Navigate to health record screen after a short delay
        setTimeout(() => {
          navigation.navigate('HealthRecord');
        }, 1500);
      } else {
        // If stopped manually before countdown reaches 0
        setTimeout(() => {
          navigation.navigate('HealthRecord');
        }, 500);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      setIsRecording(false);
    }
  };

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}`;
  };


  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
      if (animationLoopRef.current) {
        clearTimeout(animationLoopRef.current);
      }
      if (colorChangeIntervalRef.current) {
        clearInterval(colorChangeIntervalRef.current);
      }
      dispose();
    };
  }, [dispose]);

  // Microphone Icon Component
  const MicrophoneIcon = () => (
    <Image
      source={require('../assets/images/mike.png')}
      style={styles.micIcon}
      resizeMode="contain"
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.backgroundOverlay} />
        <View style={styles.content}>
          {/* Back Button */}
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

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Voice Recognition</Text>
            <Text style={styles.subtitle}>
              Analyzing vocal stability and stress markers
            </Text>
          </View>

          {/* Step Indicator / Countdown */}
          <View style={styles.stepIndicator}>
            <Text style={styles.stepNumber}>{countdown}</Text>
          </View>

          {/* Full Width Wave Animation Container */}
          <View style={styles.waveContainerWrapper}>
            <View style={styles.waveContainer}>
              {isRecording ? (
                <>
                  {/* Wave Bars - Full Width */}
                  <View style={styles.waveBarsContainer}>
                    {waveAnimations.map((anim, index) => {
                      const baseColor = barColors[index] || WAVE_COLORS[0];
                      // Convert hex to RGB for color interpolation
                      const hexToRgb = (hex: string) => {
                        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                        return result
                          ? {
                              r: parseInt(result[1], 16),
                              g: parseInt(result[2], 16),
                              b: parseInt(result[3], 16),
                            }
                          : { r: 33, g: 150, b: 243 }; // Default electric blue
                      };
                      
                      const rgb = hexToRgb(baseColor);
                      const lightRgb = {
                        r: Math.min(255, rgb.r + 40),
                        g: Math.min(255, rgb.g + 40),
                        b: Math.min(255, rgb.b + 40),
                      };
                      const darkRgb = {
                        r: Math.max(0, rgb.r - 30),
                        g: Math.max(0, rgb.g - 30),
                        b: Math.max(0, rgb.b - 30),
                      };
                      
                      return (
                        <Animated.View
                          key={index}
                          style={[
                            styles.waveBar,
                            {
                              height: anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [20, 120],
                              }),
                              opacity: opacityAnimations[index],
                              backgroundColor: colorAnimations[index].interpolate({
                                inputRange: [0, 0.5, 1],
                                outputRange: [
                                  `rgb(${lightRgb.r}, ${lightRgb.g}, ${lightRgb.b})`,
                                  baseColor,
                                  `rgb(${darkRgb.r}, ${darkRgb.g}, ${darkRgb.b})`,
                                ],
                              }),
                            },
                          ]}
                        />
                      );
                    })}
                  </View>
                </>
              ) : showLine ? (
                <View style={styles.lineContainer}>
                  <View style={styles.line} />
                </View>
              ) : (
                <View style={styles.placeholderContainer}>
                  <Text style={styles.placeholderText}>
                    Press Record to start scanning
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Instruction Text */}
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              Say <Text style={styles.instructionHighlight}>'Ahhh'</Text> Clearly
            </Text>
          </View>

          {/* Small Scan Button with Microphone Icon */}
          <TouchableOpacity
            style={[
              styles.scanButton,
              isRecording && styles.scanButtonActive,
            ]}
            onPress={isRecording ? handleStopRecording : handleStartRecording}
            activeOpacity={0.5}
          >
            <MicrophoneIcon />
          </TouchableOpacity>

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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  // Back Button
  backButton: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
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
  // Header
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.h1,
    fontFamily: Fonts.bold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.body,
    fontFamily: Fonts.regular,
    color: COLORS.textSecondary,
    opacity: 0.8,
  },
  // Step Indicator
  stepIndicator: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  stepNumber: {
    fontSize: 64,
    fontFamily: Fonts.bold,
    color: COLORS.white,
  },
  // Wave Animation - Full Width
  waveContainerWrapper: {
    width: width - (SPACING.lg * 2),
    height: 200,
    marginBottom: SPACING.xxl,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  waveContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  waveBarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    paddingHorizontal: 2,
  },
  waveBar: {
    flex: 1,
    marginHorizontal: 0.5,
    borderRadius: 2,
    minHeight: 20,
  },
  lineContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: '90%',
    height: 3,
    backgroundColor: '#2196F3',
    borderRadius: 2,
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: FONT_SIZES.body,
    fontFamily: Fonts.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    opacity: 0.7,
  },
  // Instruction Text
  instructionContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  instructionText: {
    fontSize: FONT_SIZES.h2,
    fontFamily: Fonts.bold,
    color: COLORS.white,
    textAlign: 'center',
  },
  instructionHighlight: {
    fontFamily: Fonts.bold,
    color: COLORS.white,
  },
  // Small Scan Button with Microphone
  scanButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#2196F3',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  scanButtonActive: {
    backgroundColor: '#f44336',
    shadowColor: '#f44336',
  },
  // Microphone Icon
  micIcon: {
    width: 30,
    height: 30,
    tintColor: COLORS.white,
  },
});

export default RecordingScreen;
