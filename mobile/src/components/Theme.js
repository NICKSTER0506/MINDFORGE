import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const darkColors = {
    background: '#0B1220',
    surface: '#111827',
    surfaceHighlight: '#1F2937',
    primary: '#7C3AED',
    accentSoft: 'rgba(124,58,237,0.25)',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    textPrimary: '#E5E7EB',
    textSecondary: '#9CA3AF',
    border: '#1F2937',
};

// Light mode is kept for compatibility
const lightColors = {
    background: '#F9FAFB',
    surface: '#FFFFFF',
    surfaceHighlight: '#F3F4F6',
    primary: '#7C3AED',
    accentSoft: 'rgba(124,58,237,0.1)',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
};

const sharedTheme = {
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
    },
    borderRadius: {
        card: 16,
        button: 12,
        circle: 100,
    },
    typography: {
        h1: { fontSize: 28, fontWeight: 'bold', fontFamily: 'Inter' },
        h2: { fontSize: 24, fontWeight: '600', fontFamily: 'Inter' },
        h3: { fontSize: 20, fontWeight: '600', fontFamily: 'Inter' },
        body: { fontSize: 16, fontWeight: '400', fontFamily: 'Inter' },
        label: { fontSize: 14, fontWeight: '500', fontFamily: 'Inter' },
        caption: { fontSize: 12, fontWeight: '400', fontFamily: 'Inter' },
        // Legacy support
        question: { fontSize: 20, fontWeight: '500', fontFamily: 'Inter' },
        option: { fontSize: 16, fontFamily: 'Inter' },
        leaderboardRow: { fontSize: 15, fontFamily: 'Inter' },
    }
};

// Default export for situations outside of components (fallback)
// Note: Use ThemeContext.Provider in your app root for dynamic theming
export const theme = {
    colors: darkColors, // Default to dark mode
    ...sharedTheme
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [hapticsEnabled, setHapticsEnabled] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const results = await AsyncStorage.multiGet(['isDarkMode', 'hapticsEnabled', 'soundEnabled']);
                
                results.forEach(([key, value]) => {
                    if (value !== null) {
                        const parsedValue = JSON.parse(value);
                        if (key === 'isDarkMode') setIsDarkMode(parsedValue);
                        if (key === 'hapticsEnabled') setHapticsEnabled(parsedValue);
                        if (key === 'soundEnabled') setSoundEnabled(parsedValue);
                    }
                });
            } catch (error) {
                console.error("Error loading settings", error);
            }
        };
        loadSettings();
    }, []);

    // Default to dark mode, can be switched to light
    const colors = isDarkMode ? darkColors : lightColors;

    const currentTheme = {
        colors,
        ...sharedTheme,
        isDarkMode,
        setIsDarkMode,
        hapticsEnabled,
        setHapticsEnabled,
        soundEnabled,
        setSoundEnabled,
    };

    return (
        <ThemeContext.Provider value={currentTheme}>
            {children}
        </ThemeContext.Provider>
    );
};
