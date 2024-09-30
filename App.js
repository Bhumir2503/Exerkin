// React and React Native imports

import { useState, useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform, Text } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';

// Expo specific imports
import * as NavigationBar from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';

// React Navigation imports
import { NavigationContainer } from '@react-navigation/native';

// Internal module imports
import AuthNavigator from './app/navigation/AuthNavigator';
import AppNavigator from './app/navigation/AppNavigator';
import AuthContext from './app/auth/context';
import userContext from './app/data/userContext';
import { ThemeProvider } from './app/contexts/ThemeContext';
import { useTheme } from './app/contexts/ThemeContext';
import storage from './app/auth/storage';
import userDataSet from './app/functions/userDataSet';


// Disable font scaling
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

export default function App() {
  const [user, setUser] = useState();
  const [userData, setUserData] = useState({});
  SplashScreen.preventAutoHideAsync();

  // Restore the user from the storage if it exists
  const restoreUser = async () => {
    const storageUser = await storage.getToken();

    if (storageUser) {
      await userDataSet(storageUser.uid, setUserData);
      setUser(storageUser);
    }
    console.log(new Date());
    SplashScreen.hideAsync();
  }
  useEffect(() => {
    console.log(new Date());
    restoreUser();
  }, []);

  // Hide the navigation bar on Android
  if (Platform.OS === 'android') {
    NavigationBar.setVisibilityAsync("hidden");
  }
  useEffect(() => {
    if (Platform.OS === 'android') {
      const intervalId = setInterval(() => {
        NavigationBar.setVisibilityAsync("hidden");
      }, 5000);

      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }
  }, []);

  const updateCategories = (newCategories) => {
    setUserData((prevData) => ({
      ...prevData,
      categories: newCategories,
    }));
  };

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>

        <ThemeProvider>
          <MenuProvider>
            <AuthContext.Provider value={{ user, setUser }}>
              <userContext.Provider value={{ userData, setUserData, updateCategories }}>
                <AppContent />
              </userContext.Provider>
            </AuthContext.Provider>
          </MenuProvider>
        </ThemeProvider>

      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const { user } = useContext(AuthContext);
  const { userData } = useContext(userContext);
  const { changeTheme, theme } = useTheme();

  useEffect(() => {
    if (userData.theme) {
      changeTheme(userData.theme);
    }
  }, [userData.theme]);

  return (
    <NavigationContainer>
      <StatusBar style={theme.includes("dark") ? 'light' : 'dark'} translucent />
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}