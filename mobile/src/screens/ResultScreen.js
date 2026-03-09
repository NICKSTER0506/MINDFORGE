import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { theme } from '../components/Theme';
import * as Haptics from 'expo-haptics';

export default function ResultScreen({ route, navigation }) {
    const { resultData, totalCorrect, totalQuestions } = route.params;
    const { xpEarned, newTotalXP, newLevel } = resultData;

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
                    onPress={() => navigation.replace('Home')}
                    activeOpacity={0.9}
                >
                    <Text style={styles.primaryButtonText}>Continue</Text>
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
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.xl,
        borderRadius: theme.borderRadius.card,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: 'center',
        width: '100%',
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
    },
    primaryButton: {
        backgroundColor: theme.colors.accent,
        paddingVertical: 18,
        borderRadius: theme.borderRadius.button,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: theme.colors.textPrimary,
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
    },
    secondaryButtonText: {
        color: theme.colors.textPrimary,
        fontSize: 16,
    }
});
