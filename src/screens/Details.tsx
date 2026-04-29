import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import auth from '@react-native-firebase/auth';

const Details = () => {
  const user = auth().currentUser;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome {user?.email}</Text>

      <Button title="Logout" onPress={() => auth().signOut()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default Details;
