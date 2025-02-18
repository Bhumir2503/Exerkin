import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useTheme } from "../../contexts/ThemeContext";
/*DISCLAIMER: Unsure whether or not this component will receive or pass props, so we will need to communicate properly on what data will be passed to where */

//this component should be used to develop a dropdown menu for selecting exercises,
//it should be able to take in a list of exercises and display them in a dropdown menu. Or you can create 
//an array of exercises and pass it to the dropdown menu for now.

//Use the Dropdown imported above, you will need to install the package react-native-element-dropdown
const buttonValue = "Add Exercise"
const allExercises = [
  { ph: buttonValue, label: "Chest", value: "chest", type: "category" },
  { ph: buttonValue, label: "Dumbbell Bench Press", value: "db_bench_press", category: "chest" },
  { ph: buttonValue, label: "Barbell Bench Press", value: "bb_bench_press", category: "chest" },

  { ph: buttonValue, label: "Back", value: "back", type: "category" },
  { ph: buttonValue, label: "Dumbbell Row", value: "db_row", category: "back" },
  { ph: buttonValue, label: "Barbell Deadlift", value: "bb_deadlift", category: "back" },

  { ph: buttonValue, label: "Arms", value: "arms", type: "category" },
  { ph: buttonValue, label: "Dumbbell Curl", value: "db_curl", category: "arms" },
  { ph: buttonValue, label: "Barbell Curl", value: "bb_curl", category: "arms" },
];

  /*
  Here is an example on how to use this component. Try importing it into the Workout.jsx page and use it like this:
  <ExerciseSelector onSelect={setSelectedExercise} />
          <Text style={{ marginTop: 20, fontSize: 18 }}>
                Selected Exercise: {selectedExercise || "None"}
          </Text>
*/

const ExerciseSelector = ({ onSelect }) => {
  const { themeStyle } = useTheme();
  const styles = createStyles(themeStyle);
  const [placeholderValue, setPlaceholderValue] = useState(null)

  return (
    <View style={{ width: "100%", marginBottom: "3%" }}>
      <Dropdown
        data={allExercises}
        labelField="ph"
        valueField= "value"
        placeholder={buttonValue}
        placeholderStyle={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 18,
          color: "white",
        }}

        selectedTextStyle={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 18,
          color: "white",
        }}
        onChange={(item) => {
            onSelect(item.label);
        }}
        style={{
          backgroundColor: "#195ed4",
          width: "90%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "1%",
          borderRadius: 5,
          margin: "auto",
          marginBottom: "3%",
        }}
        containerStyle={{
          backgroundColor: "#fff",  //White dropdown menu
        }}
        
        renderItem={(item, selected) => (
          <View style={{ padding: 10, backgroundColor: "#fff" }}>  
            <Text style={{ fontWeight: item.type ? "bold" : "normal",
              fontSize: item.type ? 17 : 15,
              paddingLeft: item.type ? 0 : 20,
             }}>
                {item.label}
            </Text>
          </View>
        )}
      />
    </View>
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
	});
  
  export default ExerciseSelector;