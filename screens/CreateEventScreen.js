import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const CreateEvent = ({ route, navigation }) => {
  const { onEventCreated } = route.params;  // Get the callback function passed from HomeScreen
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  const handleCreateEvent = async () => {
    try {
      const newEventRef = await addDoc(collection(db, 'events'), {
        name,
        date,
        userId: auth.currentUser.uid,  // Link the event to the current user
      });

      // After creating the event, pass it back to HomeScreen
      const newEvent = {
        id: newEventRef.id,
        name,
        date,
        userId: auth.currentUser.uid,
      };

      // Call the passed callback to update HomeScreen state
      onEventCreated(newEvent);

      // Navigate back to the Home screen
      navigation.goBack();
    } catch (error) {
      console.error('Error creating event: ', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Create New Event</Text>

        <TextInput
          style={styles.input}
          placeholder="Event Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#8e8e8e"
        />
        <TextInput
          style={styles.input}
          placeholder="Event Date"
          value={date}
          onChangeText={setDate}
          placeholderTextColor="#8e8e8e"
        />

        <TouchableOpacity style={styles.button} onPress={handleCreateEvent}>
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  scrollContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    height: 55,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingLeft: 15,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  button: {
    height: 50,
    width: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateEvent;
