
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const Hinzufuegen = ({route, navigation}) => {
    const { onConfirm, geraeteArray } = route.params;
    const [newItem, setNewItem] = useState({ name: '', leistung: 0, anzahl: 0, nutzungsdauer: 0 });

    const handleNameChange = (text) => {
      setNewItem((prevItem) => ({ ...prevItem, name: text }));
    };
  
    const handleLeistungChange = (text) => {
      // Assuming leistung should be a number
      const leistungValue = parseFloat(text, 10);
      setNewItem((prevItem) => ({ ...prevItem, leistung: isNaN(leistungValue) ? '0' : leistungValue }));
    };
  
    const handleAnzahlChange = (text) => {
      // Assuming anzahl should be a number
      const anzahlValue = parseInt(text, 10);
      setNewItem((prevItem) => ({ ...prevItem, anzahl: isNaN(anzahlValue) ? '0' : anzahlValue.toString() }));
    };
    const handleNutzungsdauerChange = (text) => {
      // Assuming anzahl should be a number
      const nutzungsdauerValue = parseFloat(text, 10);
      setNewItem((prevItem) => ({ ...prevItem, nutzungsdauer: isNaN(nutzungsdauerValue) ? '0' : nutzungsdauerValue.toString() }));
    };
    const handleConfirm = async () => {
      // Sortiere die Geräte nach ID
      geraeteArray.sort((a, b) => a.id - b.id);
    
      // Bestimme die nächste ID für das neue Gerät
      const newId = geraeteArray.length > 0 ? geraeteArray[geraeteArray.length - 1].id + 1 : 1;
      
      const newItemWithId = { id: newId, ...newItem };

    //REST
    try {
      const response = await fetch('http://10.0.2.2:5000/hinzufuegen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: newItemWithId.id,
          name: newItem.name,
          leistung: newItem.leistung,
          anzahl: newItem.anzahl,
          nutzungsdauer: newItem.nutzungsdauer
        }),
      });

      if (response.ok) {
        onConfirm(newItemWithId);
        navigation.goBack();
      } else {
        console.error('Hinzufügen fehlgeschlagen');
        console.log(response);
      }
    } catch (error) {
      console.error('Fehler beim Hinzufügen von ' + newItem.name +':', error);3
    }
    };
    return (
    <LinearGradient colors={[ 'orange','lightgreen','green']} style={{ flex: 1, alignItems: 'center'}}>
      <View style={styles.container}>
        <Text style={styles.text}>Name des Geräts:</Text>
        <TextInput
        style={styles.input}
        placeholder=""
        value={newItem.name}
        onChangeText={handleNameChange}
        />
        <Text style={styles.text}>Leistung des Geräts in Watt:</Text>
        <TextInput
        style={styles.input}
        placeholder=""
        value={newItem.leistung}
        onChangeText={handleLeistungChange}
        keyboardType="numeric"
        />
        <Text style={styles.text}>Anzahl der Geräte:</Text>
        <TextInput
        style={styles.input}
        placeholder=""
        value={newItem.anzahl}
        onChangeText={handleAnzahlChange}
        keyboardType="numeric"
        />
        <Text style={styles.text}>Durchschnittliche Nutzungsdauer eines Geräts in Minuten:</Text>
        <TextInput
        style={styles.input}
        placeholder=""
        value={newItem.nutzungsdauer}
        onChangeText={handleNutzungsdauerChange}
        keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
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
    input: {
      height: 40,
      width: 250,
      borderColor: 'gray',
      borderWidth: 1,
      margin: 10,
      padding: 10,
      flexDirection: 'row'
    },
  
    text: {
      color: 'black',
      fontSize: 16,
      fontWeight: 'bold',
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

  export default Hinzufuegen;