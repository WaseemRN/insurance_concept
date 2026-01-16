import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import {
  Camera,
  useCameraDevices,
} from 'react-native-vision-camera';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const FRAME_WIDTH = isTablet ? Math.min(width * 0.7, 600) : width * 0.85;
const FRAME_HEIGHT = FRAME_WIDTH * 0.6;

const IDScannerScreen=() =>{
  const devices = useCameraDevices();
  const device = devices.back;

  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Camera.requestCameraPermission();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: FRAME_HEIGHT,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  if (!device) return null;

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />

      <Text style={styles.instruction}>
        Place your Emirates ID within the frame
      </Text>

      <View style={styles.frame}>
        <Animated.View
          style={[
            styles.scanLine,
            { transform: [{ translateY: scanLineAnim }] },
          ]}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  instruction: {
    position: 'absolute',
    top: isTablet ? 100 : 80,
    color: '#fff',
    fontSize: isTablet ? 22 : 18,
    fontWeight: '500',
  },

  frame: {
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },

  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#00ff88',
  },
});

export default IDScannerScreen;