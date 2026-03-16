import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Platform } from 'react-native';
import { ThemeContext } from '../components/Theme';

const TOPICS = [
    { id: '1', name: 'Programming' },
    { id: '2', name: 'Data Structures' },
    { id: '3', name: 'Aptitude' },
    { id: '4', name: 'Algorithms' },
];

export default function TopicSelectionScreen({ navigation }) {
    const theme = useContext(ThemeContext);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Quiz', { topic: item.name })}
            activeOpacity={0.8}
        >
            <Text style={styles.cardText}>{item.name}</Text>
        </TouchableOpacity>
    );

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
            padding: theme.spacing.m,
            paddingTop: 64,
        },
        header: {
            ...theme.typography.h1,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.xl,
            paddingHorizontal: theme.spacing.s,
        },
        listContainer: {
            gap: theme.spacing.m,
        },
        row: {
            justifyContent: 'space-between',
            gap: theme.spacing.m,
            paddingHorizontal: theme.spacing.s,
        },
        card: {
            flex: 1,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.card,
            padding: theme.spacing.xl,
            borderWidth: 1,
            borderColor: theme.colors.border,
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        cardText: {
            color: theme.colors.textPrimary,
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
        },
        backButton: {
            marginTop: theme.spacing.xl,
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
            <Text style={styles.header}>Select Topic</Text>
            <FlatList
                data={TOPICS}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContainer}
            />
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Back to Home</Text>
            </TouchableOpacity>
        </View>
    );
}
