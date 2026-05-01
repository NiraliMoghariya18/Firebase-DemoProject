//import liraries
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import database from '@react-native-firebase/database';
import { rh, rw } from '../utils/responsive';
import { images } from '../utils/images';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../utils/navigationType';
import firestore from '@react-native-firebase/firestore';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

interface items {
  name: string;
  age: string;
  createAt: string;
}

const AddDataDetails = () => {
  const [dataList, setDataList] = useState<any[]>([]);
  console.log('dataList :>> ', dataList);
  const [lastVisible, setLastVisible] =
    useState<FirebaseFirestoreTypes.QueryDocumentSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  //   useEffect(() => {
  //     const subscriber = firestore()
  //       .collection('Users')
  //       .onSnapshot(querySnapshot => {
  //         const usersData: any = [];
  //         querySnapshot.forEach(documentSnapshot => {
  //           usersData.push({
  //             ...documentSnapshot.data(),
  //             key: documentSnapshot.id,
  //           });
  //         });
  //         setDataList(usersData);
  //       });

  //     return () => subscriber();
  //   }, []);

  const fetchDocs = async (isInitial = false) => {
    if (isMoreLoading || (!isInitial && !hasMore)) return;

    setIsMoreLoading(true);

    let query = firestore()
      .collection('Users')
      .orderBy('createdAt', 'desc')
      .limit(5);

    if (!isInitial && lastVisible) {
      query = query.startAfter(lastVisible);
    }

    try {
      const snapshot = await query.get();

      if (snapshot.empty) {
        setHasMore(false);
      } else {
        const lastDoc = snapshot.docs[snapshot.docs.length - 1];
        const newItems = snapshot.docs.map(doc => ({
          id: doc.id,
          key: doc.id,
          ...doc.data(),
        }));

        setLastVisible(lastDoc);
        setDataList(prev => (isInitial ? newItems : [...prev, ...newItems]));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsMoreLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLastVisible(null);
      setHasMore(true);
      fetchDocs(true);
    });
    return unsubscribe;
  }, [navigation]);

  function onHandleNavigation() {
    navigation.navigate('AddData');
  }

  function handleEdit(item: any) {
    navigation.navigate('AddData', {
      item,
      isEdit: true,
    });
  }

  const deleteUser = (userId: any) => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          firestore().collection('Users').doc(userId).delete();
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View
        style={{
          padding: 10,
          backgroundColor: 'pink',
          margin: rh(10),
          borderRadius: rw(10),
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: rw(5),
            marginHorizontal: rw(10),
          }}
        >
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <Image
              source={images.write}
              style={styles.deleteImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteUser(item?.key)}>
            <Image
              source={images.bin}
              style={styles.deleteImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <Text>Name: {item.name}</Text>
        <Text>Age: {item.age}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={dataList}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        onEndReached={() => fetchDocs()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
        contentContainerStyle={{ gap: rh(35) }}
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
export default AddDataDetails;
