import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Kontakt = ({ navigation }) => {
  // Zustände für Formularfelder
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(100); // Anfangshöhe
  const MAX_HEIGHT = 200; // Maximalhöhe

  const handleContentSizeChange = (event) => {
    setInputHeight(Math.min(MAX_HEIGHT, event.nativeEvent.contentSize.height));
  };

  const handleContact = async () => {
    try {
      const response = await fetch('http://10.0.2.2:5000/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });

      if (response.ok) {
        // Kontaktanfrage erfolgreich gesendet
        const responseData = await response.json();
        Alert.alert('Kontakt', responseData.message);
        navigation.goBack();
      } else {
        // Hier handeln wir Responses, die kein JSON sind, z.B. bei einem Serverfehler
        Alert.alert('Fehler', 'Es ist ein Problem aufgetreten beim Senden Ihrer Nachricht.');
        console.log('Fehler beim Senden der Kontaktanfrage: Antwort war nicht OK.');
      }
    } catch (error) {
      // Hier fangen wir Netzwerkfehler oder Parsing-Fehler ab
      Alert.alert('Fehler', 'Es ist ein Netzwerkfehler aufgetreten.');
      console.error('Fehler beim Senden der Kontaktanfrage:', error);
    }
  };

  return (
    <LinearGradient colors={['white', 'lightgreen']} style={styles.container}>
      <View style={styles.innerContainer}>
        <TextInput
          placeholder="Name eingeben"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="E-Mail eingeben"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Nachricht eingeben"
          value={message}
          onChangeText={setMessage}
          multiline={true}
          onContentSizeChange={handleContentSizeChange} // Dies wird den Inhalt beobachten und die Größe ändern
          style={[styles.messageInput, { height: Math.max(100, inputHeight) }]}
          scrollEnabled={inputHeight >= MAX_HEIGHT} // Aktivieren des Scrollens nur, wenn die maximale Höhe erreicht ist
        />
        <Button title="Absenden" onPress={handleContact} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  messageInput: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: 'white',
    textAlignVertical: 'top', // Um den Text oben zu beginnen
  },
});

export default Kontakt;