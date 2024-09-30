// React and React Native imports
import { useState, useContext } from "react"; // Core React imports
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Platform, StatusBar } from "react-native"; // React Native components

// Firebase imports
import { signInWithEmailAndPassword } from "firebase/auth"; // Firebase authentication
import { auth } from "../../../firebaseConfig.js"; // Firebase configuration

// Context and storage imports
import AuthContext from "../../auth/context.js"; // Authentication context
import userContext from "../../data/userContext.js";
import storage from "../../auth/storage.js"; // Storage utility
import userDataSet from "../../functions/userDataSet.js";


export default function Login({ navigation}) {
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [errorColor, setErrorColor] = useState("")
   const [errorText, setErrorText] = useState("")
   const [loading, setLoading] = useState(false)

   const styles = createStyles();
   const authCtx = useContext(AuthContext);
   const userCtx = useContext(userContext);

   const handleSubmit = async () => {
      await setErrorColor("")
      await setErrorText("")
      await setLoading(true)

      if(email === ""){
         setErrorText("Email is required")
         setErrorColor("email")
         setLoading(false)
         return
      }

      if(password === ""){
         setErrorText("Password is required")
         setErrorColor("password")
         setLoading(false)
         return
      }

      await signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
         await storage.storeToken(userCredential.user);
         await userDataSet(userCredential.user.uid, userCtx.setUserData);
         authCtx.setUser(userCredential.user);
      })
      .catch((error) => {
         setErrorText(error.message);
         setErrorColor("both");
         setLoading(false);

      });
   }

   return(
      <View style={styles.container}>
         <ScrollView scrollEnabled={false} style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.topView}>
               <Image style={styles.image} source={require("../../../assets/authentication/login.png")}/>
               <Text style={styles.title}>Welcome Back!</Text>
               <Text style={styles.titleSubText}>Log in to your account and continue organizing your life.</Text>
            </View>
            <View style={styles.bottomView}>
               <Text style={styles.aboveInputText}>Email</Text>
               <TextInput
                  style={{...styles.inputText, borderColor: errorColor === "email" || errorColor === "both" ? 'red' : 'black',}}
                  onChangeText={(text) => setEmail(text)}
                  placeholder="JohnDoe@email.com"
                  value={email}
               />
               <Text style={styles.aboveInputText}>Password</Text>
               <TextInput
                  style={{...styles.inputText, borderColor: errorColor === "password" || errorColor === "both" ? 'red' : 'black',}}
                  onChangeText={(text) => setPassword(text)}
                  value={password}
                  placeholder="********"
                  secureTextEntry={true}
               />
               <Text style={{color: "red", marginTop: 5, textAlign: "center"}}>{errorText}</Text>
               <TouchableOpacity onPress={handleSubmit} style={styles.button} activeOpacity={0.7} disabled={loading}>
                  <Text style={styles.buttonText}>Login</Text>
               </TouchableOpacity>
               <Text>Dont' have an account? <Text onPress={()=>navigation.navigate("Register")}>Sign Up!</Text></Text>
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