import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getApiBaseUrl = () => {
    // If running on web, always use localhost
    if (Platform.OS === 'web') {
        return 'http://localhost:5000';
    }

    // Try to get the IP from Expo's config
    const hostUri = Constants.expoConfig?.hostUri;

    if (hostUri) {
        // hostUri looks like: 192.168.1.18:8081
        // We want to extract the IP and use port 5000
        const ipAddress = hostUri.split(':')[0];
        return `http://${ipAddress}:5000`;
    }

    // Fallback if hostUri isn't available (e.g. built app)
    // Replace with your production domain later
    return 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();
