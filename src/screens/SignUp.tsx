import React, { useContext, useState } from 'react';
import {
  View,
  TextInput,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { images } from '../utils/images';
import { rf, rh, rw } from '../utils/responsive';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../utils/navigationType';
import { Initializing } from '../../App';
// import { auth } from '../utils/firebaseConfig';
const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const context = useContext(Initializing);

  if (!context) return null;
  const { isInitializing, setIsInitializing } = context;
  console.log(isInitializing, 'isInitializing');
  const handleSignUp = async () => {
    setIsInitializing(true);
    console.log(isInitializing, 'isInitializing');

    await auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async res => {
        console.log('login');
        navigation.navigate('Login');
        await auth().signOut();
        setIsInitializing(false);
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('That email address is already in use!');
        }
        console.log(error);
      });
  };

  const signUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.backView}
          onPress={() => navigation.goBack()}
        >
          <Image source={images.back} resizeMode="contain" />
        </TouchableOpacity>
        <View style={styles.imageView}>
          <Image
            source={images.signUp}
            resizeMode="contain"
            style={styles.loginImage}
          />
        </View>
        <Text style={styles.loginText}>Sign Up</Text>
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

        <TouchableOpacity style={styles.loginView} onPress={handleSignUp}>
          <Text style={styles.loginButtonText}>Create Account</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <Text style={styles.lastLineText}>Already have an account? </Text>
          <TouchableOpacity onPress={signUp}>
            <Text style={styles.subText}>Sign In</Text>
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
  backView: {
    marginHorizontal: rw(46),
    alignItems: 'flex-start',
    marginBottom: rh(15),
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
  lastLineText: {
    fontSize: rf(16),
    color: '#333',
  },
  subText: { fontSize: rf(16), color: '#007AFF', fontWeight: 'bold' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: rh(30),
  },
});
export default SignUp;
