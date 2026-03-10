import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const lightColors = {
    background: '#F5F7FB',
    surface: '#FFFFFF',
    accent: '#6C63FF',
    timerWarning: '#FF5A5F',
    textPrimary: '#1A1A1A',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
};

const darkColors = {
    background: '#0F0F11',
    surface: '#17171C',
    accent: '#6C63FF',
    timerWarning: '#FF5A5F',
    textPrimary: '#FFFFFF',
    textSecondary: '#9CA3AF',
    border: '#26262C',
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
    },
    typography: {
        h1: { fontSize: 32, fontWeight: 'bold' },
        question: { fontSize: 20, fontWeight: '500' },
        option: { fontSize: 16 },
        label: { fontSize: 13 },
        leaderboardRow: { fontSize: 15 },
    }
};

// Default export for situations outside of components (fallback)
export const theme = {
    colors: lightColors, // Fallback to light mode
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

    // We can also let the user override this later with AsyncStorage
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
