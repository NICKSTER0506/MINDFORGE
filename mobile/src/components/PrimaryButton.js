import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from './Theme';

export default function PrimaryButton({
    children,
    onPress,
    variant = 'gradient',
    gradientColors = ['#7C3AED', '#9333EA'],
    backgroundColor = '#7C3AED',
    disabled = false,
    style,
    textStyle,
}) {
    const theme = useContext(ThemeContext);

    const styles = StyleSheet.create({
        button: {
            borderRadius: theme.borderRadius.button,
            alignItems: 'center',
            justifyContent: 'center',
            ...Platform.select({
                ios: {
                    shadowColor: theme.colors.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 10,
                },
                android: {
                    elevation: 4,
                },
            }),
        },
        buttonGradient: {
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: theme.borderRadius.button,
            alignItems: 'center',
            justifyContent: 'center',
        },
        buttonSolid: {
            paddingVertical: 16,
            paddingHorizontal: 24,
            backgroundColor: backgroundColor,
            borderRadius: theme.borderRadius.button,
        },
        buttonText: {
            color: '#FFFFFF',
            fontWeight: '600',
            fontSize: 16,
            letterSpacing: 0.5,
            fontFamily: 'Inter',
        },
        disabled: {
            opacity: 0.6,
        },
    });

    const buttonStyle = [
        styles.button,
        disabled && styles.disabled,
        style,
    ];

    if (variant === 'gradient') {
        return (
            <TouchableOpacity
                style={buttonStyle}
                onPress={onPress}
                activeOpacity={0.8}
                disabled={disabled}
            >
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.buttonGradient, disabled && styles.disabled]}
                >
                    <Text style={[styles.buttonText, textStyle]}>
                        {children}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            style={[buttonStyle, styles.buttonSolid]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={disabled}
        >
            <Text style={[styles.buttonText, textStyle]}>
                {children}
            </Text>
        </TouchableOpacity>
    );
}
