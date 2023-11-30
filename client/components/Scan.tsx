import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TextInput } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';
import Constants from "expo-constants";

const db = SQLite.openDatabase('cart1.db');
const API_URL = Constants.expoConfig.extra.apiUrl;

export default function Scan() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [manualBarcode, setManualBarcode] = useState('');
    const navigation = useNavigation();

    const handleManualBarcodeInput = (text) => {
      setManualBarcode(text);
    };

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
    
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
            let productId = data;
            if (!productId && manualBarcode) {
                productId = manualBarcode;
            } else if (!productId) {
                alert("aucun code-barres n'a été saisi");
                return;
            }

            const response = await fetch(`${API_URL}/items/${productId}`);
            if (!response.ok) {
                alert(" article non trouvé dans le serveur ");
                return;
            }

            const product = await response.json();

            if (!product || !product.id) {
                alert("article non trouvé dans le serveur ");
                return;
            }

            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM cart WHERE id = ?',
                    [productId],
                    (_, { rows }) => {
                        if (rows.length > 0) {
                            tx.executeSql(
                                'UPDATE cart SET quantite = quantite + 1 WHERE id = ?',
                                [productId],
                                (_, resultSet) => {
                                    if (resultSet.rowsAffected > 0) {
                                        alert(`Quantité mise à jour +1 : ${product.name}`);
                                    } else {
                                        alert('Erreur lors de la mise à jour de la quantité.');
                                    }
                                },
                                (_, error) => console.error(error)
                            );
                        } else {
                            tx.executeSql(
                                'INSERT INTO cart (id, quantite) VALUES (?, 1)',
                                [product.id],
                                (_, resultSet) => {
                                    if (resultSet.insertId) {
                                        alert(`article ajouté : ${product.name}`);
                                    } else {
                                        alert('Erreur lors de l\'ajout de l\'article');
                                    }
                                },
                                (_, error) => console.error(error)
                            );
                        }
                    },
                    (_, error) => console.error(error)
                );
            });
            setManualBarcode('');
        } catch (error) {
            console.error("Erreur lors de la recherche de l\'article : " + error);
        }
    };

    if (hasPermission === null) {
        return <Text>Demande de permission d'accès à la caméra</Text>;
    }
    /*if (hasPermission === false) {
        return <Text>Pas d'accès à la caméra</Text>;
    }*/

    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text>Pas d'accès à la caméra</Text>
                <TextInput
                    style={[styles.input, { textAlign: 'center' }]}
                    placeholder="insérez le code-barres de l'article"
                    value={manualBarcode}
                    onChangeText={handleManualBarcodeInput}
                    keyboardType="numeric"
                />
                <Button
                    title="ajoutez l'article au panier"
                    onPress={() => {
                        if (manualBarcode) {
                            handleBarCodeScanned({ type: '', data: manualBarcode });
                        }
                    }}
                />
            </View>
        );
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
    input: {
        width: '90%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
    },
});
