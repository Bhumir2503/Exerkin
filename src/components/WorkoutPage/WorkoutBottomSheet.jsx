import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

/*DISCLAIMER: Unsure whether or not this component will receive or pass props, so we will need to communicate properly on what data will be passed to where */

//This component will pull up a sheet where the user will be able to add an exercise to their workout
//The user will be able to select from a list of exercises and add them to their workout, and from there add separate sets and reps.

//In this sheet, we must also import our timer component (WorkoutTimer) at the top of the sheet, it will be used to track the time spent on the workout
//We must also import our ExerciseSelector component, it will be used to select exercises to add to the workout 

//When the user picks an exercise, they are given the option to add a set, and a rep count. They can then add another set and rep count, or add another exercise.

//When done, the user will have a finish button that will print out their workout to console.

const WorkoutBottomSheet = () => {
    const [exercises, setExercises] = useState([]);
  
    return (
        0
    );
  };
  
  export default WorkoutBottomSheet;

