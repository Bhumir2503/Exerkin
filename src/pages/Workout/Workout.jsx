import React, { useState } from "react";
import { View, Button, StyleSheet, Text, Modal, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import WorkoutButton from "../../components/WorkoutPage/WorkoutButtons";
import WorkoutForm from "../../components/WorkoutPage/WorkoutForm";
import ExerciseSelector from "../../components/WorkoutPage/ExerciseSelector";
import { useNavigation } from "@react-navigation/native";
import storage from "../../utils/storage";
import WorkoutTimer from "../../components/WorkoutPage/WorkoutTimer";

export default function Profile() {
    const { themeStyle } = useTheme();
    const styles = createStyles(themeStyle);
    const navigation = useNavigation();

    const [modalIsVisible, setModalVisible] = useState(false);
    const [selectedExercises, setSelectedExercises] = useState([]);

    const addExercise = (exercise) => {
        if (exercise) {
            setSelectedExercises(prevExercises => [
                ...prevExercises, 
                { name: exercise, sets: [] }
            ]);
        }
    };

    const updateExercise = (exerciseName, newSets) => {
        setSelectedExercises(prevExercises => {
            const updatedExercises = prevExercises.map(exercise => {
                if (exercise.name === exerciseName) {
                    return { ...exercise, sets: newSets };
                }
                return exercise;
            });
            return updatedExercises;
        });
    };

    const saveWorkout = async () => {
        // Wait for all exercises to finalize their last sets
        const updatedExercises = await Promise.all(
            selectedExercises.map(async (exercise) => {
                if (exercise.finalizeLastSet) {
                    const lastSet = await exercise.finalizeLastSet(); // Wait for the last set
                    if (lastSet) {
                        return {
                            ...exercise,
                            sets: [...exercise.sets, lastSet], // Add the last set
                        };
                    }
                }
                return exercise;
            })
        );
    
        setTimeout(() => {
            try {
                const storedWorkouts = storage.getString("workouts");
                const workouts = storedWorkouts ? JSON.parse(storedWorkouts) : [];
    
                const newWorkout = {
                    id: Date.now(),
                    timestamp: new Date().toISOString(),
                    exercises: updatedExercises.map(exercise => ({
                        name: exercise.name,
                        sets: [...exercise.sets],
                    })),
                };

    
                workouts.push(newWorkout);
                storage.set("workouts", JSON.stringify(workouts));
    
                setModalVisible(false);
                setSelectedExercises([]);
                navigation.navigate("Profile");
    
            } catch (error) {
                console.error("Error saving workout:", error);
            }
        }, 100);
    };

    return (
        <SafeAreaView style={styles.primaryContent}>
            <Button title="Workout" onPress={() => setModalVisible(!modalIsVisible)} />

            <Modal style={styles.workoutModal} animationType="slide" visible={modalIsVisible} transparent>
                <TouchableOpacity style={styles.modalTop} onPress={() => { setModalVisible(false); setSelectedExercises([]); }} />
                <View style={styles.modalContent}>
                    <View style={styles.titleStyle}>
                        <Text style={styles.workoutTitle}>Workout Title</Text>
                    </View>
                    <ScrollView contentContainerStyle={styles.scrollView} style={{ width: "100%", height: "100%" }}>
                        {selectedExercises.map((exercise, index) => (
                            <WorkoutForm 
                                key={index} 
                                theme={themeStyle} 
                                title={exercise.name} 
                                updateExercise={updateExercise}
                                onFinalize={(finalizeLastSet) => {
                                    exercise.finalizeLastSet = finalizeLastSet;
                                }}
                            />
                        ))}

                        <ExerciseSelector onSelect={addExercise} />
                        <WorkoutButton type="saveWorkout" title="Save Workout" onPress={saveWorkout} />
                        <WorkoutButton type="cancelWorkout" title="Cancel Workout" onPress={() => { setModalVisible(false); setSelectedExercises([]); }} />

                        <View style={{ width: "100%", height: 50 }}></View>
                    </ScrollView>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const createStyles = (theme) => {
    return StyleSheet.create({
        primaryContent: {
            backgroundColor: theme.backgroundColor,
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
        },
        workoutModal: {
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
            flexDirection: "column",
            alignItems: "center",
            padding: "2%",
            paddingTop: "20%",
        },

        scrollView: {
            width: "100%",
            alignItems: "center",
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

        timerStyle: {
            position: "absolute",
            top: "1%",
            right: 20,
            padding: "2%",
        },
    });
};