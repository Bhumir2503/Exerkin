import * as SecureStore from "expo-secure-store";

const key = "userData";

const storeData = async (authToken) => {
   try {
      const tokenString = JSON.stringify(authToken);
      await SecureStore.setItemAsync(key, tokenString);
   }
   catch (error) {
      console.log("Error storing the userData token", error);
   }
}

const getData = async () => {
   try {
      const tokenString = await SecureStore.getItemAsync(key);
      return JSON.parse(tokenString);
   }
   catch (error) {
      console.log("Error getting the userData token", error);
   }
}

const removeData = async () => {
   try {
      await SecureStore.deleteItemAsync(key);
   }
   catch (error) {
      console.log("Error removing the userData token", error);
   }
}

export default { storeData, getData, removeData };