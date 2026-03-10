import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from '@react-navigation/native'; // We'll handle custom theme styling locally

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import TopicSelectionScreen from '../screens/TopicSelectionScreen';
import QuizScreen from '../screens/QuizScreen';
import ResultScreen from '../screens/ResultScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ReviewScreen from '../screens/ReviewScreen';
import StatsScreen from '../screens/StatsScreen';
import DailyChallengeScreen from '../screens/DailyChallengeScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#0F0F11' },
                    animation: 'fade', // smooth transitions
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="TopicSelection" component={TopicSelectionScreen} />
                <Stack.Screen name="Quiz" component={QuizScreen} />
                <Stack.Screen name="Result" component={ResultScreen} />
                <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="Review" component={ReviewScreen} />
                <Stack.Screen name="Stats" component={StatsScreen} />
                <Stack.Screen name="DailyChallenge" component={DailyChallengeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
