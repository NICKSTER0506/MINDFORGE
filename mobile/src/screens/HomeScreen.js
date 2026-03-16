import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../components/Theme';
import { AuthContext } from '../context/AuthContext';
import PrimaryButton from '../components/PrimaryButton';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';

export default function HomeScreen({ navigation }) {
    const { user } = useContext(AuthContext);
    const theme = useContext(ThemeContext);

    // Dummy level calc
    const calculateLevel = (xp) => {
        let lvl = 1;
        let reqXp = 300;
        let currentXp = xp || 0;
        while (currentXp >= reqXp) {
            lvl++;
            currentXp -= reqXp;
            reqXp = 200 + (lvl * 100);
        }
        return { lvl, currentXp, reqXp };
    };

    const { lvl, currentXp, reqXp } = calculateLevel(user?.totalXP);
    const progressPercent = Math.min((currentXp / reqXp) * 100, 100);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
            paddingHorizontal: theme.spacing.l,
            paddingTop: 60,
            paddingBottom: 40,
            justifyContent: 'space-between',
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
        topSection: {
            marginBottom: 40,
        },
        levelHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: theme.spacing.s,
        },
        levelText: {
            ...theme.typography.h1,
            color: theme.colors.textPrimary,
        },
        xpText: {
            ...theme.typography.label,
            color: theme.colors.textSecondary,
            fontWeight: '600',
        },
        centerSection: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: theme.spacing.m,
        },
        cardGrid: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: theme.spacing.m,
        },
        cardContent: {
            flex: 1,
        },
        cardTitle: {
            ...theme.typography.h3,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.xs,
        },
        cardSubtitle: {
            ...theme.typography.body,
            color: theme.colors.textSecondary,
        },
        bottomButton: {
            marginTop: theme.spacing.s,
        },
        statsButtonText: {
            ...theme.typography.body,
            color: theme.colors.textPrimary,
            fontWeight: '600',
        },
    });

    return (
        <View style={styles.container}>
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

            {/* XP SECTION */}
            <View style={styles.topSection}>
                <View style={styles.levelHeader}>
                    <Text style={styles.levelText}>Level {lvl}</Text>
                    <Text style={styles.xpText}>{currentXp} / {reqXp} XP</Text>
                </View>
                <ProgressBar
                    percentage={progressPercent}
                    variant="primary"
                />
            </View>

            {/* CENTER SECTION */}
            <View style={styles.centerSection}>
                <PrimaryButton
                    variant="gradient"
                    gradientColors={['#EF4444', '#B91C1C']}
                    onPress={() => navigation.navigate('DailyChallenge')}
                    style={{ width: '100%' }}
                >
                    🔥 Daily Challenge (2x XP)
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

            {/* LOWER SECTION */}
            <View style={{ gap: theme.spacing.m }}>
                <View style={styles.cardGrid}>
                    <TouchableOpacity
                        style={[styles.cardContent, { flex: 1 }]}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('Leaderboard')}
                    >
                        <Card type="standard" width="100%">
                            <Text style={styles.cardTitle}>Leaderboard</Text>
                            <Text style={styles.cardSubtitle}>See where you rank globally</Text>
                        </Card>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.cardContent, { flex: 1 }]}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Card type="standard" width="100%">
                            <Text style={styles.cardTitle}>Profile</Text>
                            <Text style={styles.cardSubtitle}>Settings & Logout</Text>
                        </Card>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={{
                        backgroundColor: theme.colors.surface,
                        padding: theme.spacing.m,
                        borderRadius: theme.borderRadius.button,
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                    }}
                    onPress={() => navigation.navigate('Stats')}
                >
                    <Text style={styles.statsButtonText}>View My Statistics</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
