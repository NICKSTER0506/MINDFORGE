import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { ThemeContext } from '../components/Theme';

export default function ReviewScreen({ route, navigation }) {
    const { questions, userAnswers } = route.params;
    const theme = useContext(ThemeContext);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
            padding: theme.spacing.m,
            paddingTop: 64,
        },
        header: {
            ...theme.typography.h1,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.l,
            textAlign: 'center',
        },
        scrollView: {
            flex: 1,
        },
        card: {
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.l,
            borderRadius: theme.borderRadius.card,
            marginBottom: theme.spacing.m,
            borderWidth: 1,
            borderColor: theme.colors.border,
            ...Platform.select({
                ios: {
                    shadowColor: '#000000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                },
                android: {
                    elevation: 2,
                },
            }),
        },
        questionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.s,
        },
        questionNumber: {
            color: theme.colors.textSecondary,
            fontWeight: 'bold',
        },
        difficulty: {
            color: theme.colors.textSecondary,
            fontSize: 12,
            textTransform: 'uppercase',
        },
        questionText: {
            ...theme.typography.leaderboardRow,
            color: theme.colors.textPrimary,
            fontWeight: '600',
            marginBottom: theme.spacing.m,
        },
        optionContainer: {
            padding: theme.spacing.s,
            borderRadius: theme.borderRadius.button,
            borderWidth: 1,
            borderColor: theme.colors.border,
            marginBottom: theme.spacing.xs,
        },
        optionText: {
            color: theme.colors.textPrimary,
            fontSize: 14,
        },
        // Correct answer style
        optionCorrect: {
            backgroundColor: 'rgba(34, 197, 94, 0.1)', // Light green
            borderColor: '#22c55e',
        },
        // Wrong answer picked by user
        optionWrong: {
            backgroundColor: 'rgba(239, 68, 68, 0.1)', // Light red
            borderColor: theme.colors.timerWarning,
        },
        backButton: {
            marginTop: theme.spacing.m,
            marginBottom: theme.spacing.xl,
            backgroundColor: theme.colors.accent,
            paddingVertical: 16,
            borderRadius: theme.borderRadius.button,
            alignItems: 'center',
        },
        backButtonText: {
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: 16,
        }
    });

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Quiz Review</Text>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {questions.map((q, index) => {
                    const selectedIdx = userAnswers[index];
                    const correctIdx = q.correctAnswerIndex;

                    return (
                        <View key={index} style={styles.card}>
                            <View style={styles.questionHeader}>
                                <Text style={styles.questionNumber}>Question {index + 1}</Text>
                                <Text style={styles.difficulty}>{q.difficulty}</Text>
                            </View>

                            <Text style={styles.questionText}>{q.questionText}</Text>

                            {q.options.map((opt, optIndex) => {
                                const isCorrectAnswer = optIndex === correctIdx;
                                const isUserPicked = optIndex === selectedIdx;

                                let optionStyle = styles.optionContainer;
                                if (isCorrectAnswer) {
                                    optionStyle = [styles.optionContainer, styles.optionCorrect];
                                } else if (isUserPicked && !isCorrectAnswer) {
                                    optionStyle = [styles.optionContainer, styles.optionWrong];
                                }

                                return (
                                    <View key={optIndex} style={optionStyle}>
                                        <Text style={styles.optionText}>{opt}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    );
                })}
            </ScrollView>

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={styles.backButtonText}>Return to Home</Text>
            </TouchableOpacity>
        </View>
    );
}
