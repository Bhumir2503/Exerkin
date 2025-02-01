import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import auth from "@react-native-firebase/auth";

export default function Profile() {
    return (
        <SafeAreaView style={styles.container}>
        <View>
            <Text style={styles.title}>Your Profile</Text>
            <Text onPress={()=> auth().signOut()}>Sign Out</Text>
        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
    },

    title: {
        fontSize: 48,
        fontWeight: "bold",
    },
});