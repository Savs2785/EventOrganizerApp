import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';

const EditEventScreen = () => {
  const { params } = useRoute();
  const { eventId, eventName, eventDate, onEventUpdated } = params || {}; // Get the callback from params
  const [name, setName] = useState(eventName || '');  // Default to empty if undefined
  const [date, setDate] = useState(eventDate || '');  // Default to empty if undefined
  const navigation = useNavigation();

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        console.error("Event ID is missing in params");
        return; // Prevent fetching if eventId is missing
      }

      try {
        const docRef = doc(db, 'events', eventId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const eventData = docSnap.data();
          setName(eventData.name);
          setDate(eventData.date);
        } else {
          console.log("Event not found");
        }
      } catch (error) {
        console.error("Error fetching event: ", error);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleSave = async () => {
    if (!name || !date) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      const docRef = doc(db, 'events', eventId);
      await updateDoc(docRef, { name, date });

      // Call the callback to update the event in HomeScreen
      onEventUpdated({ id: eventId, name, date });

      navigation.goBack(); // Go back after saving
    } catch (error) {
      console.error("Error updating event: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Event</Text>
      <TextInput
        style={styles.input}
        placeholder="Event Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Event Date"
        value={date}
        onChangeText={setDate}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default EditEventScreen;
