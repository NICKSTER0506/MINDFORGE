import React, { useEffect, useRef, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ThemeContext } from '../components/Theme';
import * as Haptics from 'expo-haptics';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';

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
            color: theme.colors.success,
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

                <Card type="score" style={{ width: '100%' }}>
                    <Text style={styles.scoreText}>{totalCorrect} / {totalQuestions}</Text>
                    <Text style={styles.scoreLabel}>Correct Answers</Text>

                    <View style={styles.divider} />

                    <Text style={styles.xpText}>+{xpEarned} XP</Text>
                    <Text style={styles.levelText}>New Level {newLevel}</Text>
                </Card>
            </Animated.View>

            <View style={styles.bottomSection}>
                <PrimaryButton
                    variant="gradient"
                    gradientColors={['#6366F1', '#818CF8']}
                    onPress={() => navigation.navigate('Review', { questions, userAnswers })}
                >
                    Review Answers
                </PrimaryButton>

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
