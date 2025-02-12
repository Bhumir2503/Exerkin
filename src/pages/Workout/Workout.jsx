import React, { useState } from "react";
import { View, Button, StyleSheet, Text, Modal, Pressable, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import ExerciseSelector from "../../components/WorkoutPage/ExerciseSelector";

export default function Profile() {
    const { themeStyle } = useTheme();
    const styles = createStyles(themeStyle);

    const [workoutVisible, setWorkoutVisible] = useState(false);
    const [exerciseDropdownVisible, setExerciseDropdownVisible] = useState(false);
    const [selectedExercises, setSelectedExercises] = useState([]);

    const addExercise = (exercise) => {
        if (exercise) {
            setSelectedExercises([...selectedExercises, { name: exercise, sets: [] }]);
            setExerciseDropdownVisible(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.title}>Get Ready to Workout!</Text>
                <Button title="Start Workout" onPress={() => setWorkoutVisible(true)} />
                <Modal visible={workoutVisible} onRequestClose={() => setWorkoutVisible(false)} animationType="slide" transparent>
                    <Pressable style={styles.upper} onPress={() => setWorkoutVisible(false)} />
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

                        {/* Show selected exercises */}
                        <FlatList
                            data={selectedExercises}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.exerciseItem}>
                                    <Text style={styles.textStyle}>{item.name}</Text>
                                    <Button title="Add Set" onPress={() => console.log("Add Set to", item.name)} />
                                </View>
                            )}
                        />

                        {exerciseDropdownVisible && <ExerciseSelector onSelect={addExercise} />}

                        <View style={styles.exerciseOptions}>
                            <Pressable style={styles.addExerciseButton} onPress={() => setExerciseDropdownVisible(true)}>
                                <Text style={styles.textStyle}>Add Exercise</Text>
                            </Pressable>
                            <Pressable style={styles.cancelWorkoutButton} onPress={() => setWorkoutVisible(false)}>
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

