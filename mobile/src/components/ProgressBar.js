import React, { useContext, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from './Theme';

export default function ProgressBar({
    percentage = 0,
    animated = false,
    showLabel = false,
    label = '',
    height = 8,
    gradientColors = ['#6366F1', '#818CF8'],
    variant = 'default',
    colorOverride,
}) {
    const theme = useContext(ThemeContext);
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (animated) {
            Animated.timing(animatedValue, {
                toValue: percentage,
                duration: 500,
                useNativeDriver: false,
            }).start();
        }
    }, [percentage, animated]);

    const styles = StyleSheet.create({
        container: {
            width: '100%',
            marginBottom: theme.spacing.s,
        },
        track: {
            height: height,
            backgroundColor: theme.colors.border,
            borderRadius: height / 2,
            overflow: 'hidden',
        },
        fill: {
            height: '100%',
            borderRadius: height / 2,
        },
        labelContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.xs,
        },
        labelText: {
            color: theme.colors.textSecondary,
            fontSize: theme.typography.label.fontSize,
            fontWeight: '500',
        },
        // Variants
        primary: {
            gradientColors: ['#6366F1', '#818CF8'],
        },
        success: {
            gradientColors: ['#22C55E', '#4ADE80'],
        },
        warning: {
            gradientColors: ['#F59E0B', '#FBBF24'],
        },
        timer: {
            height: 6,
        },
    });

    const getGradientColors = () => {
        if (colorOverride) return [colorOverride, colorOverride];
        if (variant === 'success') return ['#22C55E', '#4ADE80'];
        if (variant === 'warning') return ['#F59E0B', '#FBBF24'];
        if (variant === 'timer') return ['#6366F1', '#818CF8'];
        return gradientColors;
    };

    const displayPercentage = animated ? animatedValue : percentage;

    return (
        <View style={styles.container}>
            {showLabel && (
                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>{label}</Text>
                    <Text style={styles.labelText}>{Math.round(percentage)}%</Text>
                </View>
            )}
            <View style={[styles.track, variant === 'timer' && styles.timer]}>
                <Animated.View
                    style={[
                        styles.fill,
                        {
                            width: animated
                                ? animatedValue.interpolate({
                                      inputRange: [0, 100],
                                      outputRange: ['0%', '100%'],
                                  })
                                : `${percentage}%`,
                        },
                    ]}
                >
                    <LinearGradient
                        colors={getGradientColors()}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.fill}
                    />
                </Animated.View>
            </View>
        </View>
    );
}
