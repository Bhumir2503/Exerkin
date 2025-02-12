import React, { useState } from "react";
import { View, Button, StyleSheet, Text, Modal, Pressable, FlatList, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import ExerciseSelector from "../../components/WorkoutPage/ExerciseSelector";
import ExerciseSet from "../../components/WorkoutPage/ExerciseSet"

export default function Profile() {
    const { themeStyle } = useTheme();
    const styles = createStyles(themeStyle);

    const [workoutVisible, setWorkoutVisible] = useState(false);
    const [exerciseDropdownVisible, setExerciseDropdownVisible] = useState(false);
    const [selectedExercises, setSelectedExercises] = useState([]);
    
    const addExercise = (exercise) => {
        if (exercise) {
            setSelectedExercises([...selectedExercises, { name: exercise, index: selectedExercises.length, sets: [] }]);
            setExerciseDropdownVisible(false);
        }
    };

    const AddSet = (index) => {
        // Create a new array
        const newExercises = [...selectedExercises];
  
        // Create a new copy of the exercise object at the given index
        const exerciseToUpdate = { ...newExercises[index] };
  
        // Create a new sets array with the new set added
        exerciseToUpdate.sets = [...exerciseToUpdate.sets, "Set" + (selectedExercises[index].sets.length + 1).toString()];
  
        // Replace the old object with the new one in the array
        newExercises[index] = exerciseToUpdate;
  
        // Update state with the new array
        setSelectedExercises(newExercises);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.title}>Get Ready to Workout!</Text>
                <Button title="Start Workout" onPress={() => setWorkoutVisible(true)} />
                <Modal visible={workoutVisible} onRequestClose={() => setWorkoutVisible(false)} animationType="slide" transparent>
                    <Pressable style={styles.upper} onPress={() => {setWorkoutVisible(false); setSelectedExercises([])}} />
                    <View style={styles.lower}>
                        <View style={styles.topOptions}>
                            <Text style={styles.textStyle}>Timer Here</Text>
                            <Button title="Finish" />
                        </View>

                        <View style={styles.workoutInfo}>
                            <Text style={styles.workoutTitle}>Workout Title</Text>
                            <Text style={styles.textStyle}>Time</Text>
                            <Text style={styles.textStyle}>Notes</Text>
                        </View>

                        <View style={styles.exerciseHistory}>
                            {/* Show selected exercises */}
                            <FlatList
                               data={selectedExercises}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => {

                                    let values = []
                                    for (let i = 0; i != item.sets.length; i += 1) {
                                        values.push(
                                            <View key={i-0.1} style={styles.workoutInputForm}>
                                                <Text key={i} style={styles.textStyle}>{item.sets[i]}</Text>
                                                <TextInput key={i + 0.1} style={styles.workoutInputField}/>
                                                <TextInput key={i + 0.2} style={styles.workoutInputField}/>
                                            </View>
                                        )
                                    }

                                    return (
                                    <View style={styles.workoutContent}>
                                        <View style={styles.exerciseItem}>
                                            <Text style={styles.textStyle}>{item.name}</Text>
                                            <Button title="Add Set" onPress={() => {AddSet(item.index)}}/>
                                        
                                            {/* Show the list of past sets */}
                                        </View>
                                        <View>
                                            {values}
                                        </View>
                                    </View>
                                )}}
                            />
                        </View>

                        {exerciseDropdownVisible && <ExerciseSelector onSelect={addExercise} />}

                        <View style={styles.exerciseOptions}>
                            <Pressable style={styles.addExerciseButton} onPress={() => setExerciseDropdownVisible(true)}>
                                <Text style={styles.textStyle}>Add Exercise</Text>
                            </Pressable>
                            <Pressable style={styles.cancelWorkoutButton} onPress={() => {setWorkoutVisible(false); setSelectedExercises([])}}>
                                <Text style={styles.textStyle}>Cancel Workout</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
}

const createStyles = (themeStyle) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: themeStyle.backgroundColor,
        },
        title: {
            fontSize: 48,
            fontWeight: "bold",
            color: themeStyle.textColor,
        },
        upper: { height: "5%", backgroundColor: "white", opacity: 0 },
        lower: { flex: 1, backgroundColor: "#222222" },
        textStyle: {
            color: themeStyle.textColor,
        },
        topOptions: {
            flexDirection: "row",
            justifyContent: "space-between",
            padding: "3%",
        },
        workoutInfo: {
            height: "15%",
        },
        workoutTitle: {
            fontSize: 42,
            marginLeft: "5%",
            color: themeStyle.textColor,
        },
        exerciseHistory: {
            
        },
        workoutContent: {
            display: "flex",
            flexDirection: "column",

        },
        workoutInputForm: {
            display: "flex",
            flexDirection: "row",
            marginBottom: "1%",
            padding: "2%",
            alignItems: "center",
        },
        workoutInputField: {
            backgroundColor: "white",
            marginLeft: "5%",
            width: 70,
            height: 30,
            borderRadius: 15,
            paddingLeft: 5,
            borderColor: "black",
            borderWidth: 1
        },

        exerciseItem: {
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
            borderBottomWidth: 1,
            borderColor: "gray",
        },
        exerciseOptions: {
            height: "15%",
            padding: "5%",
        },
        addExerciseButton: {
            backgroundColor: "#174dc2",
            marginBottom: "3%",
            display: "flex",
            alignItems: "center",
            padding: "2%",
            borderRadius: 10,
        },
        cancelWorkoutButton: {
            backgroundColor: "#c93636",
            opacity: 0.9,
            display: "flex",
            alignItems: "center",
            padding: "2%",
            borderRadius: 10,
        },


    });

