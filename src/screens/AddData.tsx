//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { rh, rw } from '../utils/responsive';
import database from '@react-native-firebase/database';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

// create a component
const AddData = () => {
  const [name, setName] = useState('');
  const [surName, setSurName] = useState('');
  const [age, setAge] = useState('');
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = route.params as { isEdit: boolean; item: any } | undefined;
  const editItem = params?.item;
  console.log('editItem :>> ', editItem);
  const isEdit = params?.isEdit && editItem?.key;

  //   const createItem = async (
  //     name: string,
  //     age: string,
  //     { surName, age: secondaryAge }: { surName: string; age: string },
  //   ) => {
  //     try {
  //       const newReference = database().ref('users').push();

  //       if (params?.isEdit) {
  //         console.log('isEdit====== :>> ', isEdit);
  //         console.log('editItem.id====== :>> ', editItem.id);
  //         await database().ref(`/users/${editItem.id}`).update({
  //           name,
  //           age,
  //           data: {
  //             surName,
  //             secondaryAge,
  //           },
  //         });
  //       } else {
  //         await newReference.set({
  //           name,
  //           age,
  //           data: {
  //             surName,
  //             secondaryAge,
  //           },
  //         });
  //       }
  //       navigation.goBack();
  //       console.log('User created with key:', newReference);
  //     } catch (error) {
  //       console.error('Error creating user:', error);
  //     }
  //   };

  const createItem = async (name: string, age: string) => {
    try {
      if (params?.isEdit) {
        await firestore().collection('Users').doc(editItem.key).update({
          name,
          age,
          //   createdAt: firestore.FieldValue.serverTimestamp(),
        });
      } else {
        await firestore().collection('Users').add({
          name,
          age,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      }
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (isEdit) {
      setAge(editItem?.age);
      setName(editItem?.name);
      //   setSurName(editItem?.data?.surName);
    }
    // return setAge(''), setName(''), setSurName('');
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter your name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      {/* <TextInput
        placeholder="Enter your surname"
        style={styles.input}
        value={surName}
        onChangeText={setSurName}
      /> */}
      <TextInput
        placeholder="Enter your age"
        style={styles.input}
        value={age}
        onChangeText={setAge}
      />
      <Button
        title="Submit"
        onPress={() => {
          createItem(name, age);
        }}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: rw(10),
    paddingVertical: rh(15),
    paddingHorizontal: rh(15),
    marginHorizontal: rw(33),
    marginVertical: rh(10),
  },
});

export default AddData;
