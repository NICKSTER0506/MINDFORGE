import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
import SettingsScreen from '../screens/SettingsScreen';
import FriendsScreen from '../screens/FriendsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#0B1220' }, // New DeepWorkR-style background
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
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="Friends" component={FriendsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
