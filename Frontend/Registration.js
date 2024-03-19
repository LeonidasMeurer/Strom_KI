import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Switch, Linking } from 'react-native';
import { useDispatch } from 'react-redux'
import { registerUser } from './ReduxSlices/authSlice';
import { LinearGradient } from 'expo-linear-gradient'



const Registration = () => {
  // Zustände für die Benutzereingaben
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [places, setPlaces] = useState('');
  const [placeLat, setPlaceLat] = useState();
  const [placeLong, setPlaceLong] = useState();
  const [pwk, setPwk] = useState();
  const [placeName, setPlaceName] = useState('');


  // Zustand für Checkbox
  const [isChecked, setChecked] = useState(false);


  // hier für das Abrufen von Thunks
  const dispatch = useDispatch();

  // Funktion zum Verarbeiten der Registrierung
  const handleRegister = () => {
    if (isChecked) {
      const userData = {
        email,
        password,
        pwk,
        placeLat,
        placeLong,
        placeName
      };
      dispatch(registerUser(userData))
    } else {
      console.log('checkbox nicht angeklickt');
    }
  };


  // Aus der mapbox API
  let token = "pk.eyJ1IjoibW9udGFnZWwiLCJhIjoiY2xyNW9zdGw4MDd3djJpcnJ0ODNpc2pnZCJ9.IwdHHGHS22v0OVQFPvm-Zw"
  let suggestions

  async function fetchData(search_text) {
    setPlaceName(search_text);
    let response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${search_text}.json?access_token=${token}`)
    let data = await response.json();
    setIsExpanded(true);
    console.log(data)
    suggestions = data.features
    setPlaces(suggestions);

  }

  const handleItemPress = (item) => {
    setPlaceLat(item.geometry.coordinates[0]);
    setPlaceLong(item.geometry.coordinates[1]);
    setPlaceName(item.place_name);
    setPlaces([])
    setIsExpanded(false);

  };

  useEffect(() => {
    console.log(placeLat, placeLong);
  }, [placeLat, placeLong]);

  const [isExpanded, setIsExpanded] = useState(false);



  return (
    <LinearGradient colors={['white', 'lightgreen']} style={styles.containerGradient}>
      <View style={styles.container}>

        <Text style={styles.title}>Registrieren</Text>

        {/* E-Mail-Eingabe */}
        <TextInput
          style={styles.input}
          placeholder="E-Mail"
          onChangeText={(text) => setEmail(text)}
          value={email}
          keyboardType="email-address"
        />

        {/* Passwort-Eingabe */}
        <TextInput
          style={styles.input}
          placeholder="Passwort"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
        />
        {/* Wohnort-Eingabe */}
        <TextInput
          style={styles.input}
          placeholder="Wohnort"
          onChangeText={(text) => fetchData(text)}
          value={placeName}
        />

        {/* Dynamische Liste */}
        {isExpanded && (
          <View style={styles.flatListContainer}>

            <FlatList
              data={places}
              keyExtractor={(item) => places.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleItemPress(item)}>
                  <Text style={styles.listItem}>{item.place_name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

        )}

        {/* PWk-Eingabe */}
        <TextInput
          style={styles.input}
          placeholder="pWk"
          onChangeText={(text) => setPwk(text)}
          value={pwk}
          keyboardType="numeric"
        />

        {/* Checkbox */}
        <View style={styles.checkboxContainer}>
          <Switch
            value={isChecked}
            onValueChange={(newValue) => setChecked(newValue)}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.checkboxLabel}>
              Ich stimme den{' '}
            </Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://slivinskayahm.github.io')}>
              <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>Nutzungsbedingungen</Text>
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>
              {' '}zu
            </Text>
          </View>
        </View>


        {/* Registrierungsbutton */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrieren</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  containerGradient: {
    flex: 1,

  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'white'
  },
  button: {
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
  listItem: {
    fontSize: 16,
    padding: 8,
    borderBottomWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 8,
  }, flatListContainer: {
    marginBottom: 3,
  }
});

export default Registration;


