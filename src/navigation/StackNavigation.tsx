import React, { useState, useEffect, useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { View, ActivityIndicator } from 'react-native';

import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Details from '../screens/Details';
import { RootStackParamList } from '../utils/navigationType';
import { Initializing } from '../../App';
import PhoneVerification from '../screens/PhoneVerification';
import PhoneSignIn from '../screens/PhoneSignIn';
import Anonymous from '../screens/Anonymous';
import RealTimeDatabase from '../screens/RealTimeDatabase';
import CreateData from '../screens/CreateData';
import CreateDataDetails from '../screens/CreateDataDetails';

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigation = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  // const useBoolean = () => useContext(Initializing);
  // console.log('useBoolean :>> ', useBoolean);
  const context = useContext(Initializing);

  if (!context) return null;
  const { isInitializing, setIsInitializing } = context;
  console.log('toggleBoolean -------- :>> ', isInitializing);
  // console.log(isInitializing, 'isInitializing');
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async userState => {
      console.log('userState :>> ', userState);
      const newState = userState;
      // console.log('userState 111:>> ', userState);
      // console.log('newState 111:>> ', newState);
      if (user) {
        console.log('User UID:', user.uid);
        console.log('Is Anonymous:', user.isAnonymous);
      }
      // if (userState) {
      //   console.log('userState :>> ', userState);
      //   try {
      //     await userState.reload();
      //     const currentUser = auth().currentUser;
      //     console.log('currentUser :>> ', currentUser);
      //     if (currentUser) {
      //       const creation = new Date(
      //         currentUser.metadata.creationTime ?? 0,
      //       ).getTime();
      //       console.log('creation :>> ', creation);
      //       const lastLogin = new Date(
      //         currentUser.metadata.lastSignInTime ?? 0,
      //       ).getTime();
      //       console.log('lastLogin :>> ', lastLogin);
      //       console.log(
      //         'currentUser.metadata.creationTime :>> ',
      //         currentUser.metadata.creationTime,
      //       );
      //       console.log(
      //         'currentUser.metadata.lastSignInTime :>> ',
      //         currentUser.metadata.lastSignInTime,
      //       );
      //       const isActuallyNew = Math.abs(lastLogin - creation) < 10000;
      //       console.log('isActuallyNew :>> ', isActuallyNew);
      //       if (isActuallyNew) {
      //         console.log('New account! Redirecting to Login...');
      //         await auth().signOut();
      //         setUser(null);
      //       } else {
      //         console.log('Returning user! Entering App...');
      //         setUser(currentUser);
      //       }
      //     }
      //   } catch (error) {
      //     console.log('Reload error or user signed out:', error);
      //   }
      // } else {
      //   setUser(null);
      // }

      // setTimeout(() => {
      //   console.log('newState :>> ', newState);
      //   console.log('userState :>> ', userState);
      //   setUser(userState);
      // }, 10000);
      setUser(userState);

      // if (isInitializing) setIsInitializing(false);
    });

    return subscriber;
  }, []);

  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const AppStack = () => {
    return (
      <>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen name="RealTimeDatabase" component={RealTimeDatabase} /> */}
          <Stack.Screen
            name="CreateDataDetails"
            component={CreateDataDetails}
          />
          <Stack.Screen name="CreateData" component={CreateData} />
          <Stack.Screen name="Details" component={Details} />
        </Stack.Navigator>
      </>
    );
  };

  const AuthStack = () => {
    return (
      <>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen name="Anonymous" component={Anonymous} /> */}
          {/* <Stack.Screen
            name="PhoneVerification"
            component={PhoneVerification}
          />
          <Stack.Screen name="PhoneSignIn" component={PhoneSignIn} /> */}
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </Stack.Navigator>
      </>
    );
  };
  return <>{user ? <AppStack /> : <AuthStack />}</>;
};

export default StackNavigation;
