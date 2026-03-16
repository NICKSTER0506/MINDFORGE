import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../components/Theme';
import Card from '../components/Card';

const MOCK_FRIENDS = [
    { id: '1', username: 'CodeMaster', level: 12, xp: 4500 },
    { id: '2', username: 'ReactQueen', level: 15, xp: 6200 },
    { id: '3', username: 'AlgoGuru', level: 8, xp: 2100 },
    { id: '4', username: 'Pythonista', level: 10, xp: 3400 },
];

export default function FriendsScreen({ navigation }) {
    const theme = useContext(ThemeContext);
    const [searchQuery, setSearchQuery] = useState('');

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        header: {
            padding: theme.spacing.xl,
            paddingTop: 80,
        },
        headerText: {
            ...theme.typography.h1,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.m,
        },
        searchBar: {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.button,
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: theme.spacing.m,
            color: theme.colors.textPrimary,
            ...theme.typography.body,
        },
        listContent: {
            padding: theme.spacing.xl,
            paddingTop: 0,
        },
        friendCard: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.spacing.m,
            padding: theme.spacing.m,
        },
        avatar: {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: theme.colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: theme.spacing.m,
        },
        avatarText: {
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: 18,
        },
        friendInfo: {
            flex: 1,
        },
        friendName: {
            ...theme.typography.h3,
            color: theme.colors.textPrimary,
        },
        friendLevel: {
            ...theme.typography.caption,
            color: theme.colors.textSecondary,
        },
        challengeButton: {
            backgroundColor: 'rgba(124, 58, 237, 0.1)',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme.colors.primary,
        },
        challengeButtonText: {
            color: theme.colors.primary,
            fontWeight: '600',
            fontSize: 12,
        },
        backButton: {
            padding: theme.spacing.m,
            margin: theme.spacing.xl,
            borderRadius: theme.borderRadius.button,
            borderWidth: 1,
            borderColor: theme.colors.border,
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
        }
    });

    const renderFriendItem = ({ item }) => (
        <Card type="standard" style={styles.friendCard}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.username.charAt(0)}</Text>
            </View>
            <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{item.username}</Text>
                <Text style={styles.friendLevel}>Level {item.level} • {item.xp} XP</Text>
            </View>
            <TouchableOpacity style={styles.challengeButton}>
                <Text style={styles.challengeButtonText}>Invite</Text>
            </TouchableOpacity>
        </Card>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Friends</Text>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search friends..."
                    placeholderTextColor={theme.colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <FlatList
                data={MOCK_FRIENDS.filter(f => f.username.toLowerCase().includes(searchQuery.toLowerCase()))}
                renderItem={renderFriendItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<Text style={{ color: theme.colors.textSecondary, textAlign: 'center', marginTop: 40 }}>No friends found.</Text>}
            />

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={{ color: theme.colors.textPrimary, fontWeight: '600' }}>Back to Profile</Text>
            </TouchableOpacity>
        </View>
    );
}
