
import { Card } from '@rneui/themed';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ImageBackground, Image } from 'react-native';
import { Button } from '@rneui/base';
import { convertToRGBA } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector} from 'react-redux';
import { loginSuccess, loginUser } from './ReduxSlices/authSlice';

const imageFrederik = require("./images/Bild1.png")


export default function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const error = useSelector((state) => state.auth.error);
  const success = useSelector((state) => state.auth.isAuthenticated); 

  // hier für das Abrufen von Thunks
  const dispatch = useDispatch(); 

  // Funktion zum Verarbeiten des Logins
  const handleLogin = () => {
    const userData = {
        email,
        password,
      };
    dispatch(loginUser(userData))
  };

  /*useEffect(() => {
    if (success) {
      // Navigiere zur gewünschten Seite nach erfolgreichem Login
      navigation.navigate('Home'); // Ersetze 'DeineZielSeite'
    }
  }, [success]);*/




  
  return (
    <LinearGradient colors={['orange', 'lightgreen', 'green']} style={styles.container}>
      <View style={{ alignItems: 'center' }}>
        <Image source={imageFrederik} style={{ height: '22%', resizeMode: 'contain', marginBottom: '1%', marginTop: '15%' }} />
        <Text style={{ marginBottom: '10%', color: 'white' }}>Frederik</Text>
        <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 10, padding: 20 }}>
          <Text style={{ alignSelf: 'center', fontSize: 20 }}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Benutzername"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
          <TextInput
            style={styles.input}
            placeholder="Passwort"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry
          />
          <View style={{ width: 110, alignSelf: 'center', marginTop: 10 }}>
            <Button radius={10} color="green" title="Anmelden" onPress={handleLogin} />
          </View>
          {error && <Text style={styles.errorText}>{error.error}</Text>}
        </View>
      </View>
    </LinearGradient>
  );
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});