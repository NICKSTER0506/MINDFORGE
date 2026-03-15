import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemeContext } from '../components/Theme';
import { API_BASE_URL } from '../config/api';
import Card from '../components/Card';

export default function LeaderboardScreen({ navigation }) {
    const theme = useContext(ThemeContext);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/leaderboard`);
            const data = await res.json();
            setLeaderboard(data);
        } catch (error) {
            console.error('Failed to load leaderboard', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item, index }) => {
        const isTop = index === 0;
        return (
            <Card type={isTop ? 'primary' : 'standard'} style={{ marginBottom: theme.spacing.s }}>
                <View style={[styles.row, isTop && styles.topRow]}>
                    <Text style={[styles.rank, isTop && styles.topText]}>#{index + 1}</Text>
                    <Text style={[styles.username, isTop && styles.topText]}>{item.username}</Text>
                    <Text style={[styles.score, isTop && styles.topText]}>{item.totalXP} XP</Text>
                </View>
            </Card>
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
            padding: theme.spacing.m,
            paddingTop: 64,
            justifyContent: 'space-between',
        },
        header: {
            ...theme.typography.h1,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.xl,
            paddingHorizontal: theme.spacing.s,
        },
        listContainer: {
            flex: 1,
            paddingHorizontal: theme.spacing.s,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        topRow: {
            borderColor: theme.colors.primary,
            backgroundColor: theme.isDarkMode ? '#334155' : '#E0E7FF', // Subtle highlight
        },
        rank: {
            width: 40,
            color: theme.colors.textSecondary,
            ...theme.typography.leaderboardRow,
        },
        username: {
            flex: 1,
            color: theme.colors.textPrimary,
            ...theme.typography.leaderboardRow,
            fontWeight: '500',
        },
        score: {
            color: theme.colors.textSecondary,
            ...theme.typography.leaderboardRow,
        },
        topText: {
            color: theme.colors.primary,
            fontWeight: 'bold',
        },
        backButton: {
            marginTop: theme.spacing.xl,
            marginBottom: theme.spacing.xl,
            padding: theme.spacing.m,
            alignItems: 'center',
        },
        backButtonText: {
            color: theme.colors.textSecondary,
            fontSize: 16,
        }
    });

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Leaderboard</Text>

            {loading ? (
                <ActivityIndicator color={theme.colors.primary} size="large" style={{ marginTop: 50 }} />
            ) : (
                <View style={styles.listContainer}>
                    <FlatList
                        data={leaderboard}
                        keyExtractor={(item) => item._id}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ gap: theme.spacing.s }}
                    />
                </View>
            )}

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
        </View>
    );
}
