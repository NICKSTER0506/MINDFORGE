import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from '../components/Theme';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';
import { useFocusEffect } from '@react-navigation/native';

export default function DailyChallengeScreen({ navigation }) {
    const theme = useContext(ThemeContext);
    const { token } = useContext(AuthContext);

    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState('');

    const fetchStatus = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/quiz/daily/status`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setStatus(data);
        } catch (err) {
            console.error('Failed to fetch daily status', err);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchStatus();
        }, [])
    );

    useEffect(() => {
        // Calculate countdown to midnight
        const calculateTimeLeft = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setHours(24, 0, 0, 0);
            const diff = tomorrow - now;

            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / 1000 / 60) % 60);
            setTimeLeft(`${h}h ${m}m`);
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 60000); // update every minute
        return () => clearInterval(timer);
    }, []);

    const handleStart = () => {
        navigation.navigate('Quiz', { topic: 'Daily Challenge' });
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#F5F7FB',
        },
        scrollContent: {
            padding: 24,
            paddingTop: 64,
            paddingBottom: 40,
        },
        headerContainer: {
            marginBottom: 32,
        },
        pageTitle: {
            fontSize: 28,
            fontWeight: 'bold',
            color: '#1A1A1A',
            marginBottom: 8,
        },
        pageSubtitle: {
            fontSize: 15,
            color: '#6B7280',
            lineHeight: 22,
        },
        sectionCard: {
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: '#E5E7EB',
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
        cardTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#1A1A1A',
            marginBottom: 16,
        },
        // --- Section 1: Today's Challenge ---
        challengeRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
        },
        challengeLabel: {
            fontSize: 15,
            color: '#6B7280',
            fontWeight: '500',
        },
        challengeValue: {
            fontSize: 15,
            color: '#1A1A1A',
            fontWeight: '600',
        },
        startButtonShadow: {
            marginTop: 20,
            borderRadius: 12,
            ...Platform.select({
                ios: {
                    shadowColor: '#6C63FF',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                },
                android: { elevation: 6 },
            }),
        },
        startButtonGradient: {
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            opacity: status?.completedToday ? 0.6 : 1,
        },
        startButtonText: {
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: 16,
            letterSpacing: 0.5,
        },
        // --- Section 2: Daily Streak ---
        streakGrid: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
        },
        streakBox: {
            alignItems: 'center',
        },
        streakValue: {
            fontSize: 24,
            fontWeight: '800',
            color: '#6C63FF',
        },
        streakLabel: {
            fontSize: 13,
            color: '#6B7280',
            marginTop: 4,
        },
        daysRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#F5F7FB',
            padding: 12,
            borderRadius: 12,
        },
        dayIndicator: {
            alignItems: 'center',
        },
        dayCircle: {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: '#E5E7EB',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 6,
        },
        dayCircleActive: {
            backgroundColor: '#6C63FF',
        },
        dayCheck: {
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: 14,
        },
        dayText: {
            fontSize: 12,
            color: '#6B7280',
            fontWeight: '500',
        },
        // --- Section 3: Streak Rewards ---
        rewardRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
        },
        rewardBullet: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#6C63FF',
            marginRight: 12,
        },
        rewardText: {
            fontSize: 15,
            color: '#1A1A1A',
            fontWeight: '500',
        },
        rewardSub: {
            fontWeight: 'bold',
            color: '#8B85FF',
        },
        // --- Section 4: Timer ---
        timerCard: {
            backgroundColor: '#F5F7FB',
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
            marginBottom: 24,
            borderWidth: 1,
            borderColor: '#E5E7EB',
        },
        timerText: {
            fontSize: 15,
            color: '#1A1A1A',
            fontWeight: '600',
        },
        timerHighlight: {
            color: '#6C63FF',
            fontWeight: 'bold',
        },
        // --- Section 5: Last Result ---
        resultGrid: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        resultBox: {
            alignItems: 'center',
        },
        resultVal: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#1A1A1A',
            marginBottom: 4,
        },
        resultLabel: {
            fontSize: 12,
            color: '#6B7280',
        }
    });

    if (loading || !status) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#6C63FF" />
            </View>
        );
    }

    const { completedToday, dailyStreak, bestStreak, lastResult } = status;

    // Render the day bubbles (1 to 4 to match the user's "Day 1 ✓ Day 2 ✓" spec)
    // We just visually light them up based on the current streak (up to 4 for this UI view)
    const renderDayIndicators = () => {
        const days = [1, 2, 3, 4];
        return (
            <View style={styles.daysRow}>
                {days.map(day => {
                    const isActive = day <= dailyStreak;
                    return (
                        <View key={day} style={styles.dayIndicator}>
                            <View style={[styles.dayCircle, isActive && styles.dayCircleActive]}>
                                {isActive && <Text style={styles.dayCheck}>✓</Text>}
                            </View>
                            <Text style={styles.dayText}>Day {day}</Text>
                        </View>
                    );
                })}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* PAGE HEADER */}
                <View style={styles.headerContainer}>
                    <Text style={styles.pageTitle}>Daily Challenge</Text>
                    <Text style={styles.pageSubtitle}>Complete today's challenge to earn bonus XP and maintain your streak.</Text>
                </View>

                {/* SECTION 1: TODAY'S CHALLENGE */}
                <View style={styles.sectionCard}>
                    <Text style={styles.cardTitle}>Today's Challenge</Text>

                    <View style={styles.challengeRow}>
                        <Text style={styles.challengeLabel}>Questions</Text>
                        <Text style={styles.challengeValue}>10 Questions</Text>
                    </View>
                    <View style={styles.challengeRow}>
                        <Text style={styles.challengeLabel}>Difficulty</Text>
                        <Text style={styles.challengeValue}>Mixed</Text>
                    </View>
                    <View style={styles.challengeRow}>
                        <Text style={styles.challengeLabel}>Reward</Text>
                        <Text style={[styles.challengeValue, { color: '#22c55e' }]}>+50 Bonus XP</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.startButtonShadow}
                        activeOpacity={0.8}
                        onPress={handleStart}
                        disabled={completedToday}
                    >
                        <LinearGradient
                            colors={completedToday ? ['#9CA3AF', '#9CA3AF'] : ['#6C63FF', '#8B85FF']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.startButtonGradient}
                        >
                            <Text style={styles.startButtonText}>
                                {completedToday ? 'Completed' : 'Start Challenge'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* SECTION 2: DAILY STREAK TRACKER */}
                <View style={styles.sectionCard}>
                    <Text style={styles.cardTitle}>Daily Streak</Text>
                    <View style={styles.streakGrid}>
                        <View style={styles.streakBox}>
                            <Text style={styles.streakValue}>{dailyStreak} days</Text>
                            <Text style={styles.streakLabel}>Current Streak</Text>
                        </View>
                        <View style={styles.streakBox}>
                            <Text style={styles.streakValue}>{bestStreak} days</Text>
                            <Text style={styles.streakLabel}>Best Streak</Text>
                        </View>
                    </View>
                    {renderDayIndicators()}
                </View>

                {/* SECTION 3: STREAK REWARDS */}
                <View style={styles.sectionCard}>
                    <Text style={styles.cardTitle}>Streak Rewards</Text>

                    <View style={styles.rewardRow}>
                        <View style={styles.rewardBullet} />
                        <Text style={styles.rewardText}>3 Day Streak <Text style={{ color: '#E5E7EB' }}>→</Text> <Text style={styles.rewardSub}>+50 XP Bonus</Text></Text>
                    </View>
                    <View style={styles.rewardRow}>
                        <View style={styles.rewardBullet} />
                        <Text style={styles.rewardText}>5 Day Streak <Text style={{ color: '#E5E7EB' }}>→</Text> <Text style={styles.rewardSub}>+100 XP Bonus</Text></Text>
                    </View>
                    <View style={[styles.rewardRow, { marginBottom: 0 }]}>
                        <View style={styles.rewardBullet} />
                        <Text style={styles.rewardText}>7 Day Streak <Text style={{ color: '#E5E7EB' }}>→</Text> <Text style={styles.rewardSub}>Special Badge</Text></Text>
                    </View>
                </View>

                {/* SECTION 4: COUNTDOWN TIMER */}
                <View style={styles.timerCard}>
                    <Text style={styles.timerText}>
                        Next challenge available in: <Text style={styles.timerHighlight}>{timeLeft}</Text>
                    </Text>
                </View>

                {/* SECTION 5: YESTERDAY'S RESULT */}
                <View style={styles.sectionCard}>
                    <Text style={styles.cardTitle}>Last Challenge Result</Text>
                    {lastResult ? (
                        <View style={styles.resultGrid}>
                            <View style={styles.resultBox}>
                                <Text style={styles.resultVal}>{lastResult.score} / {lastResult.total}</Text>
                                <Text style={styles.resultLabel}>Score</Text>
                            </View>
                            <View style={styles.resultBox}>
                                <Text style={[styles.resultVal, { color: '#22c55e' }]}>+{lastResult.xpEarned}</Text>
                                <Text style={styles.resultLabel}>XP Earned</Text>
                            </View>
                            <View style={styles.resultBox}>
                                <Text style={styles.resultVal}>{lastResult.accuracy}%</Text>
                                <Text style={styles.resultLabel}>Accuracy</Text>
                            </View>
                        </View>
                    ) : (
                        <Text style={styles.pageSubtitle}>No record found for previous daily challenges.</Text>
                    )}
                </View>

            </ScrollView>
        </View>
    );
}
