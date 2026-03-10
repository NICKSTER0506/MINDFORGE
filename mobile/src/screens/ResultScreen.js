import React, { useEffect, useRef, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { ThemeContext } from '../components/Theme';
import * as Haptics from 'expo-haptics';

export default function ResultScreen({ route, navigation }) {
    const { resultData, totalCorrect, totalQuestions, questions, userAnswers } = route.params;
    const { xpEarned, newTotalXP, newLevel } = resultData;
    const theme = useContext(ThemeContext);

    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (xpEarned > 0) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        Animated.parallel([
            Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true })
        ]).start();
    }, []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
            padding: theme.spacing.xl,
            justifyContent: 'space-between',
        },
        content: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        header: {
            ...theme.typography.h1,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.xl,
        },
        scoreCard: {
            // ... omitting for brevity if not changed, but I will include full replacement for safety
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.xl,
            borderRadius: theme.borderRadius.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
            alignItems: 'center',
            width: '100%',
            ...Platform.select({
                ios: {
                    shadowColor: '#000000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                },
                android: {
                    elevation: 3,
                },
            }),
        },
        scoreText: {
            fontSize: 48,
            fontWeight: 'bold',
            color: theme.colors.textPrimary,
        },
        scoreLabel: {
            color: theme.colors.textSecondary,
            fontSize: theme.typography.label.fontSize,
            marginBottom: theme.spacing.m,
        },
        divider: {
            height: 1,
            backgroundColor: theme.colors.border,
            width: '80%',
            marginVertical: theme.spacing.m,
        },
        xpText: {
            fontSize: 32,
            fontWeight: 'bold',
            color: theme.colors.accent,
        },
        levelText: {
            color: theme.colors.textSecondary,
            marginTop: theme.spacing.s,
        },
        bottomSection: {
            gap: theme.spacing.m,
            marginBottom: theme.spacing.xl,
            width: '100%',
        },
        primaryButton: {
            backgroundColor: theme.colors.accent,
            paddingVertical: 18,
            borderRadius: theme.borderRadius.button,
            alignItems: 'center',
            ...Platform.select({
                ios: {
                    shadowColor: theme.colors.accent,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                },
                android: {
                    elevation: 6,
                },
            }),
        },
        primaryButtonText: {
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: 18,
            letterSpacing: 1,
        },
        secondaryButton: {
            paddingVertical: 14,
            borderRadius: theme.borderRadius.button,
            borderWidth: 1,
            borderColor: theme.colors.border,
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
        },
        secondaryButtonText: {
            color: theme.colors.textPrimary,
            fontSize: 16,
        }
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.content, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
                <Text style={styles.header}>Quiz Complete</Text>

                <View style={styles.scoreCard}>
                    <Text style={styles.scoreText}>{totalCorrect} / {totalQuestions}</Text>
                    <Text style={styles.scoreLabel}>Correct Answers</Text>

                    <View style={styles.divider} />

                    <Text style={styles.xpText}>+{xpEarned} XP</Text>
                    <Text style={styles.levelText}>New Level {newLevel}</Text>
                </View>

            </Animated.View>

            <View style={styles.bottomSection}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => navigation.navigate('Review', { questions, userAnswers })}
                    activeOpacity={0.9}
                >
                    <Text style={styles.primaryButtonText}>Review Answers</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => navigation.replace('Home')}
                >
                    <Text style={styles.secondaryButtonText}>Return to Home</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => navigation.navigate('Leaderboard')}
                >
                    <Text style={styles.secondaryButtonText}>View Leaderboard</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
