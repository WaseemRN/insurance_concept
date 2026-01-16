import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RecordingScreen from '../RecordingScreen';
import { useSoundRecorder } from 'react-native-nitro-sound';

// Mock the react-native-nitro-sound module
jest.mock('react-native-nitro-sound', () => ({
  useSoundRecorder: jest.fn(),
}));

// Mock Animated
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Animated: {
      ...RN.Animated,
      Value: jest.fn(() => ({
        setValue: jest.fn(),
        interpolate: jest.fn((config) => config.inputRange[1]),
      })),
      timing: jest.fn(() => ({
        start: jest.fn(),
      })),
      loop: jest.fn((anim) => anim),
      sequence: jest.fn((anims) => anims[0]),
      parallel: jest.fn((anims) => anims[0]),
    },
  };
});

describe('RecordingScreen', () => {
  const mockStartRecorder = jest.fn().mockResolvedValue('success');
  const mockStopRecorder = jest.fn().mockResolvedValue('success');
  const mockDispose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSoundRecorder as jest.Mock).mockReturnValue({
      startRecorder: mockStartRecorder,
      stopRecorder: mockStopRecorder,
      dispose: mockDispose,
    });
  });

  it('renders correctly with scan button', () => {
    const { getByText } = render(<RecordingScreen />);
    expect(getByText('Audio Scan')).toBeTruthy();
    expect(getByText('Start Scan')).toBeTruthy();
  });

  it('shows placeholder text when not recording', () => {
    const { getByText } = render(<RecordingScreen />);
    expect(getByText('Press Record to start scanning')).toBeTruthy();
  });

  it('starts recording when button is pressed', async () => {
    const { getByText } = render(<RecordingScreen />);
    const recordButton = getByText('Start Scan');

    fireEvent.press(recordButton);

    await waitFor(() => {
      expect(mockStartRecorder).toHaveBeenCalledWith(undefined, undefined, true);
    });

    await waitFor(() => {
      expect(getByText('Stop Recording')).toBeTruthy();
    });
  });

  it('stops recording when stop button is pressed', async () => {
    const { getByText } = render(<RecordingScreen />);
    const recordButton = getByText('Start Scan');

    // Start recording
    fireEvent.press(recordButton);

    await waitFor(() => {
      expect(getByText('Stop Recording')).toBeTruthy();
    });

    // Stop recording
    const stopButton = getByText('Stop Recording');
    fireEvent.press(stopButton);

    await waitFor(() => {
      expect(mockStopRecorder).toHaveBeenCalled();
    });
  });

  it('displays timer during recording', async () => {
    jest.useFakeTimers();
    const { getByText } = render(<RecordingScreen />);
    const recordButton = getByText('Start Scan');

    fireEvent.press(recordButton);

    await waitFor(() => {
      expect(getByText(/0\./)).toBeTruthy();
    });

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      const timerText = getByText(/1\./);
      expect(timerText).toBeTruthy();
    });

    jest.useRealTimers();
  });

  it('auto-stops recording after 6 seconds', async () => {
    jest.useFakeTimers();
    const { getByText } = render(<RecordingScreen />);
    const recordButton = getByText('Start Scan');

    fireEvent.press(recordButton);

    await waitFor(() => {
      expect(mockStartRecorder).toHaveBeenCalled();
    });

    jest.advanceTimersByTime(6000);

    await waitFor(() => {
      expect(mockStopRecorder).toHaveBeenCalled();
    });

    jest.useRealTimers();
  });

  it('shows line after recording stops', async () => {
    const { getByText, queryByText } = render(<RecordingScreen />);
    const recordButton = getByText('Start Scan');

    fireEvent.press(recordButton);

    await waitFor(() => {
      expect(getByText('Stop Recording')).toBeTruthy();
    });

    const stopButton = getByText('Stop Recording');
    fireEvent.press(stopButton);

    await waitFor(() => {
      expect(queryByText('Press Record to start scanning')).toBeFalsy();
      expect(queryByText('Stop Recording')).toBeFalsy();
    });
  });

  it('cleans up on unmount', () => {
    const { unmount } = render(<RecordingScreen />);
    unmount();
    expect(mockDispose).toHaveBeenCalled();
  });
});
