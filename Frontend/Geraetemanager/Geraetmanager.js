
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { createStackNavigator } from '@react-navigation/stack';
import Hinzufuegen from './Hinzufuegen';
import Entfernen from './Entfernen';

const Stack = createStackNavigator();

const Geraet = ({data, handleEntfernen, handleAdd, setCount}) => (
  <View>
  <Text style={styles.headerText}>{data.name}</Text>
  <View style={{ flexDirection: 'row', marginBottom: 0 }}>
  <TouchableOpacity
    onPress={() => handleEntfernen(data.id)}
    style={styles.buttonMinus}>
    <Text style={styles.text}>-</Text>
  </TouchableOpacity>
  <TextInput
        style={styles.input}
        value={data.anzahl.toString()}
        placeholder=""
        onChangeText={(number) => setCount(data.id, number)}
        keyboardType="numeric"
        maxLength={40}
      />
  <TouchableOpacity
    onPress={() => handleAdd(data.id)}
    style={styles.button}>
    <Text style={styles.text}>+</Text>
  </TouchableOpacity>
</View>
</View>
)

const Geraetemanager = () => {
    const navigation = useNavigation();
    const [geraeteArray, setGeraeteArray] = useState([]);
    
    const setCount = (selectedId, newCount) => {
      setGeraeteArray((prevArray) => {
        // Use map to create a new array with updated values
        const updatedArray = prevArray.map((item) => {
          if (item.id === selectedId) {
            // Check if newCount is defined before calling toString()
            const updatedAnzahl = newCount !== undefined ? newCount.toString() : '0';
            // Update the 'anzahl' property
            return { ...item, anzahl: updatedAnzahl };
          }
          return item;
        });
        return updatedArray;
      });
    };

  const addElement = (newItem) => {
    setGeraeteArray((prevArray) => [...prevArray, newItem]);
  };

  const removeElement = (itemId) => {
    setGeraeteArray((prevArray) => prevArray.filter((item) => item.id !== itemId));
  };

  const [searchTerm, setSearchTerm] = useState('');

  const filteredGeraeteArray = geraeteArray.filter((item) =>
    item.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

    useEffect(() => {
      // Führen Sie die GET-Anfrage durch, wenn die Komponente montiert wird
      fetch(`http://10.0.2.2:5000/geraete`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Fügen Sie hier weitere Header hinzu, wenn benötigt
        },
      })
        .then(response => response.json())
        .then(data => {
          setGeraeteArray(data.geraete || []);
        })
        .catch(error => {
          console.error('Fehler bei der Anfrage:', error);
        });
},[]);

    geraeteArray.sort((a, b) => a.id > b.id);
    const handleEntfernen = (selectedId) => {
      setGeraeteArray((prevArray) => {
        const updatedArray = prevArray.map((item) => {
          if (item.id === selectedId) {
            const num = parseInt(item.anzahl, 10);
            if (num > 1) {
              fetch('http://10.0.2.2:5000/geraete', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  id: selectedId,
                  anzahl: num - 1,
                }),
              })
                .then((response) => response.json())
                .then((data) => {
                  // Update the local state only if the server request is successful
                  setGeraeteArray((prevArray) => {
                    const updatedArray = prevArray.map((item) =>
                      item.id === selectedId ? { ...item, anzahl: (num - 1).toString() } : item
                    );
                    return updatedArray;
                  });
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
            }
            else {
            navigation.navigate('Entfernen', {onConfirm: removeElement, geraeteArray, selectedId });
            }
          }
          return item;
        });
        return updatedArray;
      });
    };

    const handleAdd = (selectedId) => {
      setGeraeteArray((prevArray) => {
        const updatedArray = prevArray.map((item) => {
          if (item.id === selectedId) {
            const num = parseInt(item.anzahl, 10);
            if (num > 0) {
              fetch('http://10.0.2.2:5000/geraete', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  id: selectedId,
                  anzahl: num + 1,
                }),
              })
                .then((response) => response.json())
                .catch((error) => {
                  console.error('Error:', error);
                });
    
              return { ...item, anzahl: (num + 1).toString() };
            }
          }
          return item;
        });
        return updatedArray;
      });
    };

    return(
    <Stack.Navigator initialRouteName="Gerätemanager">
    <Stack.Screen
      name="Verwaltung"
      options={{
        title: 'Verwalten',
        header: ({ navigation }) => (
          <Button
            radius={10}
            color="green"
            title="Gerät hinzufügen"
            onPress={() => navigation.navigate('Hinzufügen', { onConfirm: addElement, geraeteArray })}
          />
        ),
      }}
    >
      {(props) => (
        <LinearGradient
          colors={['orange', 'lightgreen', 'green']}
          style={{ flex: 1, alignItems: 'center' }}
        >
        <View style={styles.container}>
              <TextInput
                style={styles.searchInput}
                placeholder="Suche nach Geräten..."
                value={searchTerm}
                onChangeText={(text) => setSearchTerm(text)}
              />
         <View style={{ flexDirection: 'row', rowGap: 2, flexWrap: 'wrap', gap: 5 }}>
          {filteredGeraeteArray.map((item) => (
            <Geraet key={item.id} data={item} handleEntfernen={handleEntfernen} handleAdd={handleAdd} setCount={setCount} />
          ))}
          </View>
          </View>
        </LinearGradient>
      
      )}
    </Stack.Screen>
    <Stack.Screen name="Hinzufügen" component={Hinzufuegen} />
    <Stack.Screen name="Entfernen" component={Entfernen} />
  </Stack.Navigator>
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
      width: 40,
      borderColor: 'gray',
      borderWidth: 1,
      margin: 10,
      padding: 10,
      flexDirection: 'row'
    },
    button: {  
    width: 30,
    height: 30,
    marginTop:14,
    padding: 10,
    borderRadius: 100,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    },
    buttonMinus: {  
    width: 30,
    height: 30,
    marginTop:14,
    padding: 10,
    borderRadius: 100,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    },
    headerText: {
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold'
    },
    searchInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      padding: 10,
      flexDirection: 'row'
    },
    text: {
      color: 'black',
      fontSize: 16,
      fontWeight: 'bold',
      margin: 14
    },
  });

  export default Geraetemanager;