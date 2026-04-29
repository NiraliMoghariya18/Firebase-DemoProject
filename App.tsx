import React, { useState, useEffect, useContext, createContext } from 'react';
import auth from '@react-native-firebase/auth';
import { Button, Text, View } from 'react-native';
import Login from './src/screens/Login';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from './src/navigation/StackNavigation';

interface MyContextType {
  isInitializing: boolean;
  setIsInitializing: React.Dispatch<React.SetStateAction<boolean>>;
}
export const Initializing = createContext<MyContextType | null>(null);

function App() {
  const [isInitializing, setIsInitializing] = useState(false);

  return (
    <Initializing.Provider value={{ isInitializing, setIsInitializing }}>
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </Initializing.Provider>
  );
}
export default App;
export const useBoolean = () => useContext(Initializing);
