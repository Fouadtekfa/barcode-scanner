import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from './ThemeContext';
import { useNavigation } from '@react-navigation/native'; 

export default function Home() {
    const { theme, setTheme } = useTheme();
    const navigation = useNavigation();

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };

    React.useEffect(() => {
        navigation.setOptions({
            headerStyle: {
                backgroundColor: theme === 'light' ? '#fff' : '#34363B',
            },
            headerTintColor: theme === 'light' ? '#000' : '#fff',
        });
    }, [theme]);

    return (
        <View style={[styles.container, { backgroundColor: theme === 'light' ? '#fff' : '#34363B' }]}>
            <Text style={{ color: theme === 'light' ? '#000' : '#fff' }}></Text>
            <TouchableOpacity 
                style={[styles.button, theme === 'light' ? styles.lightThemeButton : styles.darkThemeButton]} 
                onPress={toggleTheme}
            >
                <Text style={[styles.buttonText, theme === 'light' ? styles.lightThemeText : styles.darkThemeText]}>
                    {theme === 'light' ? 'Mode nuit' : 'Mode jour'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    button: {
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    lightThemeButton: {
        backgroundColor: '#FFFFFF',
    },
    darkThemeButton: {
        backgroundColor: '#000000',
    },
    buttonText: {
        fontSize: 16,
    },
    lightThemeText: {
        color: '#000000',
    },
    darkThemeText: {
        color: '#FFFFFF',
    },
});
