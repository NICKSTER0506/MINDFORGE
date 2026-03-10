import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { ThemeContext } from '../components/Theme';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

export default function LoginScreen({ navigation }) {
    const { login } = useContext(AuthContext);
    const theme = useContext(ThemeContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAuth = async () => {
        setLoading(true);
        try {
            const url = `${API_BASE_URL}/api/auth/${isRegistering ? 'register' : 'login'}`;
            const body = isRegistering
                ? { username, email, password }
                : { email, password };

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await response.json();

            if (response.ok) {
                await login(data.token, data.user);
                navigation.replace('Home');
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert('Network error. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
            justifyContent: 'center',
            padding: theme.spacing.xl,
        },
        logo: {
            ...theme.typography.h1,
            color: theme.colors.textPrimary,
            textAlign: 'center',
            marginBottom: 64,
            letterSpacing: 2,
        },
        form: {
            gap: theme.spacing.m,
        },
        input: {
            backgroundColor: theme.colors.surface,
            color: theme.colors.textPrimary,
            padding: 16,
            borderRadius: theme.borderRadius.button,
            borderWidth: 1,
            borderColor: theme.colors.border,
            fontSize: 16,
        },
        button: {
            backgroundColor: theme.colors.accent,
            padding: 16,
            borderRadius: theme.borderRadius.button,
            alignItems: 'center',
            marginTop: theme.spacing.s,
        },
        buttonText: {
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: 16,
            letterSpacing: 1,
        },
        linkText: {
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginTop: theme.spacing.l,
            fontSize: theme.typography.label.fontSize,
        }
    });

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>MINDFORGE</Text>

            <View style={styles.form}>
                {isRegistering && (
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor={theme.colors.textSecondary}
                        value={username}
                        onChangeText={setUsername}
                    />
                )}
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleAuth}
                    activeOpacity={0.9}
                >
                    {loading ? (
                        <ActivityIndicator color={'#FFFFFF'} />
                    ) : (
                        <Text style={styles.buttonText}>
                            {isRegistering ? 'REGISTER' : 'LOGIN'}
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
                    <Text style={styles.linkText}>
                        {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
