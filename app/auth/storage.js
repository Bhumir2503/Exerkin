import * as SecureStore from "expo-secure-store";

const key = "authToken";

const storeToken = async (authToken) => {
   try {
      const tokenString = JSON.stringify(authToken);
      await SecureStore.setItemAsync(key, tokenString);
   }
   catch (error) {
      console.log("Error storing the auth token", error);
   }
}

const getToken = async () => {
   try {
      const tokenString = await SecureStore.getItemAsync(key);
      return JSON.parse(tokenString);
   }
   catch (error) {
      console.log("Error getting the auth token", error);
   }
}

const removeToken = async () => {
   try {
      await SecureStore.deleteItemAsync(key);
   }
   catch (error) {
      console.log("Error removing the auth token", error);
   }
}

export default { storeToken, getToken, removeToken };