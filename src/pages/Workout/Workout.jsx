import React, { useState, useCallback, useMemo, useRef } from "react";
import { View, Button, StyleSheet, Text, Modal, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import WorkoutButton from "../../components/WorkoutPage/WorkoutButtons";
import WorkoutForm from "../../components/WorkoutPage/WorkoutForm";
import ExerciseSelector from "../../components/WorkoutPage/ExerciseSelector";

export default function Profile() {
    const { themeStyle } = useTheme();
    const styles = createStyles(themeStyle);

    const [modalIsVisible, setModalVisible] = useState(false);
    const [selectedExercises, setSelectedExercises] = useState([]);
    
    const addExercise = (exercise) => {
        if (exercise) {
            setSelectedExercises([...selectedExercises, {name: exercise}]);
        }
    };

    // render all of the added exercieses
    let exercises = []
    for (let i = 0; i != selectedExercises.length; i += 1) {
        exercises.push(<WorkoutForm key={i} theme={themeStyle} title={selectedExercises[i].name} />)
    }

    return (
        <SafeAreaView style={styles.primaryContent}>

            {/* Press this button to display the workout modal*/}
            <Button title="Workout" onPress={() => setModalVisible(!modalIsVisible)} />


            {/* This is the primary workout modal */}
            <Modal style={styles.workoutModal} animationType="slide" visible={modalIsVisible} transparent>
                <TouchableOpacity style={styles.modalTop} onPress={() => {setModalVisible(false); setSelectedExercises([])} }/>
                <View style={styles.modalContent}>
                <View style={styles.titleStyle}>
                        <Text style={styles.workoutTitle}>Workout title</Text>
                </View>
                <ScrollView contentContainerStyle={styles.scrollView} style={{width: "100%", height: "100%"}}>
                    {exercises}

                    <ExerciseSelector onSelect={addExercise} />

                    {/* Buttons that are at the bottom of the exercises */}
                    <WorkoutButton type="cancelWorkout" title="Cancel Workout" onPress={() => {setModalVisible(false); setSelectedExercises([])}} />
                    <View style={{width: "100%", height: 200}}></View>
                    </ScrollView>
                    </View>

            </Modal>

        </SafeAreaView>
    )
}



const createStyles = (theme) => {
    return StyleSheet.create({
        primaryContent: {
            backgroundColor: theme.backgroundColor,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        
        workoutModal: {
            display: "flex",
            flexDirection: "column",
            height: "80%",
            width: "100%",
        },

        modalTop: {
            height: "15%",
            opacity: 0,
        },

        modalContent: {
            height: "100%",
            backgroundColor: theme.card,
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "2%",
            paddingTop: "20%"
        },
        scrollView: {
            width: "100%",
            alignItems: "center"
        },

        titleStyle: {
            position: "absolute",
            width: "100%",
            marginBottom: "4%",
            marginLeft: "3%",
            padding: "2%",
            backgroundColor: theme.card,
        },
        workoutTitle: {
            color: theme.textColor,
            fontSize: 32,
        },
    });
}

/*
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
        exerciseToUpdate.sets = [...exerciseToUpdate.sets, (selectedExercises[index].sets.length + 1).toString()];
  
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
                            <TextInput keyboardType="default "placeholder="Untitled" style={styles.workoutTitle}/>
                            <Text style={styles.textStyle}>Time</Text>
                            <Text style={styles.textStyle}>Notes</Text>
                        </View>

                        <View style={styles.exerciseHistory}>
                            <FlatList
                               data={selectedExercises}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => {
                                    (
                                        <View>

                                        </View>
                                    )
                                    let values = []
                                    for (let i = 0; i != item.sets.length; i += 1) {
                                        values.push(
                                            <View key={i-0.1} style={styles.workoutInputForm}>
                                                <Text key={i} style={styles.textStyle}>{item.sets[i]}</Text>
                                                <TextInput key={i + 0.1} keyboardType="numeric" placeholder="lbs" style={styles.workoutInputField}/>
                                                <TextInput key={i + 0.2} keyboardType="numeric" placeholder="reps" style={styles.workoutInputField}/>
                                            </View>
                                        )
                                    }
                                    
                                    return (
                                    <View style={styles.workoutContent}>
                                        <View style={styles.exerciseItem}>
                                            <Text style={styles.textStyle}>{item.name}</Text>
                                            <Button title="Add Set" onPress={() => {AddSet(item.index)}}/>
                                        
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
        lower: { flex: 1, backgroundColor: themeStyle.card, },
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
            borderWidth: 1,
            textAlign: "center",
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
*/