import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, FlatList } from 'react-native';
import database from '@react-native-firebase/database';
import firebase from '@react-native-firebase/app';

const RealTimeDatabase = () => {
  const [userName, setUserName] = useState('');
  const [surName, setSurName] = useState('');
  const [age, setAge] = useState<any>();
  const [userData, setUserData] = useState<any>(null);

  const createItem = async (
    name: any,
    age: any,
    { surName, age: secondaryAge }: { surName: any; age: any },
  ) => {
    try {
      const newReference = database().ref('users').push();

      await newReference.set({
        name,
        age,
        data: {
          surName,
          secondaryAge,
        },
      });

      console.log('User created with key:', newReference);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const readOnce = async (userId: any) => {
    const snapshot = await database().ref(`/users/${userId}`).once('value');
    console.log('User data: ', snapshot.val());
  };

  const setupListener = (userId: any) => {
    return database()
      .ref(`/users/${userId}`)
      .on('value', snapshot => {
        console.log('Realtime update: ', snapshot.val());
      });
  };

  // 3. UPDATE (Modifying specific fields without overwriting the whole node)
  const updateUser = async (userId: any, newAge: any) => {
    await database().ref(`/users/${userId}`).update({ age: newAge });
    console.log('User updated');
  };

  // 4. DELETE (Removing a node)
  const deleteUser = async (userId: any) => {
    await database().ref(`/users/${userId}`).remove();
    // Alternatively: await database().ref(`/users/${userId}`).set(null);
    console.log('User deleted');
  };

  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    // 1. Create a reference to the specific database path
    const onValueChange = database()
      .ref('/users') // Change this to your path
      .on('value', snapshot => {
        const val = snapshot.val();
        if (val) {
          // 2. Convert object of objects to an array for FlatList
          const formattedData: any = Object.keys(val).map(key => ({
            id: key,
            ...val[key],
          }));
          setDataList(formattedData);
        } else {
          setDataList([]);
        }
      });

    // 3. Clean up the listener when the component unmounts
    return () => database().ref('/users').off('value', onValueChange);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Current Name: {userData?.name || 'Loading...'}</Text>
      <TextInput
        placeholder="Enter new name"
        value={userName}
        onChangeText={setUserName}
        style={{ borderBottomWidth: 1, marginVertical: 10 }}
      />
      <TextInput
        placeholder="Enter new surname"
        value={surName}
        onChangeText={setSurName}
        style={{ borderBottomWidth: 1, marginVertical: 10 }}
      />
      <TextInput
        placeholder="Enter new age"
        value={age}
        onChangeText={setAge}
        style={{ borderBottomWidth: 1, marginVertical: 10 }}
      />
      <Button
        title="Save Name"
        onPress={() => createItem(userName, age, { surName, age })}
      />
      {/* <Button title="Save Name" onPress={() => readOnce()} /> */}

      <FlatList
        data={dataList}
        keyExtractor={item => item.id}
        renderItem={({ item }: { item: any }) => {
          console.log('item :>> ', item);
          const data = item.data;
          return (
            <View style={{ padding: 10 }}>
              <Text>Name: {item.name}</Text>
              <Text>age: {item.age}</Text>
              <Text>age: {data.surName}</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default RealTimeDatabase;
