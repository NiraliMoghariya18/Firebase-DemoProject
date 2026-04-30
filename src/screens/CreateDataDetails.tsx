//import liraries
import React, { Component, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import database from '@react-native-firebase/database';
import { rh, rw } from '../utils/responsive';
import { images } from '../utils/images';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../utils/navigationType';

const CreateDataDetails = () => {
  const [dataList, setDataList] = useState([]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const onValueChange = database()
      .ref('/users')
      .on('value', snapshot => {
        const val = snapshot.val();
        if (val) {
          const formattedData: any = Object.keys(val).map(key => ({
            id: key,
            ...val[key],
          }));
          setDataList(formattedData);
        } else {
          setDataList([]);
        }
      });

    return () => database().ref('/users').off('value', onValueChange);
  }, []);

  function onHandleNavigation() {
    console.log('data :>> ');
    navigation.navigate('CreateData');
  }

  const handleEdit = (item: any) => {
    navigation.navigate('CreateData', {
      item,
      isEdit: true,
    });
  };

  const deleteUser = (userId: any) => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          database().ref(`/users/${userId}`).remove();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={dataList}
        keyExtractor={item => item.id}
        renderItem={({ item }: { item: any }) => {
          console.log('item :>> ', item);
          const data = item.data;
          return (
            <View style={{ padding: 10, backgroundColor: 'pink' }}>
              <TouchableOpacity onPress={() => deleteUser(item?.id)}>
                <Image
                  source={images.bin}
                  style={styles.deleteImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Image
                  source={images.write}
                  style={styles.deleteImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text>Name: {item.name}</Text>
              <Text>SurName: {data?.surName}</Text>
              <Text>Age: {item.age}</Text>
            </View>
          );
        }}
        contentContainerStyle={{ gap: rh(10) }}
      />
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: rw(50),
          bottom: rh(50),
        }}
        onPress={() => onHandleNavigation()}
      >
        <Image
          style={{
            width: rw(30),
            height: rh(30),
          }}
          source={images.add}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: rh(40),
  },
  deleteImage: {
    width: rw(22),
    height: rh(22),
  },
});

//make this component available to the app
export default CreateDataDetails;
