import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../components/Theme';
import { AuthContext } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
    const { user, logout } = useContext(AuthContext);

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
    const progressPercent = (currentXp / reqXp) * 100;

    const handleLogout = () => {
        logout();
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <View style={styles.topSection}>
                <View style={styles.xpCard}>
                    <Text style={styles.levelText}>Level {lvl}</Text>
                    <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                    </View>
                    <Text style={styles.xpText}>{currentXp} / {reqXp} XP</Text>
                </View>
            </View>

            <View style={styles.middleSection}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => navigation.navigate('TopicSelection')}
                    activeOpacity={0.9}
                >
                    <Text style={styles.primaryButtonText}>Start Quiz</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.bottomSection}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Leaderboard')}>
                    <Text style={styles.secondaryButtonText}>Leaderboard</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={handleLogout}>
                    <Text style={styles.secondaryButtonText}>Logout ({user?.username})</Text>
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
    topSection: {
        marginTop: 64,
    },
    xpCard: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.l,
        borderRadius: theme.borderRadius.card,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: 'center',
    },
    levelText: {
        ...theme.typography.h1,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.s,
    },
    progressBarContainer: {
        width: '100%',
        height: 6,
        backgroundColor: theme.colors.border,
        borderRadius: 3,
        overflow: 'hidden',
        marginVertical: theme.spacing.m,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: theme.colors.accent,
    },
    xpText: {
        color: theme.colors.textSecondary,
        fontSize: theme.typography.label.fontSize,
    },
    middleSection: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: theme.colors.accent,
        paddingVertical: 18,
        paddingHorizontal: 48,
        borderRadius: theme.borderRadius.button,
        width: '100%',
        alignItems: 'center',
    },
    primaryButtonText: {
        color: theme.colors.textPrimary,
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1,
    },
    bottomSection: {
        gap: theme.spacing.m,
        marginBottom: theme.spacing.xl,
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
