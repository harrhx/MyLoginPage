import { Alert, Platform } from 'react-native';

type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

/**
 * Displays a cross-platform alert.
 * On Web, it uses the browser's native `alert`. Note that web alerts are very limited
 * and do not support multiple buttons. This implementation will execute the `onPress`
 * of the first button, if provided, after the user dismisses the alert.
 * @param title The title of the alert.
 * @param message The message body of the alert.
 * @param buttons An array of buttons for the alert.
 */
export const crossPlatformAlert = (title: string, message: string, buttons?: AlertButton[]) => {
  if (Platform.OS === 'web') {
    // Use the browser's simple alert for web
    alert(`${title}\n\n${message}`);
    // On web, we can't have custom buttons. We'll execute the first button's action.
    if (buttons && buttons.length > 0 && buttons[0].onPress) {
      buttons[0].onPress();
    }
  } else {
    // Use React Native's Alert API for native platforms
    Alert.alert(title, message, buttons);
  }
};
