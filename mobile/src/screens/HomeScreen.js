import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { ThemeContext } from '../components/Theme';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';
import PrimaryButton from '../components/PrimaryButton';
import Card from '../components/Card';

export default function HomeScreen({ navigation }) {
    const { user, token } = useContext(AuthContext);
    const theme = useContext(ThemeContext);

    const [dailyStats, setDailyStats] = useState({
        attemptedToday: 0,
        solvedToday: 0,
        accuracyToday: null
    });
    const [refreshing, setRefreshing] = useState(false);

    const fetchDailyStats = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/user/daily-stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setDailyStats({
                    attemptedToday: data.attemptedToday,
                    solvedToday: data.solvedToday,
                    accuracyToday: data.accuracyToday
                });
            }
        } catch (err) {
            console.error('Error fetching daily stats:', err);
        }
    };

    useEffect(() => {
        if (token) fetchDailyStats();
    }, [token]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchDailyStats();
        setRefreshing(false);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        scrollContent: {
            paddingHorizontal: theme.spacing.l,
            paddingTop: 60,
            paddingBottom: 40,
            flexGrow: 1,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.xl,
        },
        greeting: {
            flexDirection: 'column',
        },
        greetingText: {
            ...theme.typography.h2,
            color: theme.colors.textPrimary,
        },
        greetingSubtext: {
            ...theme.typography.label,
            color: theme.colors.textSecondary,
        },
        profileIcon: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: theme.colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        profileIconText: {
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: 20,
        },
        statsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.xl,
            gap: theme.spacing.s,
        },
        statCard: {
            flex: 1,
            backgroundColor: theme.colors.surfaceHighlight,
            borderRadius: theme.borderRadius.card,
            padding: theme.spacing.m,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: theme.colors.border,
            // Subtle shadow/glow
            shadowColor: theme.colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        statLabel: {
            ...theme.typography.caption,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginBottom: 4,
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        statValue: {
            ...theme.typography.h3,
            color: theme.colors.textPrimary,
            fontWeight: 'bold',
        },
        centerSection: {
            marginVertical: theme.spacing.xl,
            gap: theme.spacing.m,
        },
        cardGrid: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: theme.spacing.m,
            marginBottom: theme.spacing.m,
        },
        secondaryCard: {
            flex: 1,
        },
        cardTitle: {
            ...theme.typography.h3,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.xs,
            fontSize: 18,
        },
        cardSubtitle: {
            ...theme.typography.body,
            color: theme.colors.textSecondary,
            fontSize: 13,
        },
        statsButtonCard: {
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.m,
            borderRadius: theme.borderRadius.button,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.colors.border,
            marginTop: 'auto',
        },
        statsButtonText: {
            ...theme.typography.body,
            color: theme.colors.textPrimary,
            fontWeight: '600',
        },
    });

    return (
        <View style={styles.container}>
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER */}
                <View style={styles.header}>
                    <View style={styles.greeting}>
                        <Text style={styles.greetingText}>
                            Welcome, {user?.username || 'User'}
                        </Text>
                        <Text style={styles.greetingSubtext}>
                            Ready to learn something new?
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.profileIcon}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Text style={styles.profileIconText}>
                            {user?.username?.charAt(0).toUpperCase() || '👤'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* DAILY STATS ROW */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Attempted Today</Text>
                        <Text style={styles.statValue}>{dailyStats.attemptedToday}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Solved Today</Text>
                        <Text style={styles.statValue}>{dailyStats.solvedToday}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Accuracy Today</Text>
                        <Text style={styles.statValue}>
                            {dailyStats.accuracyToday !== null ? `${dailyStats.accuracyToday}%` : '—'}
                        </Text>
                    </View>
                </View>

                {/* MAIN ACTIONS */}
                <View style={styles.centerSection}>
                    <PrimaryButton
                        variant="gradient"
                        gradientColors={['#EF4444', '#B91C1C']}
                        onPress={() => navigation.navigate('DailyChallenge')}
                        style={{ width: '100%' }}
                    >
                        Practice Daily
                    </PrimaryButton>

                    <PrimaryButton
                        variant="gradient"
                        gradientColors={['#7C3AED', '#9333EA']}
                        onPress={() => navigation.navigate('TopicSelection')}
                        style={{ width: '100%' }}
                    >
                        Practice by Topic
                    </PrimaryButton>
                </View>

                {/* SECONDARY FEATURES */}
                <View style={styles.cardGrid}>
                    <TouchableOpacity
                        style={styles.secondaryCard}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('Leaderboard')}
                    >
                        <Card type="standard" width="100%" padding="m">
                            <Text style={styles.cardTitle}>Leaderboard</Text>
                            <Text style={styles.cardSubtitle}>See where you rank globally</Text>
                        </Card>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryCard}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Card type="standard" width="100%" padding="m">
                            <Text style={styles.cardTitle}>Profile</Text>
                            <Text style={styles.cardSubtitle}>Settings & Logout</Text>
                        </Card>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 20 }} />

                {/* STATISTICS ACCESS */}
                <TouchableOpacity
                    style={styles.statsButtonCard}
                    onPress={() => navigation.navigate('Stats')}
                >
                    <Text style={styles.statsButtonText}>View My Statistics</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
