import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, ScrollView,TouchableOpacity,Swipeable } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase('cart1.db');

export default function Cart({ navigation }: any) {
    const [Cart, setCart] = useState<
        { id: string; name: string; price: number; quantite: number }[]
    >([]);
    const API_URL = "http://192.168.1.62:8080";

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS cart 
                 (id INTEGER PRIMARY KEY, quantite INTEGER);`
            );
        });
        fetchItemsFromServer();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchItemsFromServer();
        });

        
        return () => {
            unsubscribe();
        };
    }, [navigation]);


    const fetchItemsFromServer = async () => {
        try {
            const response = await fetch(`${API_URL}/items`);
            if (!response.ok) {
                console.error("erreur lors de la récupération des données de l'API");
                return;
            }

            const serverItems = await response.json();
            
            db.transaction(tx => {
                tx.executeSql('SELECT * FROM cart', [], (_, { rows }) => {
                    const localCart = rows._array;

                    const mergedItems = serverItems.map(item => {
                        const localItem = localCart.find(local => local.id === item.id);
                        return {
                            ...item,
                            quantite: localItem ? localItem.quantite : 1 
                        };
                    });

                    setCart(mergedItems);
                });
            });

        } catch (error) {
            console.error("erreur lors de la récupération des articles : " + error);
        }
    };

    const updateProductQuantityInLocalDB = (itemId: number, quantite: number) => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT OR REPLACE INTO cart (id, quantite) VALUES (?, ?)',
                [itemId, quantite]
            );
        });
    };

    const updateProductQuantity = (id: number, action: string) => {
        const updatedCart = [...Cart];
        const itemIndex = updatedCart.findIndex(item => item.id === id);

        if (itemIndex !== -1) {
            if (action === 'increment') {
                updatedCart[itemIndex].quantite += 1;
            } else if (action === 'decrement' && updatedCart[itemIndex].quantite >= 1) {
                updatedCart[itemIndex].quantite -= 1;
            }

            updateProductQuantityInLocalDB(updatedCart[itemIndex].id, updatedCart[itemIndex].quantite);
            setCart(updatedCart);
        }
    };

    const retirerProduit = (itemId: number) => {
        const updatedCart = Cart.filter(item => item.id !== itemId);
        db.transaction(tx => {
            tx.executeSql('DELETE FROM cart WHERE id = ?', [itemId]);
        });
        setCart(updatedCart);
    };

  
    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {Cart.filter(item => item.quantite > 0).map((item) => (
                    <View style={styles.itemContainer} key={item.id}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <View style={styles.itemQuantityContainer}>
                            <Icon
                                name="remove"
                                size={35}
                                color="#ff0000"
                                onPress={() => {
                                    updateProductQuantity(item.id, "decrement");
                                }}
                            />
                            <Text style={styles.itemQuantity}>{item.quantite}</Text>
                            <Icon
                                name="add"
                                size={35}
                                color="#00ff00"
                                onPress={() => {
                                    updateProductQuantity(item.id, "increment");
                                }}
                            />
                        </View> 
                        <View style={styles.priceContainer}>
                        <Text style={styles.itemPrice}>{item.quantite * item.price/100}€</Text> 
                        </View>
                        <TouchableOpacity onPress={() => retirerProduit(item.id)}>
                           <Icon name="delete" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 2,  
        flexDirection: "column",
        justifyContent: "space-between",
      
        
    },
   
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    itemName: {
        fontSize: 20,
        fontWeight: "bold",
    },
    itemQuantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

    },
    itemQuantity: {
        fontSize: 16,
        marginHorizontal: 10,
        
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "right",
    },
    priceContainer: {
        flex: 1,
        alignItems: 'flex-end', 
    },
   
   
});
