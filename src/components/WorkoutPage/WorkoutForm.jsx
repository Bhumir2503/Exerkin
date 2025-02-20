import React, { useState, useCallback } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";

const SetRow = ({ theme, data }) => {
    const styles = createStyles(theme);
    return (
        <View style={styles.rowInfo}>
            <View style={styles.subInfoRowLeft}>
                <Text style={styles.infoText}>{data[0]}</Text>
            </View>
            <View style={styles.subInfoRowRight}>
                <Text style={styles.infoText}>{data[1]}</Text>
                <Text style={styles.infoText}>{data[2]}</Text>
            </View>
        </View>
    );
};

const WorkoutForm = ({ theme, title, updateExercise, onFinalize }) => {
    const styles = createStyles(theme);
    const [workoutData, setWorkoutData] = useState([]);
    const [weight, setWeight] = useState("");
    const [reps, setReps] = useState("");

    // Function to add a new set
    const addSet = () => {
        if (weight && reps) {
            const newSet = { reps: parseInt(reps), weight: parseInt(weight) };
            setWorkoutData(prevWorkoutData => {
                const updatedWorkoutData = [...prevWorkoutData, newSet];
                updateExercise(title, updatedWorkoutData);
                return updatedWorkoutData; //Always return the updated data
            });

            setWeight("");
            setReps("");
        }
    };

    const finalizeLastSet = useCallback(() => {
        //Made this to manually trigger the finalizeLastSet function, the last set was not being added to the workoutData
        if (weight && reps) {
            const lastSet = { weight: parseInt(weight), reps: parseInt(reps) }; // Create the last set
            return new Promise((resolve) => {
                setWorkoutData(prevData => {
                    const updatedWorkoutData = [...prevData, lastSet];
                    updateExercise(title, updatedWorkoutData); 
                    resolve(lastSet); 
                    return updatedWorkoutData;
                });
            });
        }
        return Promise.resolve(null); 
    }, [weight, reps, title, updateExercise]);

    if(onFinalize) {
        onFinalize(finalizeLastSet);
    }

    const updateRep = (text) => {
        if (text.length <= 3) {
            setReps(text);
        }
    };

    const updateWeight = (text) => {
        if (text.length <= 3) {
            setWeight(text);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.workoutName}>{title}</Text>
            <SetRow theme={theme} data={["Set", "Weight", "Reps"]} />

            {workoutData.map((set, index) => (
                <SetRow key={index} theme={theme} data={[index + 1, set.weight, set.reps]} />
            ))}

            <View style={styles.rowInfo}>
                <View style={styles.subInfoRowLeft}>
                    <Text style={styles.infoText}>{workoutData.length + 1}</Text>
                </View>
                <View style={styles.subInfoRowRight}>
                    <TextInput
                        keyboardType="numeric"
                        value={weight}
                        onChangeText={updateWeight}
                        style={styles.inputField}
                        placeholder="Weight"
                    />
                    <TextInput
                        keyboardType="numeric"
                        value={reps}
                        onChangeText={updateRep}
                        style={styles.inputField}
                        placeholder="Reps"
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.setButton} onPress={addSet}>
                <Text style={styles.setButtonText}>Add Set</Text>
            </TouchableOpacity>
        </View>
    );
};

const createStyles = (theme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.backgroundColor,
            padding: "3%",
            width: "90%",
            marginBottom: "5%",
            borderRadius: 15,
        },
        rowInfo: {
            display: "flex",
            flexDirection: "row",
        },
        subInfoRowLeft: {
            flex: 1,
            justifyContent: "flex-start",
        },
        subInfoRowRight: {
            flex: 1,
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
        },
        infoText: {
            color: theme.textColor,
            fontWeight: "bold",
            fontSize: 16,
        },
        workoutName: {
            color: theme.primary,
            fontWeight: "bold",
            fontSize: 22,
        },
        setButton: {
            backgroundColor: theme.primary,
            width: "100%",
            padding: "2%",
            borderRadius: 15,
            marginTop: "5%",
            alignItems: "center",
        },
        setButtonText: {
            color: "white",
            fontWeight: "700",
            fontSize: 16,
        },
        inputField: {
            width: "20%",
            padding: 2,
            borderBottomColor: theme.textColor,
            borderBottomWidth: 2,
            fontSize: 16,
            fontWeight: "700",
            color: theme.textColor,
        },
    });

export default WorkoutForm;