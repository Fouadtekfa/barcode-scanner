import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, FlatList, Text, View, RefreshControl } from 'react-native';
import format from 'date-fns/format';
import Constants from "expo-constants";
import { USER_ID } from "@env";
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation ,useFocusEffect } from '@react-navigation/native';



const History = () => {
    const [payments, setPayments] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const { theme } = useTheme();
    const navigation = useNavigation();
    const API_URL = Constants.expoConfig.extra.apiUrl;
    React.useEffect(() => {
            navigation.setOptions({
                 headerStyle: {
                     backgroundColor: theme === 'light' ? '#fff' : '#34363B',
                 },
                 headerTintColor: theme === 'light' ? '#000' : '#fff',
             });
         }, [theme, navigation]); 
    const getPayments = async () => {
        try {
            const response = await fetch(`${API_URL}/payments/${USER_ID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "accept": "application/json",
                },
            });

            if (response.ok) {
                const json = await response.json();
                setPayments(json);
            } else {
                console.error("Failed to fetch data");
            }
        } catch (error) {
            console.error("error fetching payments:", error);
        }
    };

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        try {
            await getPayments();
        } catch (error) {
            console.error("error refreshing payments:", error);
        } finally {
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            getPayments();
        }, [])
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme === 'light' ? '#BCD8DC' : '#333' }]}>
            <FlatList
                data={payments.filter(item => item.is_checked)}
                renderItem={({ item }) => (
                    <View style={[styles.paymentItem, { backgroundColor: theme === 'light' ? '#0AC6E0' : '#4A6572' }]}>
                        <Text style={styles.paymentLabel}>Payment ID:</Text>
                        <Text style={styles.paymentValue}>{item.id}</Text>

                        <Text style={styles.paymentLabel}>Customer ID:</Text>
                        <Text style={styles.paymentValue}>{item.customer.id}</Text>
                        <Text style={styles.paymentLabel}>Total payé :</Text>
                        <Text style={styles.paymentValue} >
                            {item.purchased_items.map(i => i.item.price * i.amount / 100)
                                .reduce((ac, cur) => ac + cur, 0)} €
                        </Text>
                        <Text style={styles.paymentLabel}>
                            {`Payer le ${format(new Date(item.checkout_date), 'dd/MM/yy')} à ${format(new Date(item.checkout_date), 'HH:mm')}`}
                        </Text>
                        <Text style={styles.paymentLabel}>Articles : </Text>
                        {item.purchased_items.map((i, index) => (
                            <Text key={index} style={styles.paymentValue}>
                                • {i.amount} {i.item.name}
                            </Text>
                        ))}
                    </View>
                )}
                keyExtractor={item => item.id.toString()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    paymentItem: {
        margin: 10,
        padding: 10, 
        borderRadius: 15,
    },
    paymentLabel: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    paymentValue: {
        color: 'white',
        fontSize: 14,
    },
});

export default History;
