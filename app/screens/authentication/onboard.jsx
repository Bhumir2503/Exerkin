import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, Image, Platform, StatusBar } from "react-native";
 

export default function Onboard({ navigation }) {
  const colorScheme = useColorScheme();
  
  const styles = createStyles(colorScheme);

  return (
    <View style={styles.container}>
      <View style={styles.topView}>
         <Image source={require("../../../assets/authentication/onboarding.png")} style={styles.image} />
      </View>
      <View style={styles.bottomView}>
         <Text style={styles.title}>Welcome to ExerKin!</Text>
         <Text style={styles.description}>Take control of your day. Plan, Track and Achieve your goals.</Text>
         <TouchableOpacity style={{...styles.button, backgroundColor: "#b5cff8"}} onPress={()=> navigation.navigate("Register")} activeOpacity={0.7}>
            <Text style={styles.text}>Start Sharing!</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate("Login")}>
            <Text style={styles.text}>Login</Text>
         </TouchableOpacity>
         <View style={styles.termsAgreement}>
            <Text style={styles.terms}>By signing in you agree to ExerKin's</Text>
            <Text style={styles.terms}>
               <Text onPress={()=>console.log("Terms of Service")} style={styles.boldDarkText}>Terms of Service</Text> Guidance and our <Text onPress={()=>console.log("Privacy Policy")} style={styles.boldDarkText}>Privacy Policy</Text>
            </Text>
         </View>
      </View>
    </View>
  );
}

const createStyles = (colorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      backgroundColor: "#e5eefd",
   },
   topView: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
   },
   image:{
      width: "90%",
      height: "90%"
   },
   bottomView: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      width: "100%",
   },
   title: {
      color: "#1b1b1b",
      fontSize: 24,
      fontWeight: "bold",

   },
   description: {
      color: "#7b7b7b",
      fontSize: 14,
      textAlign: "center",
      marginTop: 10,
      marginBottom: 25,
      width: "70%",
   },
   button:{
      width: "80%",
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 5,
      marginVertical: 5,
      borderRadius: 10,
   },
   text: {
      color: "#1b1b1b",
      fontSize: 18,
   },
   termsAgreement: {
      width: "80%",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
   },
   terms: {
      color: "#7b7b7b",
      fontSize: 12,
   },
   boldDarkText: {
      fontWeight: "bold",
      color: "#1b1b1b"
   },
});