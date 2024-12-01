import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, doc, onSnapshot } from 'firebase/firestore';

const FavouritesScreen = () => {
  const [favouriteEvents, setFavouriteEvents] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const favoritesRef = collection(db, 'users', user.uid, 'favorites');
    const unsubscribe = onSnapshot(favoritesRef, (snapshot) => {
      const favEventIds = snapshot.docs.map((doc) => doc.id);

      const eventsRef = collection(db, 'events');
      const unsubscribeEvents = onSnapshot(eventsRef, (eventSnapshot) => {
        const events = eventSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter events to show only favourite ones
        const favEvents = events.filter((event) => favEventIds.includes(event.id));
        setFavouriteEvents(favEvents);
      });

      return () => unsubscribeEvents();
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <View style={styles.container}>
      <FlatList
        data={favouriteEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Text style={styles.eventText}>{item.name}</Text>
            <Text style={styles.eventText}>{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  eventCard: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  eventText: { fontSize: 16, marginBottom: 5 },
});

export default FavouritesScreen;
