// React and React Native imports
import { useState, useContext } from "react"; // Core React imports
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Platform, StatusBar } from "react-native"; // React Native components

// Context and storage imports
import AuthContext from "../../auth/context.js"; // Authentication context
import userContext from "../../data/userContext.js";
import storage from "../../auth/storage.js"; // Storage utility
import userDataSet from "../../functions/userDataSet.js";

// Firebase imports
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"; // Firebase authentication
import { auth, firestore } from "../../../firebaseConfig.js"; // Firebase configuration
import { query, where, collection, addDoc, getDocs } from "firebase/firestore"; // Firestore database operations

export default function Register({ navigation }) {
   const [username, setUsername] = useState("")
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [errorColor, setErrorColor] = useState("")
   const [errorText, setErrorText] = useState("")
   const [loading, setLoading] = useState(false)

   const styles = createStyles();

   const authCtx = useContext(AuthContext);
   const userCtx = useContext(userContext);

   //check to see if username already exists
   const checkUsernameExists = async (username) => {
      try {
         const usersRef = collection(firestore, 'Users');
         const q = query(usersRef, where('username', '==', username));
         const querySnapshot = await getDocs(q);
         return !querySnapshot.empty;
      } catch (error) {
         return false;
      }
   };

   const handleSubmit = async () => {
      try {
         setLoading(true);
         setErrorColor("");
         setErrorText("");
         
         // Make first letter of username uppercase
         const formattedUsername = username.charAt(0).toUpperCase() + username.slice(1);
         setUsername(formattedUsername);
         
         // Check to see if username is between 6-20 characters
         if (formattedUsername.length < 6) {
            setErrorText("Username must be between 6-20 characters");
            setErrorColor("username");
            setLoading(false);
            return;
         }
         
         // Check to see if username contains invalid characters
         const validUsernameRegex = /^[a-zA-Z0-9_]+$/;
         if (!validUsernameRegex.test(formattedUsername)) {
            setErrorText("Username can only contain letters, numbers, and underscores");
            setErrorColor("username");
            setLoading(false);
            return;
         }
         
         // Check to see if username already exists
         const usernameExists = await checkUsernameExists(formattedUsername);
         if (usernameExists) {
            setErrorText("Username already exists");
            setErrorColor("username");
            setLoading(false);
            return;
         }
         
         // Check to see if email is valid
         if (!email.includes("@") || !email.includes(".")) {
            setErrorText("Email is not valid");
            setErrorColor("email");
            setLoading(false);
            return;
         }
         
         // Check to see if password is between 8-20 characters
         if (password.length < 8) {
            setErrorText("Password must be at least 8 characters");
            setErrorColor("password");
            setLoading(false);
            return;
         }
         
         // Check to see if password contains invalid characters
         const invalidPasswordRegex = /['"]/;
         if (invalidPasswordRegex.test(password)) {
            setErrorText("Password cannot contain quotes");
            setErrorColor("password");
            setLoading(false);
            return;
         }
         
         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
   
         // Check if the user is authenticated
         if (auth.currentUser) {
            await updateProfile(auth.currentUser, {
               displayName: formattedUsername,
            });
   
            const userData = {
               uid: userCredential.user.uid,
               username: formattedUsername,
               email: email,
               theme: "blue",
            };
   
            // Add user to Firestore
            await addDoc(collection(firestore, "Users"), userData);
            await storage.storeToken(userCredential.user);
            await userDataSet(userCredential.user.uid, userCtx.setUserData);
            authCtx.setUser(userCredential.user);
         } else {
            throw new Error("User is not authenticated");
         }
      } catch (error) {
         setErrorText(error.message);
   
         if (error.message.includes("email") || error.message.includes("Email")) {
            setErrorColor("email");
         } else if (error.message.includes("password") || error.message.includes("Password")) {
            setErrorColor("password");
         } else if (error.message.includes("username") || error.message.includes("Username")) {
            setErrorColor("username");
         }
   
         setLoading(false);
      } finally {
         setLoading(false);
      }
   };

   return(
      <View style={styles.container}>
         <ScrollView scrollEnabled={false} style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.topView}>
               <Image style={styles.image} source={require("../../../assets/authentication/register.png")}/>
               <Text style={styles.title}>Start Organizing!</Text>
               <Text style={styles.titleSubText}>Create your account and start organizing your life today.</Text>
            </View>
            <View style={styles.bottomView}>
               <Text style={styles.aboveInputText}>Username</Text>
               <TextInput
                  style={{...styles.inputText, borderColor: errorColor === "username" ? 'red' : 'black',}}
                  onChangeText={(text) => setUsername(text)}
                  value={username}
                  placeholder="JohnDoe"
                  maxLength={20}
               />
               <Text style={styles.aboveInputText}>Email</Text>
               <TextInput
                  style={{...styles.inputText, borderColor: errorColor === "email" ? 'red' : 'black',}}
                  onChangeText={(text) => setEmail(text)}
                  placeholder="JohnDoe@email.com"
                  value={email}
               />
               <Text style={styles.aboveInputText}>Password</Text>
               <TextInput
                  style={{...styles.inputText, borderColor: errorColor === "password" ? 'red' : 'black',}}
                  onChangeText={(text) => setPassword(text)}
                  value={password}
                  placeholder="********"
                  secureTextEntry={true}
               />
               <Text style={{color: "red", marginTop: 5, textAlign: "center"}}>{errorText}</Text>
               <TouchableOpacity onPress={handleSubmit} style={styles.button} activeOpacity={0.7} disabled={loading}>
                  <Text style={styles.buttonText}>Sign Up</Text>
               </TouchableOpacity>
               <Text>Already have an account? <Text onPress={()=>navigation.navigate("Login")}>Login</Text></Text>
            </View>
         </ScrollView>
      </View>
   )
}

const createStyles = () => StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#e5eefd",
      width: "100%",
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
   },
   scrollView: {
      width: "100%",
      flex: 1,
   },
   scrollViewContent: {
      flexGrow: 1,
      justifyContent: "center",
   },
   topView:{
      flex: 1,
      width: "100%",
   },
   image:{
      alignSelf: "center",
      width: "80%",
      height: 250
   },
   title:{
      fontSize: 24,
      marginTop: 20,
      marginLeft: "10%",
   },
   titleSubText:{
      fontSize: 14,
      marginTop: 10,
      marginLeft: "10%",
      width: "80%",
      color: "#7b7b7b",
   },
   bottomView:{
      flex: 2,
      width: "100%",
      alignItems: "center",
   },
   aboveInputText:{
      marginLeft: "10%",
      marginBottom: 5,
      marginTop: 10,
      alignSelf: "flex-start",
      fontSize: 15,
      paddingLeft: 10,
   },
   inputText:{
      height: 50,
      width: "80%",
      paddingLeft: 30,
      paddingRight: 30,
      borderRadius: 12,
      borderWidth: 1,
      fontSize: 15,
   },
   button:{
      width: "80%",
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 5,
      marginVertical: 10,
      borderRadius: 10,
      backgroundColor: "#b5cff8",
      marginTop: 35
   },
   buttonText:{
      color: "#1b1b1b",
      fontSize: 18,
   }
})