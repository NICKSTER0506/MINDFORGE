import React, { useContext } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { ThemeContext } from './Theme';

export default function Card({
    children,
    type = 'standard',
    width,
    style,
    padding = 'm',
}) {
    const theme = useContext(ThemeContext);

    const getPadding = () => {
        switch (padding) {
            case 'xs': return theme.spacing.xs;
            case 's': return theme.spacing.s;
            case 'm': return theme.spacing.m;
            case 'l': return theme.spacing.l;
            case 'xl': return theme.spacing.xl;
            default: return theme.spacing.m;
        }
    };

    const styles = StyleSheet.create({
        baseCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: getPadding(),
        },
        statCard: {
            width: '48%',
            padding: theme.spacing.m,
            alignItems: 'center',
        },
        chartCard: {
            paddingVertical: theme.spacing.l,
            marginBottom: theme.spacing.xl,
        },
        scoreCard: {
            padding: theme.spacing.xl,
            alignItems: 'center',
            width: '100%',
        },
        scoreValue: {
            fontSize: 48,
            fontWeight: 'bold',
            color: theme.colors.textPrimary,
        },
        primaryCard: {
            borderColor: theme.colors.primary,
            backgroundColor: theme.isDarkMode ? '#1E1B4B' : '#EEF2FF',
        },
    });

    const cardStyles = [
        styles.baseCard,
        type === 'stat' && styles.statCard,
        type === 'chart' && styles.chartCard,
        type === 'score' && styles.scoreCard,
        type === 'primary' && styles.primaryCard,
        width && { width },
        style,
    ];

    return (
        <View style={cardStyles}>
            {children}
        </View>
    );
}
