import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ThemeContext } from '../components/Theme';
import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }) {
    const { user } = useContext(AuthContext);
    const theme = useContext(ThemeContext);

    // Dummy level calc, normally backend sends this or we calculate it globally
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
            paddingTop: 80,
            paddingBottom: 40,
            justifyContent: 'space-between',
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
            fontSize: 28,
        },
        xpText: {
            color: theme.colors.textSecondary,
            fontSize: theme.typography.label.fontSize,
            fontWeight: '600',
            marginBottom: 4,
        },
        progressBarContainer: {
            width: '100%',
            height: 10,
            backgroundColor: theme.colors.border,
            borderRadius: 5,
            overflow: 'hidden',
        },
        progressBarFill: {
            height: '100%',
            borderRadius: 5,
        },
        centerSection: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        primaryButtonShadow: {
            width: '100%',
            borderRadius: 16,
            ...Platform.select({
                ios: {
                    shadowColor: '#6C63FF',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                },
                android: {
                    elevation: 10,
                },
            }),
        },
        primaryButtonGradient: {
            paddingVertical: 20,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
        },
        primaryButtonText: {
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: 18,
            letterSpacing: 1,
        },
        statsButton: {
            backgroundColor: theme.colors.surface,
            paddingVertical: 14,
            borderRadius: theme.borderRadius.button,
            alignItems: 'center',
            marginTop: theme.spacing.s,
            borderWidth: 1,
            borderColor: theme.colors.border,
            ...Platform.select({
                ios: {
                    shadowColor: '#0000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                },
                android: {
                    elevation: 2,
                },
            }),
        },
        statsButtonText: {
            color: theme.colors.textPrimary,
            fontWeight: '600',
            fontSize: 16,
        },
        bottomGrid: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: theme.spacing.m,
        },
        lowerSection: {
            gap: theme.spacing.m,
        },
        card: {
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.l,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: theme.colors.border,
            flex: 1, // Added flex: 1 for cards in bottomGrid
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
            color: theme.colors.textPrimary,
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 4,
        },
        cardSubtitle: {
            color: theme.colors.textSecondary,
            fontSize: 14,
        }
    });

    return (
        <View style={styles.container}>
            {/* TOP SECTION */}
            <View style={styles.topSection}>
                <View style={styles.levelHeader}>
                    <Text style={styles.levelText}>Level {lvl}</Text>
                    <Text style={styles.xpText}>{currentXp} / {reqXp} XP</Text>
                </View>
                <View style={styles.progressBarContainer}>
                    <LinearGradient
                        colors={['#6C63FF', '#8B85FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
                    />
                </View>
            </View>

            {/* CENTER SECTION */}
            <View style={styles.centerSection}>
                <TouchableOpacity
                    style={[styles.primaryButtonShadow, { marginBottom: theme.spacing.m }]}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('DailyChallenge')}
                >
                    <LinearGradient
                        colors={['#FF6B6B', '#FF8E53']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.primaryButtonGradient}
                    >
                        <Text style={styles.primaryButtonText}>🔥 Daily Challenge (2x XP)</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.primaryButtonShadow}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('TopicSelection')}
                >
                    <LinearGradient
                        colors={['#6C63FF', '#8B85FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.primaryButtonGradient}
                    >
                        <Text style={styles.primaryButtonText}>Practice by Topic</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* LOWER SECTION */}
            <View style={styles.lowerSection}>
                <View style={styles.bottomGrid}>
                    <TouchableOpacity
                        style={styles.card}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('Leaderboard')}
                    >
                        <Text style={styles.cardTitle}>Leaderboard</Text>
                        <Text style={styles.cardSubtitle}>See where you rank globally</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.card}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Text style={styles.cardTitle}>Profile</Text>
                        <Text style={styles.cardSubtitle}>Settings & Logout</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.statsButton}
                    onPress={() => navigation.navigate('Stats')}
                >
                    <Text style={styles.statsButtonText}>View My Statistics</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
