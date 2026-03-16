import React, { useContext } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../components/Theme';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen({ navigation }) {
    const theme = useContext(ThemeContext);
    const { logout } = useContext(AuthContext);

    const toggleSetting = async (key, value, setter) => {
        setter(value);
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
            if (theme.hapticsEnabled) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
        } catch (e) {
            console.error(`Failed to save ${key}`, e);
        }
    };

    const handleLogout = () => {
        logout();
        navigation.replace('Login');
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        scrollContent: {
            padding: theme.spacing.xl,
            paddingTop: 80,
        },
        headerText: {
            ...theme.typography.h1,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.xl,
        },
        section: {
            marginBottom: theme.spacing.xl,
        },
        sectionTitle: {
            ...theme.typography.h3,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.m,
        },
        settingRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: theme.spacing.s,
        },
        settingLabel: {
            ...theme.typography.body,
            color: theme.colors.textPrimary,
        },
        settingDescription: {
            ...theme.typography.caption,
            color: theme.colors.textSecondary,
            marginTop: 2,
        },
        logoutButton: {
            marginTop: theme.spacing.xl,
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
        },
        backButton: {
            paddingVertical: 14,
            borderRadius: theme.borderRadius.button,
            borderWidth: 1,
            borderColor: theme.colors.border,
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            marginTop: theme.spacing.m,
        },
        backButtonText: {
            color: theme.colors.textPrimary,
            fontSize: 16,
            fontWeight: '600',
        }
    });

    const SettingToggle = ({ label, description, value, onValueChange }) => (
        <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
                <Text style={styles.settingLabel}>{label}</Text>
                {description && <Text style={styles.settingDescription}>{description}</Text>}
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={value ? '#FFFFFF' : '#f4f3f4'}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.headerText}>Settings</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Appearance</Text>
                    <Card type="standard">
                        <SettingToggle
                            label="Dark Mode"
                            description="Use the modern dark aesthetic"
                            value={theme.isDarkMode}
                            onValueChange={(val) => toggleSetting('isDarkMode', val, theme.setIsDarkMode)}
                        />
                    </Card>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Experience</Text>
                    <Card type="standard">
                        <SettingToggle
                            label="Haptic Feedback"
                            description="Vibrate on interactions"
                            value={theme.hapticsEnabled}
                            onValueChange={(val) => toggleSetting('hapticsEnabled', val, theme.setHapticsEnabled)}
                        />
                        <View style={{ height: 1, backgroundColor: theme.colors.border, marginVertical: theme.spacing.s }} />
                        <SettingToggle
                            label="Sound Effects"
                            description="Play success and error sounds"
                            value={theme.soundEnabled}
                            onValueChange={(val) => toggleSetting('soundEnabled', val, theme.setSoundEnabled)}
                        />
                    </Card>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>Log Out</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
