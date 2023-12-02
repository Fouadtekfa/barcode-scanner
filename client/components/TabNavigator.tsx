import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

import Home from './index';
import Scan from './Scan';
import History from './History';
import Cart from './Cart';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    const { theme } = useTheme();

    return (
        <NavigationContainer  >
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName = "";

                        // choix de l'icône en fonction du système d'exploitation et de la route
                        if (Platform.OS === "android") {
                            iconName += "md-";
                        } else if (Platform.OS === "ios") {
                            iconName += "ios-";
                        }

                        switch (route.name) {
                            case "Home":
                                iconName += "home-sharp";
                                break;
                            case "Scanner":
                                iconName += "qr-code-sharp";
                                break;
                            case "History":
                                iconName += "book-sharp";
                                break;
                            case "Cart":
                                iconName += "cart-sharp";
                                break;
                        }
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                     tabBarLabelStyle: {
                    color: theme === 'light' ? '#000' : '#fff', // Couleur du texte des labels
                },
                    tabBarStyle: {
                        backgroundColor: theme === 'light' ? '#fff' : '#333', // personnalisation de la couleur de fond
                    },
                    tabBarActiveTintColor: theme === 'light' ? '#000' : '#fff', // couleur de l'icône active
                    tabBarInactiveTintColor: theme === 'light' ? '#888' : '#bbb', // couleur de l'icône inactive
                })}
            >
                <Tab.Screen name='Home' component={Home} />
                <Tab.Screen name='History' component={History} />
                <Tab.Screen name='Scanner' component={Scan} />
                <Tab.Screen name='Cart' component={Cart} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
