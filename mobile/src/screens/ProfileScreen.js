import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../components/Theme';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';

export default function ProfileScreen({ navigation }) {
    const { user, logout } = useContext(AuthContext);
    const theme = useContext(ThemeContext);

    const knowledgePoints = user?.totalXP || 0;


    const handleLogout = () => {
        logout();
        navigation.replace('Login');
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
            borderColor: theme.colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: theme.spacing.m,
        },
        avatarText: {
            ...theme.typography.h1,
            color: theme.colors.primary,
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
        levelText: {
            ...theme.typography.h1,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.s,
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
        toggleText: {
            color: theme.colors.textPrimary,
            fontSize: 16,
            fontWeight: '600',
        },
        logoutButton: {
            paddingVertical: 14,
            borderRadius: theme.borderRadius.button,
            borderWidth: 1,
            borderColor: theme.colors.error,
            alignItems: 'center',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
        },
        logoutButtonText: {
            color: theme.colors.error,
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

            <Card type="standard" style={{ alignItems: 'center', marginBottom: theme.spacing.xl }}>
                <Text style={styles.levelText}>{knowledgePoints}</Text>
                <Text style={styles.xpText}>Knowledge Points</Text>
            </Card>

            <Card type="standard" style={{ marginBottom: theme.spacing.m }}>
                <TouchableOpacity 
                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                    onPress={() => navigation.navigate('Friends')}
                >
                    <Text style={styles.toggleText}>Friends</Text>
                    <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>View All</Text>
                </TouchableOpacity>
            </Card>

            <Card type="standard" style={{ marginBottom: theme.spacing.m }}>
                <TouchableOpacity 
                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                    onPress={() => navigation.navigate('Settings')}
                >
                    <Text style={styles.toggleText}>Settings</Text>
                    <Text style={{ color: theme.colors.textSecondary }}>⚙️</Text>
                </TouchableOpacity>
            </Card>

            <View style={styles.actionSection}>
                <TouchableOpacity
                    style={{
                        paddingVertical: 14,
                        borderRadius: theme.borderRadius.button,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        alignItems: 'center',
                        backgroundColor: theme.colors.surface,
                    }}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={{ color: theme.colors.textPrimary, fontSize: 16 }}>
                        Back to Home
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
