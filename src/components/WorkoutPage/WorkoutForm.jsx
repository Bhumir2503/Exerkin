import React, { useState, useCallback, useMemo, useRef } from "react";
import { View, Button, StyleSheet, Text, Modal, Pressable, FlatList, TextInput, Touchable, Dimensions, TouchableOpacity } from "react-native";

// options.data = [column1, column2, column3]
const SetRow = options => {
    const styles = createStyles(options.theme);

    return (
        <View style={styles.rowInfo}>
            <View style={styles.subInfoRowLeft}>
                <Text style={styles.infoText}>{options.data[0]}</Text>
            </View>
    
            <View style={styles.subInfoRowRight}>
                <Text style={styles.infoText}>{options.data[1]}</Text>
                <Text style={styles.infoText}>{options.data[2]}</Text>
            </View>
        </View>
    )
}

const WorkoutForm = options => {
    const styles = createStyles(options.theme);

    const [workoutData, setWorkoutData] = useState([])
    const [inputs, setInputs] = useState(["", ""])

    const addSet = () => {
        if (inputs[0].length != 0 && inputs[1].length != 0) {
            setWorkoutData([...workoutData, [parseInt(inputs[0]), parseInt(inputs[1])]])
            setInputs(["", ""])
        }
    }

    const updateRep = (text) => {
        if (text.length <= 3) {
            setInputs([inputs[0], text])
        }
    }

    const updateWeight = (text) => {
        if (text.length <= 3) {
            setInputs([text, inputs[1]])
        }
    }

    // Generate the list of the previous sets
    let history = []
    for (let i = 0; i != workoutData.length; i += 1) {
        history.push(<SetRow key={i} theme={options.theme} data={[i + 1, workoutData[i][0], workoutData[i][1]]}/>)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.workoutName}>{options.title}</Text>
            <SetRow theme={options.theme} data={["Set", "Weight", "Reps"]}/>
            
            {history}

            <View style={styles.rowInfo}>
                <View style={styles.subInfoRowLeft}>
                    <Text style={styles.infoText}>{workoutData.length + 1}</Text>
                </View>
            
                <View style={styles.subInfoRowRight}>
                    <TextInput keyboardType="numeric" value={inputs[0]} onChangeText={text => updateWeight(text)} style={styles.inputField}></TextInput>
                    <TextInput keyboardType="numeric" value={inputs[1]} onChangeText={text => updateRep(text)} style={styles.inputField}></TextInput>
                </View>
            </View>
            
            <TouchableOpacity style={styles.setButton} onPress={addSet}>
                <Text style={styles.setButtonText}>Add Set</Text>
            </TouchableOpacity>
        </View>
    )
}


const createStyles = (theme) => {
    return StyleSheet.create({
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
            display: "flex",
            flex: 1,
            justifyContent: "flex-start"
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
            fontWeight: 900,
            fontSize: 22,
        },
        setButton: {
            backgroundColor: theme.primary,
            width: "100%",
            padding: "2%",
            borderRadius: 15,
            marginTop: "5%",
            display: "flex",
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
        }
    })
}

export default WorkoutForm;