import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../components/Theme';
import { AuthContext } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
    const { user, logout } = useContext(AuthContext);
    const theme = useContext(ThemeContext);

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

    const toggleTheme = async () => {
        const newValue = !theme.isDarkMode;
        theme.setIsDarkMode(newValue);
        try {
            await AsyncStorage.setItem('isDarkMode', JSON.stringify(newValue));
        } catch (e) {
            console.error('Failed to save theme preference', e);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
            padding: theme.spacing.xl,
        },
        headerSection: {
            alignItems: 'center',
            marginTop: 64,
            marginBottom: theme.spacing.xl,
        },
        avatarCircle: {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: theme.colors.surface,
            borderWidth: 2,
            borderColor: theme.colors.accent,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: theme.spacing.m,
        },
        avatarText: {
            ...theme.typography.h1,
            color: theme.colors.accent,
            fontSize: 48,
        },
        usernameText: {
            ...theme.typography.h1,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.xs,
        },
        emailText: {
            color: theme.colors.textSecondary,
            fontSize: theme.typography.label.fontSize,
        },
        statsCard: {
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.l,
            borderRadius: theme.borderRadius.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
            alignItems: 'center',
            marginBottom: theme.spacing.xl,
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
        actionSection: {
            gap: theme.spacing.m,
            marginTop: 'auto',
            marginBottom: theme.spacing.xl,
        },
        backButton: {
            paddingVertical: 14,
            borderRadius: theme.borderRadius.button,
            borderWidth: 1,
            borderColor: theme.colors.border,
            alignItems: 'center',
        },
        backButtonText: {
            color: theme.colors.textPrimary,
            fontSize: 16,
        },
        toggleContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.l,
            borderRadius: theme.borderRadius.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
            marginBottom: theme.spacing.m,
        },
        toggleText: {
            color: theme.colors.textPrimary,
            fontSize: 16,
            fontWeight: '600',
        },
        logoutButton: {
            paddingVertical: 14,
            borderRadius: theme.borderRadius.button,
            borderWidth: 1,
            borderColor: theme.colors.timerWarning,
            alignItems: 'center',
            backgroundColor: 'rgba(255, 90, 95, 0.1)',
        },
        logoutButtonText: {
            color: theme.colors.timerWarning,
            fontSize: 16,
            fontWeight: 'bold',
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.headerSection}>
                <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{user?.username?.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={styles.usernameText}>{user?.username}</Text>
                <Text style={styles.emailText}>{user?.email}</Text>
            </View>

            <View style={styles.statsCard}>
                <Text style={styles.levelText}>Level {lvl}</Text>
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                </View>
                <Text style={styles.xpText}>{currentXp} / {reqXp} XP</Text>
            </View>

            <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>Dark Mode</Text>
                <Switch
                    value={theme.isDarkMode}
                    onValueChange={toggleTheme}
                    trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
                    thumbColor={theme.isDarkMode ? '#FFFFFF' : '#f4f3f4'}
                />
            </View>

            <View style={styles.actionSection}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>Back to Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
