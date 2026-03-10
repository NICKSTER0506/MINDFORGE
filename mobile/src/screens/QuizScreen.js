import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { ThemeContext } from '../components/Theme';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

const difficulties = {
    easy: { time: 20 },
    medium: { time: 30 },
    hard: { time: 45 },
};

export default function QuizScreen({ route, navigation }) {
    const { topic } = route.params;
    const { token, updateUserData } = useContext(AuthContext);
    const theme = useContext(ThemeContext);

    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isFetching, setIsFetching] = useState(true);

    // Track all answers for the Review screen
    const [userAnswers, setUserAnswers] = useState([]);

    // Stats tracking
    const [correctCounts, setCorrectCounts] = useState({ easy: 0, medium: 0, hard: 0 });

    // Timer
    const [timeLeft, setTimeLeft] = useState(20);
    const progressAnim = useRef(new Animated.Value(1)).current;

    // Scale animation for options
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const timerRef = useRef(null);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const endpoint = topic === 'Daily Challenge'
                ? `${API_BASE_URL}/api/quiz/daily`
                : `${API_BASE_URL}/api/quiz/${topic}`;

            const res = await fetch(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (res.status === 400) {
                alert(data.error || 'You have already completed today\'s Daily Challenge!');
                navigation.goBack();
                return;
            }

            if (data.length > 0) {
                setQuestions(data);
                startQuestion(data[0]);
            } else {
                alert('No questions found for this topic.');
                navigation.goBack();
            }
        } catch (error) {
            alert('Failed to load questions.');
            navigation.goBack();
        } finally {
            setIsFetching(false);
        }
    };

    const startQuestion = (question) => {
        setSelectedOption(null);
        const timeLimit = difficulties[question.difficulty].time;
        setTimeLeft(timeLimit);

        progressAnim.setValue(1);
        Animated.timing(progressAnim, {
            toValue: 0,
            duration: timeLimit * 1000,
            useNativeDriver: false,
        }).start();

        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleTimeOut();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleTimeOut = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        goToNextQuestion();
    };

    const handleOptionSelect = async (index) => {
        if (selectedOption !== null) return; // Prevent double taps
        setSelectedOption(index);

        // Stop timer
        if (timerRef.current) clearInterval(timerRef.current);
        progressAnim.stopAnimation();

        // Record the answer
        setUserAnswers(prev => {
            const newAnswers = [...prev];
            newAnswers[currentIndex] = index;
            return newAnswers;
        });

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Scale Animation
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.97, duration: 60, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 60, useNativeDriver: true })
        ]).start();

        const currentQ = questions[currentIndex];
        const isCorrect = index === currentQ.correctAnswerIndex;

        if (isCorrect) {
            setCorrectCounts(prev => ({
                ...prev,
                [currentQ.difficulty]: prev[currentQ.difficulty] + 1
            }));
        }

        setTimeout(() => {
            goToNextQuestion();
        }, 300); // 300ms highlight as requested
    };

    const goToNextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            startQuestion(questions[currentIndex + 1]);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/quiz/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    topic,
                    easyCorrect: correctCounts.easy,
                    mediumCorrect: correctCounts.medium,
                    hardCorrect: correctCounts.hard
                })
            });
            const data = await res.json();

            // Update user's context XP
            if (data.success && data.newTotalXP !== undefined) {
                await updateUserData({ totalXP: data.newTotalXP });
            }

            navigation.replace('Result', {
                resultData: data,
                totalCorrect: correctCounts.easy + correctCounts.medium + correctCounts.hard,
                totalQuestions: questions.length,
                questions: questions,
                userAnswers: userAnswers
            });

        } catch (err) {
            alert('Failed to submit results. Check connection.');
            navigation.replace('Home');
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
            padding: theme.spacing.m,
            paddingTop: 64,
            justifyContent: 'space-between',
        },
        loadingText: {
            color: theme.colors.textPrimary,
            textAlign: 'center',
            marginTop: 100,
        },
        topSection: {
            gap: theme.spacing.s,
        },
        progressText: {
            color: theme.colors.textSecondary,
            fontSize: theme.typography.label.fontSize,
            fontWeight: 'bold',
        },
        timerTrack: {
            height: 6,
            backgroundColor: theme.colors.border,
            borderRadius: 3,
            overflow: 'hidden',
        },
        timerFill: {
            height: '100%',
        },
        difficultyText: {
            color: theme.colors.textSecondary,
            fontSize: theme.typography.label.fontSize,
            textAlign: 'right',
        },
        middleSection: {
            flex: 1,
            justifyContent: 'center',
            paddingVertical: theme.spacing.xl,
        },
        questionText: {
            ...theme.typography.question,
            color: theme.colors.textPrimary,
            textAlign: 'center',
        },
        bottomSection: {
            gap: theme.spacing.m,
            marginBottom: theme.spacing.xl,
        },
        optionCard: {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: theme.spacing.m,
            borderRadius: theme.borderRadius.card,
            minHeight: 64,
            justifyContent: 'center',
            ...Platform.select({
                ios: {
                    shadowColor: '#000000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                },
                android: {
                    elevation: 1,
                },
            }),
        },
        optionCardSelected: {
            borderColor: theme.colors.accent,
            backgroundColor: theme.isDarkMode ? '#20202A' : '#F0EFFF', // subtle highlight matching theme
        },
        optionText: {
            ...theme.typography.option,
            color: theme.colors.textPrimary,
        }
    });

    if (isFetching || questions.length === 0) {
        return <View style={styles.container}><Text style={styles.loadingText}>Loading...</Text></View>;
    }

    const currentQ = questions[currentIndex];
    const timerColor = progressAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [theme.colors.timerWarning, '#8A2BE2', theme.colors.accent]
    });

    return (
        <View style={styles.container}>
            <View style={styles.topSection}>
                <Text style={styles.progressText}>Question {currentIndex + 1} / {questions.length}</Text>
                <View style={styles.timerTrack}>
                    <Animated.View style={[styles.timerFill, { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }), backgroundColor: timerColor }]} />
                </View>
                <Text style={styles.difficultyText}>{currentQ.difficulty.toUpperCase()}</Text>
            </View>

            <View style={styles.middleSection}>
                <Text style={styles.questionText}>{currentQ.questionText}</Text>
            </View>

            <View style={styles.bottomSection}>
                {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    return (
                        <TouchableOpacity
                            key={idx}
                            activeOpacity={1}
                            onPress={() => handleOptionSelect(idx)}
                        >
                            <Animated.View style={[
                                styles.optionCard,
                                isSelected && styles.optionCardSelected,
                                isSelected && { transform: [{ scale: scaleAnim }] }
                            ]}>
                                <Text style={styles.optionText}>{opt}</Text>
                            </Animated.View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}
