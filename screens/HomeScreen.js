import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Alert } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, doc, onSnapshot, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [events, setEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentEvent, setCurrentEvent] = useState({ id: '', name: '', date: '' });
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const dateInputRef = useRef(null); // Reference for the date input field

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const eventsRef = collection(db, 'events');
    const unsubscribeEvents = onSnapshot(eventsRef, (snapshot) => {
      const eventList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventList);
    });

    const favoritesRef = collection(db, 'users', user.uid, 'favorites');
    const unsubscribeFavorites = onSnapshot(favoritesRef, (snapshot) => {
      const favoriteIds = snapshot.docs.map((doc) => doc.id);
      setFavorites(favoriteIds);
    });

    return () => {
      unsubscribeEvents();
      unsubscribeFavorites();
    };
  }, [user]);

  const validateDate = (date) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!date.match(dateRegex)) {
      return false;
    }
    const parsedDate = new Date(date);
    return parsedDate instanceof Date && !isNaN(parsedDate);
  };

  const handleAddEvent = async () => {
    if (!user) {
      alert('Please sign in to add an event');
      return;
    }

    if (!currentEvent.name || !currentEvent.date) {
      alert('Please fill in all fields before adding an event');
      return;
    }

    if (!validateDate(currentEvent.date)) {
      alert('Please enter a valid date in the format YYYY-MM-DD');
      return;
    }

    try {
      const eventRef = doc(collection(db, 'events'));
      await setDoc(eventRef, {
        name: currentEvent.name,
        date: currentEvent.date,
        userId: user.uid,
      });
      setCurrentEvent({ id: '', name: '', date: '' });
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleEditEvent = async () => {
    if (!user) {
      alert('Please sign in to edit an event');
      return;
    }

    if (!currentEvent.name || !currentEvent.date) {
      alert('Please fill in all fields before editing an event');
      return;
    }

    if (!validateDate(currentEvent.date)) {
      alert('Please enter a valid date in the format YYYY-MM-DD');
      return;
    }

    try {
      const eventRef = doc(db, 'events', currentEvent.id);
      await updateDoc(eventRef, {
        name: currentEvent.name,
        date: currentEvent.date,
        userId: user.uid,
      });
      setCurrentEvent({ id: '', name: '', date: '' });
    } catch (error) {
      console.error('Error editing event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      await deleteDoc(eventRef);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleToggleFavorite = async (eventId) => {
    try {
      const favoritesRef = doc(db, 'users', user.uid, 'favorites', eventId);
      if (favorites.includes(eventId)) {
        await deleteDoc(favoritesRef);
      } else {
        await setDoc(favoritesRef, { eventId });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigation.navigate('SignIn');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleGoToFavourites = () => {
    navigation.navigate('FavouritesScreen');
  };

  const renderEventItem = ({ item }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventText}>{item.name}</Text>
      <Text style={styles.eventText}>{item.date}</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            favorites.includes(item.id) ? styles.favoriteActive : styles.favoriteInactive,
          ]}
          onPress={() => handleToggleFavorite(item.id)}
        >
          <Text style={styles.favoriteText}>
            {favorites.includes(item.id) ? 'Unfavorite' : 'Favorite'}
          </Text>
        </TouchableOpacity>

        {item.userId === user?.uid && (
          <>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setCurrentEvent(item)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteEvent(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Event Name"
        value={currentEvent.name}
        onChangeText={(text) => setCurrentEvent((prev) => ({ ...prev, name: text }))}
        onSubmitEditing={() => dateInputRef.current.focus()}
      />

      <TextInput
        style={styles.input}
        placeholder="Event Date (YYYY-MM-DD)"
        value={currentEvent.date}
        onChangeText={(text) => setCurrentEvent((prev) => ({ ...prev, date: text }))}
        ref={dateInputRef}
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={currentEvent.id ? handleEditEvent : handleAddEvent}
      >
        <Text style={styles.submitButtonText}>
          {currentEvent.id ? 'Update Event' : 'Add Event'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}

      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No events available</Text>}
      />
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.favoritesButton} onPress={handleGoToFavourites}>
        <Text style={styles.favoritesButtonText}>Go to Favorites</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  eventCard: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  eventText: {
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  favoriteButton: {
    padding: 5,
  },
  favoriteActive: {
    backgroundColor: '#ff6347',
  },
  favoriteInactive: {
    backgroundColor: '#8BC34A',
  },
  favoriteText: {
    color: '#fff',
  },
  editButton: {
    backgroundColor: '#3498db',
    padding: 5,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 5,
  },
  deleteButtonText: {
    color: '#fff',
  },
  editButtonText: {
    color: '#fff',
  },
  signOutButton: {
    backgroundColor: '#ff6347',
    padding: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  favoritesButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fff',
  },
  favoritesButtonText: {
    color: '#fff',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;
