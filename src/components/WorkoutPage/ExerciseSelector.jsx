import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
/*DISCLAIMER: Unsure whether or not this component will receive or pass props, so we will need to communicate properly on what data will be passed to where */

//this component should be used to develop a dropdown menu for selecting exercises,
//it should be able to take in a list of exercises and display them in a dropdown menu. Or you can create 
//an array of exercises and pass it to the dropdown menu for now.

//Use the Dropdown imported above, you will need to install the package react-native-element-dropdown
const exerciseOptions = [
    { label: 'Bench Press', value: 'bench_press' },
    { label: 'Squat', value: 'squat' },
    { label: 'Deadlift', value: 'deadlift' },
  ];

  /*
  Here is an example on how to use this component. Try importing it into the Workout.jsx page and use it like this:
  <ExerciseSelector onSelect={setSelectedExercise} />
          <Text style={{ marginTop: 20, fontSize: 18 }}>
                Selected Exercise: {selectedExercise || "None"}
          </Text>
*/

const ExerciseSelector = ({ onSelect }) => {
    return(
      <Dropdown 
        data={exerciseOptions} 
        labelField="label"
        valueField="value"
        placeholder="Select an option"
        search // Enables search feature (optional)
        onChange={(item) => onSelect(item.label)}
        style={{ 
          borderWidth: 1, 
          borderColor: "#ccc", 
          padding: 10, 
          width: 250 // ✅ Set a proper width
        }}
      />
    )
};
  
  export default ExerciseSelector;