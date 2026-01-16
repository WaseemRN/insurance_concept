import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import IDScannerScreen from '../screens/IDScannerScreen';
import SplashScreen from '../screens/SplashScreen';
import IdentitySelectionScreen from '../screens/IdentitySelectionScreen';
import InsuranceApprovedScreen from '../screens/InsuranceApprovedScreen';
import ConnectWatchScreen from '../screens/ConnectWatchScreen';
import OnboardingQuestionScreen from '../screens/OnboardingQuestionScreen';
import BiometricCheckScreen from '../screens/BiometricCheckScreen';
import HealthScoreScreen from '../screens/HealthScoreScreen';
import PaymentScreen from '../screens/PaymentScreen';
import CoverageSuccessScreen from '../screens/CoverageSuccessScreen';
import RecordingScreen from '../screens/RecordingScreen';
import AwardScreen from '../screens/AwardScreen';
import HealthRecord from '../screens/HealthRecord';
import IDScanScreen from '../screens/IDScanScreen';
import LiveMeshScreen from '../screens/LiveMeshScreen';
import LiveMeshRegionScreen from '../screens/LiveMeshRegionScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="IdentitySelection"
          component={IdentitySelectionScreen}
        />
        <Stack.Screen
          name="InsuranceApproved"
          component={InsuranceApprovedScreen}
          options={{
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="ConnectWatch"
          component={ConnectWatchScreen}
        />
        <Stack.Screen
          name="OnboardingQuestion"
          component={OnboardingQuestionScreen}
        />
        <Stack.Screen
          name="BiometricCheck"
          component={BiometricCheckScreen}
        />
        <Stack.Screen
          name="HealthScore"
          component={HealthScoreScreen}
        />
        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
        />
        <Stack.Screen
          name="CoverageSuccess"
          component={CoverageSuccessScreen}
        />
        <Stack.Screen
          name="Recording"
          component={RecordingScreen}
        />
        <Stack.Screen
          name="Award"
          component={AwardScreen}
          options={{
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="HealthRecord"
          component={HealthRecord}
          options={{
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="IDScan"
          component={IDScanScreen}
        />
        <Stack.Screen
          name="LiveMesh"
          component={LiveMeshScreen}
        />
        <Stack.Screen
          name="LiveMeshRegion"
          component={LiveMeshRegionScreen}
        />
        {/* <Stack.Screen
          name="IDScanner"
          component={IDScannerScreen}
          options={{
            animation: 'fade',
          }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
