import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { ThemeContext } from './Theme';
import Card from './Card';

export default function OptionButton({
    option,
    isSelected,
    isCorrect,
    isWrong,
    onPress,
    disabled = false,
}) {
    const theme = useContext(ThemeContext);

    const styles = StyleSheet.create({
        optionCard: {
            padding: theme.spacing.m,
            borderRadius: theme.borderRadius.card,
            minHeight: 64,
            justifyContent: 'center',
            marginBottom: theme.spacing.m,
        },
        optionCardSelected: {
            borderColor: theme.colors.primary,
            backgroundColor: theme.isDarkMode ? '#1E1B4B' : '#EEF2FF',
        },
        optionCardCorrect: {
            borderColor: theme.colors.success,
            backgroundColor: theme.isDarkMode ? '#064E3B' : '#D1FAE5',
        },
        optionCardWrong: {
            borderColor: theme.colors.error,
            backgroundColor: theme.isDarkMode ? '#450A0A' : '#FEE2E2',
        },
        optionText: {
            ...theme.typography.option,
            color: theme.colors.textPrimary,
        }
    });

    let optionStyle = [];
    if (isSelected && isCorrect) {
        optionStyle.push(styles.optionCardCorrect);
    } else if (isWrong) {
        optionStyle.push(styles.optionCardWrong);
    } else if (isSelected) {
        optionStyle.push(styles.optionCardSelected);
    }

    return (
        <Card type="standard" style={[styles.optionCard, ...optionStyle]}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={onPress}
                disabled={disabled}
            >
                <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
        </Card>
    );
}
