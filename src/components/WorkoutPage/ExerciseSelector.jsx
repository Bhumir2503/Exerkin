import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useTheme } from "../../contexts/ThemeContext";
/*DISCLAIMER: Unsure whether or not this component will receive or pass props, so we will need to communicate properly on what data will be passed to where */

//this component should be used to develop a dropdown menu for selecting exercises,
//it should be able to take in a list of exercises and display them in a dropdown menu. Or you can create 
//an array of exercises and pass it to the dropdown menu for now.

//Use the Dropdown imported above, you will need to install the package react-native-element-dropdown
const allExercises = [
  { label: "Chest", value: "chest", type: "category" },
  { label: "Dumbbell Bench Press", value: "db_bench_press", category: "chest" },
  { label: "Barbell Bench Press", value: "bb_bench_press", category: "chest" },

  { label: "Back", value: "back", type: "category" },
  { label: "Dumbbell Row", value: "db_row", category: "back" },
  { label: "Barbell Deadlift", value: "bb_deadlift", category: "back" },

  { label: "Arms", value: "arms", type: "category" },
  { label: "Dumbbell Curl", value: "db_curl", category: "arms" },
  { label: "Barbell Curl", value: "bb_curl", category: "arms" },
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
  const [selectedExercise, setSelectedExercise] = useState(null);

  return (
    <View style={{ paddingVertical: 10 }}>
      <Dropdown
        data={allExercises}
        labelField="label"
        valueField="value"
        placeholder="Select an Exercise"
        value={selectedExercise}
        onChange={(item) => {
          if (!item.type) {  
            setSelectedExercise(item.value);
            onSelect(item.label);
          }
        }}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          backgroundColor: "#fff",  //White dropdown box
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