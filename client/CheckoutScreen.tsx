import { useStripe } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import { Alert, Text, Button, SafeAreaView, View ,StyleSheet, TouchableOpacity} from "react-native";
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('cart1.db');
import { USER_ID } from "@env";
import { useCartContext } from './contexts/CartContext';

export default function CheckoutScreen() {
  
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [paymentIntentId, setPaymentIntentId] = useState<string>("");

    const apiUrl =Constants.expoConfig.extra.apiUrl;
    const { cartItems } = useCartContext();
    const userId =USER_ID;
    const fetchPaymentSheetParams = async () => {
        let tableau = [];
        await new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql('SELECT * FROM cart', [], (_, { rows }) => {
                    const localCart = rows._array;
                   // console.log(localCart);
                    tableau = localCart.map(i => {
                        return {
                            id: i.id,
                            amount: i.quantite
                        }
                    });
                    resolve(); 
                });
            });
        });
      
        



        const response = await fetch(`${apiUrl}/payments/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "pending_items": tableau,
                "customer_id": userId
            })
        });

        const { paymentIntent, ephemeralKey, customer } = await response.json();

        return {
            paymentIntent,
            ephemeralKey,
            customer,
        };
    };



    const initializePaymentSheet = async () => {
        const {
            paymentIntent,
            ephemeralKey,
            customer,
        } = await fetchPaymentSheetParams();

        const { error } = await initPaymentSheet({
            merchantDisplayName: "Example, Inc.",
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            allowsDelayedPaymentMethods: false,
        });

        if (!error) {
            setPaymentIntentId(paymentIntent);
            setLoading(true);
        }
    };

    const openPaymentSheet = async () => {
         //initializePaymentSheet();
        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            const paymentIntent = `pi_${paymentIntentId.split("_")[1]}`;
            const response = await fetch(`${apiUrl}/payments/check/${paymentIntent}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "customer_id": userId
                })
            });

            if (response.status == 200) Alert.alert('Success', 'Your order is confirmed!');
        }
       
    };

    useEffect(() => {    
        initializePaymentSheet();         
    }, [cartItems]);

    return (
        <SafeAreaView style={styles.container}>
        <TouchableOpacity
            style={styles.payButton}
            disabled={!loading}
            onPress={openPaymentSheet}
        >
            <Text style={styles.buttonText}>Payer</Text>
        </TouchableOpacity>
    </SafeAreaView>

    );
}
const styles = StyleSheet.create({
    container: {
        flex: 0.15,
        justifyContent: 'center',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 10,
    },
    payButton: {
        backgroundColor: '#4CAF50', 
        padding: 15,
        borderRadius: 10, 
    },
    buttonText: {
        color: 'white', // Couleur du texte
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});