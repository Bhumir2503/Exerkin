import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
/*DISCLAIMER: Unsure whether or not this component will receive or pass props, so we will need to communicate properly on what data will be passed to where */

//This timer will be displayed at the top of the workout page, tracking the time spent on the workout
//use the states time and isRunning to track the time and whether the timer is running

const WorkoutTimer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  return (
    <View style={styles.container}>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 10 },
  timeText: { fontSize: 18, fontWeight: 'bold' },
});

export default WorkoutTimer;
