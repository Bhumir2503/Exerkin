import { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import storage from "../../../auth/storage";
import userData from "../../../data/userData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContext from "../../../auth/context";
import { useTheme } from "../../../contexts/ThemeContext";

export default function Account() {
   const authContext = useContext(AuthContext);
   const {themeStyles} = useTheme();

   const styles = createStyles(themeStyles);

   const handleLogout = async () => {
      await userData.removeData();
      await AsyncStorage.clear();
      await storage.removeToken();
      authContext.setUser(null);
      
   }


   return (
      <View style={styles.container}>
         <TouchableOpacity style={styles.Logout} onPress={handleLogout}>
            <Text>Logout</Text>
         </TouchableOpacity>
      </View>
   );
}

const createStyles = (themeStyles) => StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: themeStyles.backgroundColor,
   },
   Logout: {
      backgroundColor: "red",
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#7b7b7b",
   }
});
