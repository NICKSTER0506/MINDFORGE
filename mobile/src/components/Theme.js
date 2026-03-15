import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const darkColors = {
    background: '#0F172A',
    surface: '#1E293B',
    surfaceHighlight: '#334155',
    primary: '#6366F1',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: '#334155',
};

// Light mode is kept for compatibility but dark is default
const lightColors = {
    background: '#F1F5F9',
    surface: '#FFFFFF',
    surfaceHighlight: '#E2E8F0',
    primary: '#6366F1',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    border: '#CBD5E1',
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
        card: 14,
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

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('isDarkMode');
                if (savedTheme !== null) {
                    setIsDarkMode(JSON.parse(savedTheme));
                }
            } catch (error) {
                console.error("Error loading theme", error);
            }
        };
        loadTheme();
    }, []);

    // Default to dark mode, can be switched to light
    const colors = isDarkMode ? darkColors : lightColors;

    const currentTheme = {
        colors,
        ...sharedTheme,
        isDarkMode,
        setIsDarkMode,
    };

    return (
        <ThemeContext.Provider value={currentTheme}>
            {children}
        </ThemeContext.Provider>
    );
};
