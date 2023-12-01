import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, ScrollView,TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as SQLite from 'expo-sqlite';
import Constants from "expo-constants";
import { useTheme } from './ThemeContext'; 
import { useCartContext } from './CartContext'; 
import CheckoutScreen from '../CheckoutScreen';

const db = SQLite.openDatabase('cart1.db');

export default function Cart({ navigation }: any) {
    const { setCartItems } = useCartContext();
    const [isCheckoutEnabled, setIsCheckoutEnabled] = useState(true);


    const [Cart, setCart] = useState<
        { id: string; name: string; price: number; quantite: number }[]
    >([]);
    const API_URL = Constants.expoConfig.extra.apiUrl;
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
  
    useEffect(() => {
        // mise a  jour  
        updateCartContext(Cart);

        // Désactiver le bouton de paiement pendant 1000 ms 
        setIsCheckoutEnabled(false);
        const timeoutId = setTimeout(() => {
            setIsCheckoutEnabled(true);
        }, 1000); 

        return () => clearTimeout(timeoutId);
    }, [Cart]);

    const updateCartContext = (newCartItems) => {
        setCartItems(newCartItems); // Mise a jour du panier
        setCart(newCartItems);
    };
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
                            quantite: localItem ? localItem.quantite : 0
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
                [itemId, quantite],
                () => {
                    // Mettre à jour le contexte après la mise à jour de la base de données
                    const updatedCartItems = Cart.map(item =>
                        item.id === itemId ? { ...item, quantite } : item
                    );
                   updateCartContext(updatedCartItems);
                }
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
        db.transaction(tx => {
            tx.executeSql('DELETE FROM cart WHERE id = ?', [itemId], () => {
                // Mettre à jour après la suppression d'un article
                const updatedCartItems = Cart.filter(item => item.id !== itemId);
                updateCartContext(updatedCartItems);
            });
        });
    };
    const { theme } = useTheme();
    React.useEffect(() => {
        navigation.setOptions({
            headerStyle: {
                backgroundColor: theme === 'light' ? '#fff' : '#34363B',
            },
            headerTintColor: theme === 'light' ? '#000' : '#fff',
        });
    }, [theme, navigation]); 
    return (
         <View style={[styles.container, { backgroundColor: theme === 'light' ? '#fff' : '#333' }]}>
            <ScrollView style={styles.scrollView}>
                {Cart.filter(item => item.quantite > 0).map((item) => (
                    <View style={styles.itemContainer} key={item.id}>
                        <Text style={[styles.itemName, { color: theme === 'light' ? '#000' : '#fff' }]}>{item.name}</Text>
                        <View style={styles.itemQuantityContainer}>
                            <Icon
                                name="remove"
                                size={30}
                                color="#ff0000"
                                onPress={() => {
                                    updateProductQuantity(item.id, "decrement");
                                }}
                            />
                            <Text style={styles.itemQuantity}>{item.quantite}</Text>
                            <Icon
                                name="add"
                                size={30}
                                color="#00ff00"
                                onPress={() => {
                                    updateProductQuantity(item.id, "increment");
                                }}
                            />
                        </View> 
                        <View style={styles.priceContainer}>
                        <Text style={styles.itemPrice}>{item.quantite * item.price/100  }€</Text> 
                        </View>
                        <TouchableOpacity onPress={() => retirerProduit(item.id)}>
                           <Icon name="delete" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            {isCheckoutEnabled && <CheckoutScreen />}
        </View>
        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 2,  
        flexDirection: "column",
        justifyContent: "space-between",
      
        
    },
    scrollView: {
        flex: 1,
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
        flex: 2,
        fontSize: 20,
        fontWeight: "bold",
    },
    itemQuantityContainer: {
        flex : 1,
        flexDirection: "row",
        alignItems: "center",
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
