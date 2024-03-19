
import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const Entfernen = ({ route, navigation }) => {
  const { onConfirm, geraeteArray, selectedId } = route.params;
  const itemToRemove = geraeteArray.find((item) => item.id === selectedId);

  const handleEntfernen = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:5000/entfernen/${itemToRemove.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedArray = geraeteArray.filter((item) => item.id !== selectedId);
        console.log('Updated Array before onConfirm:', updatedArray);
        onConfirm((prevArray) => updatedArray);
        console.log('Updated Array after onConfirm:', updatedArray);
        navigation.goBack();
      } else {
        console.error('Entfernen fehlgeschlagen');
        console.log(response);
      }
    } catch (error) {
      console.error('Fehler beim Entfernen von ' + itemToRemove.name + ':', error);
    }
  };

    return (
      <LinearGradient colors={[ 'orange','lightgreen','green']} style={{ flex: 1, alignItems: 'center'}}>
      <View style={styles.container}>
        <Text style={styles.text}>Wollen Sie das Gerät {itemToRemove.name} wirklich entfernen ?</Text>
        <TouchableOpacity style={styles.button} onPress={handleEntfernen}>
          <Text style={styles.buttonText}>Bestätigen</Text>
        </TouchableOpacity>
      </View>
      </LinearGradient>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      width:300,
      height: 100,
      flex: 1,
      backgroundColor:'rgba(255, 255, 255, 0.5)',
       borderRadius:10,
      padding:20
    },
    text: {
      color: 'black',
      fontSize: 16,
      fontWeight: 'bold',
    },
    input: {
      height: 40,
      width: 100,
      borderColor: 'gray',
      borderWidth: 1,
      margin: 10,
      padding: 10,
      flexDirection: 'row'
    },
    button: {
      marginTop: 20,
      backgroundColor: 'green',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 5,
      marginBottom: 20
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  export default Entfernen;