import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Home from './index';

import Scan from './Scan';
import History from './History';
import Cart from './Cart';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName: string = "";

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
                            default:
                                break;
                        }
                        return <Ionicons name={iconName} size={size} color={color} />;
                    }
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
