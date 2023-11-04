import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';
import Cart from './Cart';

const db = SQLite.openDatabase('cart1.db');
const API_URL = "http://192.168.1.62:8080";

export default function Scan() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const navigation = useNavigation();
   

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
    
            // Créer la table "cart" si elle n'existe pas
            db.transaction(tx => {
                tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS cart 
                     (id INTEGER PRIMARY KEY, quantite INTEGER);`
                );
            });
        })();
    }, []);
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setScanned(false);
        });
    
        return () => {
            unsubscribe();
        };
    }, [navigation]);
    
    

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
    
        try {
            const response = await fetch(`${API_URL}/items/${data}`);
            if (!response.ok) {
                alert("Produit non trouvé sur le serveur.");
                return;
            }
            
            const product = await response.json();
    
            if (!product || !product.id) {
                alert("Produit non trouvé sur le serveur.");
                return;
            }
    
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM cart WHERE id = ?',
                    [data],
                    (_, { rows }) => {
                        if (rows.length > 0) {
                            // L'article est déjà dans le panier. Incrémenter la quantité.
                           
                            tx.executeSql(
                                'UPDATE cart SET quantite = quantite + 1 WHERE id = ?',
                                [data],
                                (_, resultSet) => {
                                    if (resultSet.rowsAffected > 0) {
                                        alert(`Quantité mise à jour: ${product.name}`);

                                    } else {
                                        alert('Erreur lors de la mise à jour de la quantité.');
                                    }
                                },
                                (_, error) => console.error(error)
                            );
                        } else {
                            // ajoutez l'article au panier avec une quantité de 1.
                            tx.executeSql(
                                'INSERT INTO cart (id, quantite) VALUES (?, 1)',
                                [product.id],
                                (_, resultSet) => {
                                    if (resultSet.insertId) {
                                        alert(`Produit ajouté: ${product.name}`);
                                    } else {
                                        alert('erreur lors de l\'ajout du produit.');
                                    }
                                },
                                (_, error) => console.error(error)
                            );
                        }
                    },
                    (_, error) => console.error(error)
                );
            });
        } catch (error) {
            console.error("erreur lors de la recherche du produit : " + error);
        }
    };

    if (hasPermission === null) {
        return <Text>Demande de permission d'accès à la caméra</Text>;
    }
    if (hasPermission === false) {
        return <Text>Pas d'accès à la caméra</Text>;
    }

    return (
        <View style={styles.container}>
            
         
         {scanned ? 
            <Button title={'Scanner à nouveau'} onPress={() => setScanned(false)} /> :
            <BarCodeScanner
                onBarCodeScanned={handleBarCodeScanned}
                   style={StyleSheet.absoluteFillObject}
            />
        }
         
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%', 
        marginHorizontal: '10%', 
        
    },
});
