import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeContext } from './Theme';
import { Ionicons } from '@expo/vector-icons';

export default function Header({
    title,
    showBack = true,
    onBack,
    showProfile = false,
    onProfile,
    rightAction,
}) {
    const theme = useContext(ThemeContext);

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: theme.spacing.m,
            paddingVertical: theme.spacing.m,
            backgroundColor: theme.colors.background,
        },
        leftSection: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.s,
        },
        backIcon: {
            padding: theme.spacing.s,
        },
        title: {
            ...theme.typography.h2,
            color: theme.colors.textPrimary,
        },
        rightSection: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.s,
        },
        profileIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        profileText: {
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: 16,
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                {showBack && (
                    <TouchableOpacity style={styles.backIcon} onPress={onBack}>
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color={theme.colors.textPrimary}
                        />
                    </TouchableOpacity>
                )}
                <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.rightSection}>
                {rightAction}
                {showProfile && (
                    <TouchableOpacity
                        style={styles.profileIcon}
                        onPress={onProfile}
                    >
                        <Text style={styles.profileText}>👤</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
