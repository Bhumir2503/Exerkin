import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";



const AddExerciseButton = (title, action) => (
    <TouchableOpacity style={styles.aebutton} onPress={action}><Text style={styles.aetext}>{title}</Text></TouchableOpacity>
)

const CancelWorkoutButton = (title, action) => (
    <TouchableOpacity style={styles.cwbutton} onPress={action}><Text style={styles.cwtext}>{title}</Text></TouchableOpacity>
)

const SaveWorkoutButton = (title, action) => (
    <TouchableOpacity style={styles.swbutton} onPress={action}><Text style={styles.aetext}>{title}</Text></TouchableOpacity>
)


const WorkoutButton = options => {
    if (options.type == "addExercise") {
        return AddExerciseButton(options.title, options.onPress);
    }
    else if (options.type == "cancelWorkout") {
        return CancelWorkoutButton(options.title, options.onPress);
    }
    else if(options.type == "saveWorkout") {
        return SaveWorkoutButton(options.title, options.onPress);
    }
}


const styles = StyleSheet.create({
    aebutton: {
        backgroundColor: "#195ed4",
        width: "90%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1%",
        borderRadius: 5,
        marginBottom: "3%",
    },
    aetext: {
        fontWeight: "bold",
        fontSize: 18,
        color: "white",
    },

    cwbutton: {
        backgroundColor: "#f22929",

        width: "90%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1%",
        borderRadius: 5,
        marginBottom: "3%",
    },
    cwtext: {
        fontWeight: "bold",
        fontSize: 18,
        color: "white",
    },
    swbutton: {
            backgroundColor: "#006400",
            width: "90%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1%",
            borderRadius: 5,
            marginBottom: "3%",
    },
    swtext: {
        fontWeight: "bold",
        fontSize: 18,
        color: "white",
    }
})

export default WorkoutButton;