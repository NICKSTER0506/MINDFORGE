import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from '../components/Theme';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

const screenWidth = Dimensions.get('window').width;

export default function StatsScreen() {
    const theme = useContext(ThemeContext);
    const { token } = useContext(AuthContext);

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/user/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setStats(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        scrollContent: {
            padding: theme.spacing.xl,
            paddingTop: 64,
            paddingBottom: 40,
        },
        headerText: {
            ...theme.typography.h1,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.xl,
            textAlign: 'left',
        },
        grid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.xl,
        },
        card: {
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            padding: theme.spacing.m,
            marginBottom: theme.spacing.m,
            borderWidth: 1,
            borderColor: theme.colors.border,
            ...Platform.select({
                ios: {
                    shadowColor: '#000000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 6,
                },
                android: {
                    elevation: 2,
                },
            }),
        },
        statBox: {
            width: '48%',
        },
        statValue: {
            fontSize: 28,
            fontWeight: 'bold',
            color: theme.colors.textPrimary,
            marginBottom: 4,
        },
        statLabel: {
            fontSize: 13,
            color: theme.colors.textSecondary,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.l,
        },
        chartCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            paddingVertical: theme.spacing.l,
            marginBottom: theme.spacing.xl,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        chartTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.textPrimary,
            paddingHorizontal: theme.spacing.m,
            marginBottom: theme.spacing.m,
        },
        barContainer: {
            marginBottom: theme.spacing.m,
        },
        barHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 6,
        },
        barLabel: {
            fontSize: 14,
            color: theme.colors.textPrimary,
            fontWeight: '500',
        },
        barPercent: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            fontWeight: '600',
        },
        barTrack: {
            height: 8,
            backgroundColor: theme.colors.border,
            borderRadius: 4,
            overflow: 'hidden',
        },
        barFill: {
            height: '100%',
            borderRadius: 4,
        },
        recentRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: theme.spacing.m,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        recentLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.m,
        },
        recentIcon: {
            width: 10,
            height: 10,
            borderRadius: 5,
        },
        recentTitle: {
            fontSize: 15,
            color: theme.colors.textPrimary,
            fontWeight: '600',
        },
        recentScore: {
            fontSize: 15,
            color: theme.colors.textSecondary,
            fontWeight: '500',
        }
    });

    if (loading || !stats) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.accent} />
            </View>
        );
    }

    const { overview, recentScores, topicAccuracy, difficultyAccuracy, recentQuizzes } = stats;

    const chartConfig = {
        backgroundGradientFrom: theme.colors.surface,
        backgroundGradientTo: theme.colors.surface,
        color: (opacity = 1) => `rgba(139, 133, 255, ${opacity})`, // Solid purple line
        labelColor: (opacity = 1) => theme.colors.textSecondary,
        strokeWidth: 3,
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
        propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#6C63FF"
        },
        propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: theme.colors.border,
            strokeWidth: 1,
        }
    };

    const renderProgressBar = (label, percent) => (
        <View style={styles.barContainer} key={label}>
            <View style={styles.barHeader}>
                <Text style={styles.barLabel}>{label}</Text>
                <Text style={styles.barPercent}>{percent}%</Text>
            </View>
            <View style={styles.barTrack}>
                <LinearGradient
                    colors={['#6C63FF', '#8B85FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.barFill, { width: `${percent}%` }]}
                />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <Text style={styles.headerText}>Statistics</Text>

                {/* SECTION 1: OVERVIEW SETTINGS */}
                <View style={styles.grid}>
                    <View style={[styles.card, styles.statBox]}>
                        <Text style={styles.statValue}>{overview.quizzesPlayed}</Text>
                        <Text style={styles.statLabel}>Quizzes Played</Text>
                    </View>
                    <View style={[styles.card, styles.statBox]}>
                        <Text style={styles.statValue}>{overview.wins}</Text>
                        <Text style={styles.statLabel}>Wins</Text>
                    </View>
                    <View style={[styles.card, styles.statBox]}>
                        <Text style={styles.statValue}>{overview.accuracy}%</Text>
                        <Text style={styles.statLabel}>Accuracy</Text>
                    </View>
                    <View style={[styles.card, styles.statBox]}>
                        <Text style={styles.statValue}>{overview.bestStreak}</Text>
                        <Text style={styles.statLabel}>Best Streak</Text>
                    </View>
                </View>

                {/* SECTION 2: PERFORMANCE CHART */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Recent Performance</Text>
                    <LineChart
                        data={{
                            labels: recentScores.map((_, i) => `#${i + 1}`),
                            datasets: [{
                                data: recentScores.length ? recentScores : [0, 0] // Fallback if no quizzes
                            }]
                        }}
                        width={screenWidth - (theme.spacing.xl * 2)} // Screen minus padding
                        height={180}
                        yAxisSuffix="%"
                        chartConfig={chartConfig}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                            paddingRight: 30, // fixing overlap
                        }}
                        withInnerLines={true}
                        withOuterLines={false}
                        withVerticalLines={false}
                    />
                </View>

                {/* SECTION 3: TOPIC ACCURACY */}
                <Text style={styles.sectionTitle}>Topic Accuracy</Text>
                <View style={[styles.card, { marginBottom: theme.spacing.xl }]}>
                    {topicAccuracy.length === 0 ? (
                        <Text style={styles.statLabel}>Play quizzes to see data here!</Text>
                    ) : (
                        topicAccuracy.map((item) => renderProgressBar(item.topic, item.accuracy))
                    )}
                </View>

                {/* SECTION 4: DIFFICULTY PERFORMANCE */}
                <Text style={styles.sectionTitle}>Difficulty Performance</Text>
                <View style={[styles.card, { marginBottom: theme.spacing.xl }]}>
                    {renderProgressBar('Easy', difficultyAccuracy.easy)}
                    {renderProgressBar('Medium', difficultyAccuracy.medium)}
                    {renderProgressBar('Hard', difficultyAccuracy.hard)}
                </View>

                {/* SECTION 5: RECENT QUIZZES */}
                <Text style={styles.sectionTitle}>Recent Quizzes</Text>
                <View style={styles.card}>
                    {recentQuizzes.length === 0 ? (
                        <Text style={styles.statLabel}>No quizzes completed yet.</Text>
                    ) : (
                        recentQuizzes.map((quiz, index) => {
                            // Indicator color
                            const iconColor = quiz.percent >= 70 ? '#22c55e' : quiz.percent >= 40 ? '#eab308' : '#ef4444';

                            // Remove bottom border for last item
                            const rowStyle = index === recentQuizzes.length - 1
                                ? [styles.recentRow, { borderBottomWidth: 0 }]
                                : styles.recentRow;

                            return (
                                <View key={index} style={rowStyle}>
                                    <View style={styles.recentLeft}>
                                        <View style={[styles.recentIcon, { backgroundColor: iconColor }]} />
                                        <Text style={styles.recentTitle}>{quiz.topic}</Text>
                                    </View>
                                    <Text style={styles.recentScore}>{quiz.scoreText}</Text>
                                </View>
                            );
                        })
                    )}
                </View>

            </ScrollView>
        </View>
    );
}
