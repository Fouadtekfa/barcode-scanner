import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, FlatList, Text } from 'react-native';
import format from 'date-fns/format';


const History = () => {
  const [payments, setPayments] = useState([]);

  const getPayments = async () => {
    try {
      const response = await fetch("http://192.168.1.62:8080/payments/cus_OxAy8ekZ5nf5Lr", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json",
        },
      });
       
      if (response.ok) {
        const json = await response.json();
        setPayments(json);
        //console.log(json);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error(error);
    }

  };

  //purchased_items

  useEffect(() => {
    getPayments();
  }, []);

return (
    
  <SafeAreaView style={styles.container}>
    <FlatList
      data={payments.filter(item => item.is_checked)}
      renderItem={({ item }) => {
       // console.log(item.purchased_items);
       const checkoutDate = new Date(item.checkout_date);
        return (
          <View style={styles.paymentItem}>
            <Text style={styles.paymentLabel}>Payment ID:</Text>
            <Text style={styles.paymentValue}>{item.id}</Text>
        
            <Text style={styles.paymentLabel}>Customer ID:</Text>
            <Text style={styles.paymentValue}>{item.customer.id}</Text>
            <Text style={styles.paymentLabel}>Total payé :</Text>
            <Text style={styles.paymentValue} >{
                              item.purchased_items.map( i => i.item.price*i.amount/100)
                              .reduce( ( ac, cur ) => { return ac + cur; }, 0)
                              } €
                      </Text>
                      <Text style={styles.paymentLabel}>
                         {`Payer le ${format(checkoutDate, 'dd/MM/yy')} à ${format(checkoutDate, 'HH:mm')}`}
                      </Text>
                      <Text style={styles.paymentLabel}>Articles : </Text>
                           {item.purchased_items.map( i => {
                          return <Text style={styles.paymentValue}> • {i.amount} {i.item.name} </Text>
                              
                            
                            })}


          </View>
        );
      }}
    />
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
container: {
  
  flex: 2,
  padding: 20,
  backgroundColor: '#BCD8DC',
},
paymentItem: {
  margin: 10,
  padding: 10, 
  backgroundColor: '#0AC6E0',
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
