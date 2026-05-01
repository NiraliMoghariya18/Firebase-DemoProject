import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import auth, {
  GoogleAuthProvider,
  signInWithCredential,
  getAuth,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';
import { images } from '../utils/images';
import { rf, rh, rw } from '../utils/responsive';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../utils/navigationType';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  GoogleSignin.configure({
    webClientId:
      '990584356832-s1199cnr4v1cqcl0mtui5c2be0nto295.apps.googleusercontent.com',
  });

  async function onGoogleButtonPress() {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const signInResult = await GoogleSignin.signIn();
    let idToken = signInResult.data?.idToken;
    if (!idToken) {
      throw new Error('No ID token found');
    }

    const googleCredential = GoogleAuthProvider.credential(
      signInResult.data?.idToken,
    );

    return signInWithCredential(getAuth(), googleCredential);
  }

  const handleSignIn = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => Alert.alert('Invalid credentials'));
    // navigation.navigate('Details');
  };

  // const handleSignIn = async () => {
  //   try {
  //     const userCredential = await auth().signInWithEmailAndPassword(
  //       email,
  //       password,
  //     );
  //     console.log('userCredential :>> ', userCredential);
  //     return userCredential.user;
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }
  // };

  const signUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageView}>
          <Image
            source={images.login}
            resizeMode="contain"
            style={styles.loginImage}
          />
        </View>
        <Text style={styles.loginText}>Log In</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        {/* <Button title="Sign Up" onPress={handleSignUp} /> */}
        {/* <Button title="Sign In" onPress={handleSignIn} /> */}

        <TouchableOpacity style={styles.loginView} onPress={handleSignIn}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.lineView}>
          <View style={styles.line} />
          <Text style={{ marginHorizontal: rw(10) }}>or</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.imagesMainView}>
          <TouchableOpacity style={styles.imagesView}>
            <Image
              source={images.fb}
              resizeMode="contain"
              style={styles.image}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imagesView}
            onPress={() => onGoogleButtonPress()}
          >
            <Image
              source={images.google}
              resizeMode="contain"
              style={styles.image}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.imagesView}>
            <Image
              source={images.instagram}
              resizeMode="contain"
              style={styles.image}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Don’t have an account? </Text>

          <TouchableOpacity onPress={signUp}>
            <Text style={styles.signupBtn}>Signup</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: rh(70),
  },
  imageView: {
    marginHorizontal: rw(46),
    alignItems: 'center',
  },
  loginImage: {
    width: rw(246),
    height: rh(234),
  },
  loginText: {
    fontWeight: 500,
    fontSize: rf(24),
    marginHorizontal: rw(33),
    marginTop: rh(29),
    marginBottom: rh(20),
  },
  input: {
    borderWidth: 1,
    borderRadius: rw(10),
    paddingVertical: rh(15),
    paddingHorizontal: rh(15),
    marginHorizontal: rw(33),
    marginVertical: rh(10),
  },
  imagesView: {
    borderWidth: 1,
    borderColor: '#2763E6',
    paddingVertical: rh(11),
    paddingHorizontal: rw(15),
    borderRadius: rw(10),
  },
  imagesMainView: {
    marginHorizontal: rw(33),
    justifyContent: 'center',
    marginTop: rh(20),
    flexDirection: 'row',
    gap: rw(10),
  },
  line: { flex: 1, height: 1, borderWidth: 1, borderColor: '#c5c3c3' },
  loginView: {
    backgroundColor: '#2763E6',
    borderRadius: rw(10),
    marginHorizontal: rw(33),
    paddingVertical: rh(17),
    marginTop: rh(40),
  },
  lineView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: rw(20),
    marginTop: rh(19),
  },
  loginButtonText: {
    fontSize: rf(16),
    fontWeight: 500,
    color: 'white',
    textAlign: 'center',
  },
  image: { width: rw(20), height: 20 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: rh(30),
  },
  label: {
    fontSize: rf(16),
    color: '#333',
  },
  signupBtn: {
    fontSize: rf(16),
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
export default Login;
