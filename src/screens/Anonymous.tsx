import auth from '@react-native-firebase/auth';

//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

// create a component
const Anonymous = () => {
  const signInAnonymously = () => {
    auth()
      .signInAnonymously()
      .then(() => {
        console.log('User signed in anonymously');
      })
      .catch(error => {
        if (error.code === 'auth/operation-not-allowed') {
          console.error('Enable anonymous auth in the Firebase Console.');
        }
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text>Anonymous</Text>
      <Button title="anonymously" onPress={signInAnonymously} />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

//make this component available to the app
export default Anonymous;
