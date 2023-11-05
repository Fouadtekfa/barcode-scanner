import { useStripe } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import { Alert, Text, Button, SafeAreaView, View } from "react-native";
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('cart1.db');
export default function CheckoutScreen() {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [paymentIntentId, setPaymentIntentId] = useState<string>("");

    const apiUrl = Constants.expoConfig.extra.apiUrl;

    const userId = "cus_OxAC1UaHHGdw7b";
    /*const items = [
        {
            "id": 1,
            "amount": 2
        }
    ];*/
   
    
    const fetchPaymentSheetParams = async () => {
        let tableau = [];
       // console.log(tableau);
        /*
       await db.transaction(tx => {
                tx.executeSql('SELECT * FROM cart', [], (_, { rows }) => {
                const localCart = rows._array;
             console.log(localCart);
                tableau = localCart.map( i => {
                    return {
                      id: i.id,
                      amount: i.quantite
                  }
                  });
                  console.log("hola");
                  console.log(tableau)
            });

        });*/
        await new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql('SELECT * FROM cart', [], (_, { rows }) => {
                    const localCart = rows._array;
                    console.log(localCart);
                    tableau = localCart.map(i => {
                        return {
                            id: i.id,
                            amount: i.quantite
                        }
                    });
                    //console.log("hola");
                    //console.log(tableau);
                    resolve(); // Indique que la transaction est terminée
                });
            });
        });
           // console.log("qulques chose")
         //   console.log(tableau); 
        



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
        await initializePaymentSheet();
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
    }, []);

    return (
        <SafeAreaView>
            <Text>Payment</Text>
            <Button 
                disabled={!loading}
                title="Checkout"
                onPress={openPaymentSheet }
            />
        </SafeAreaView>
    );
}