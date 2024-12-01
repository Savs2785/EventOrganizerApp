import React, { useState } from 'react';
import { TextInput, Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, signInWithEmailAndPassword } from '../firebaseConfig'; // Import the function

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigation.replace('Home');
      })
      .catch((error) => {
        setError('Incorrect email or password');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button
        title="Sign In"
        onPress={handleSignIn}
        disabled={!email || !password} // Disable if either field is empty
        color="#4CAF50"
      />
      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start', // Start from top
      paddingHorizontal: 30,
      paddingTop: 60, // Add padding to the top for a better look
      backgroundColor: '#f5f5f5',
    },
    header: {
      fontSize: 32,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 40,
      color: '#2C3E50',
    },
    input: {
      height: 50,
      borderColor: '#ccc',
      borderWidth: 1,
      marginBottom: 20,
      paddingHorizontal: 20,
      borderRadius: 10,
      backgroundColor: '#fff',
      fontSize: 16,
      shadowColor: '#000', // Add shadow for depth
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 2, // For Android shadow
    },
    errorText: {
      color: '#e74c3c',
      fontSize: 14,
      marginBottom: 20,
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#4CAF50',
      height: 50,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 2,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    signupButton: {
      marginTop: 20,
      alignItems: 'center',
    },
    signupText: {
      color: '#3498db', // Blue color for the signup link
      fontSize: 16,
      fontWeight: '500',
    },
  });
  

export default SignInScreen;
