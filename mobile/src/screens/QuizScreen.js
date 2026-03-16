import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated as RNAnimated } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  Easing 
} from 'react-native-reanimated';
import { 
    ThemeContext, 
    Card, 
    ProgressBar, 
    OptionButton 
} from '../components';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';
import * as Haptics from 'expo-haptics';

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

    // Slide animation values (Reanimated)
    const screenWidth = Dimensions.get('window').width;
    const slideOffset = useSharedValue(0);
    const slideOpacity = useSharedValue(1);
    const [isAnimating, setIsAnimating] = useState(false);

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

        // Legacy animation removed as it was unused in JSX

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
        if (theme.hapticsEnabled) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        goToNextQuestion();
    };

    const handleOptionSelect = async (index) => {
        if (selectedOption !== null) return; // Prevent double taps
        setSelectedOption(index);

        // Stop timer
        if (timerRef.current) clearInterval(timerRef.current);

        // Record the answer
        setUserAnswers(prev => {
            const newAnswers = [...prev];
            newAnswers[currentIndex] = index;
            return newAnswers;
        });

        if (theme.hapticsEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        // Scale Animation
        // Scale Animation (placeholder, can be moved to useAnimatedStyle if needed)

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
            setIsAnimating(true);
            
            // Animate current question sliding left (out of view)
            slideOffset.value = withTiming(-screenWidth, { 
                duration: 220, 
                easing: Easing.out(Easing.cubic) 
            });
            slideOpacity.value = withTiming(0, { duration: 220 });
            
            // After animation completes, switch to next question
            setTimeout(() => {
                setCurrentIndex(prev => {
                    const nextIndex = prev + 1;
                    
                    // Reset animation values for next question
                    slideOffset.value = 0;
                    slideOpacity.value = 1;
                    
                    // Start the new question
                    startQuestion(questions[nextIndex]);
                    setIsAnimating(false);
                    
                    return nextIndex;
                });
            }, 220);
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
        optionText: {
            ...theme.typography.option,
            color: theme.colors.textPrimary,
        }
    });

    // Moving hooks to the top level to follow Rules of Hooks
    // Temporarily disabled for diagnosis
    const slideStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: slideOffset.value }],
        opacity: slideOpacity.value,
    }));

    if (isFetching || questions.length === 0) {
        return <View style={styles.container}><Text style={styles.loadingText}>Loading...</Text></View>;
    }

    const currentQ = questions[currentIndex];

    return (
        <View style={styles.container}>
            <View style={styles.topSection}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xs }}>
                    <Text style={styles.progressText}>Question {currentIndex + 1} / {questions.length}</Text>
                    <Text style={styles.difficultyText}>{currentQ.difficulty.toUpperCase()}</Text>
                </View>
                <ProgressBar
                    percentage={100 - (timeLeft / difficulties[currentQ.difficulty].time) * 100}
                    variant="timer"
                    height={6}
                />
            </View>

            <Animated.View style={[styles.middleSection, slideStyle]}>
                <Text style={styles.questionText}>{currentQ.questionText}</Text>
            </Animated.View>

            <View style={styles.bottomSection}>
                {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = currentQ.correctAnswerIndex === idx;
                    const isWrong = isSelected && !isCorrect;
                    
                    return (
                        <OptionButton
                            key={idx}
                            option={opt}
                            isSelected={isSelected}
                            isCorrect={isCorrect}
                            isWrong={isWrong}
                            onPress={() => handleOptionSelect(idx)}
                            disabled={selectedOption !== null}
                        />
                    );
                })}
            </View>
        </View>
    );
}
