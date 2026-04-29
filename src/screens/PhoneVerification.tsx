// import React, { useState } from 'react';
// import { Button, TextInput, View } from 'react-native';
// import auth from '@react-native-firebase/auth';

// export function PhoneVerification() {
//   // If null, no OTP has been sent; if object, OTP was sent successfully
//   const [confirm, setConfirm] = useState<any>(null);
//   const [code, setCode] = useState('');
//   const [number, setNumber] = useState('');

//   // Step 1: Send OTP to the user's phone
//   async function signInWithPhoneNumber(phoneNumber: any) {
//     try {
//       const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
//       setConfirm(confirmation);
//     } catch (error) {
//       console.log('Error sending code: ', error);
//     }
//   }

//   // Step 2: Confirm the OTP entered by the user
//   async function confirmCode() {
//     try {
//       await confirm.confirm(code);
//       console.log('Authentication successful!');
//     } catch (error) {
//       console.log('Invalid code.');
//     }
//   }

//   if (!confirm) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <TextInput
//           placeholder="enter your number"
//           value={number}
//           onChangeText={setNumber}
//         />
//         <Button
//           title="Phone Number Sign In"
//           onPress={() => signInWithPhoneNumber(number)}
//         />
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <TextInput
//         value={code}
//         onChangeText={text => setCode(text)}
//         placeholder="Enter OTP"
//       />
//       <Button title="Confirm Code" onPress={() => confirmCode()} />
//     </View>
//   );
// }
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function PhoneVerification() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState<any>(null); // Used to store the confirmation result

  // Handle Send OTP
  async function signIn() {
    try {
      // Must use E.164 format: +[country code][number]
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
      Alert.alert('Success', 'OTP sent to your phone.');
    } catch (error: any) {
      if (error.code === 'auth/captcha-check-failed') {
        Alert.alert(
          'Error',
          'reCAPTCHA verification failed. Check your native config.',
        );
      } else if (error.code === 'auth/too-many-requests') {
        Alert.alert('Error', 'Too many attempts. Try again later.');
      } else {
        Alert.alert('Error', error.message);
      }
    }
  }

  // Handle Verify OTP
  async function confirmCode() {
    try {
      await confirm.confirm(code);
      Alert.alert('Success', 'User signed in!');
    } catch (error) {
      Alert.alert('Error', 'Invalid verification code.');
    }
  }

  return (
    <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
      {!confirm ? (
        <>
          <TextInput
            placeholder="Phone Number (+1 123...)"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            style={{ borderBottomWidth: 1, marginBottom: 20 }}
          />
          <Button title="Send OTP" onPress={signIn} />
        </>
      ) : (
        <>
          <TextInput
            placeholder="Enter 6-digit OTP"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            style={{ borderBottomWidth: 1, marginBottom: 20 }}
          />
          <Button title="Verify OTP" onPress={confirmCode} />
          <Button
            title="Change Number"
            onPress={() => setConfirm(null)}
            color="gray"
          />
        </>
      )}
    </View>
  );
}
