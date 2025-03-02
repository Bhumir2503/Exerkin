import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';


export const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor( (seconds % 3600) / 60 );
    const sec = seconds % 60;
    let timeString = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    return timeString;
}

const WorkoutTimer = ({visible, time, setTime}) => {
  //const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const {themeStyle} = useTheme();
  const styles = createStyles(themeStyle);
  
  //Use visible prop to toggle isRunning state of the timer
  useEffect(() =>{
    if(visible){
      setIsRunning(true);
    }
    else{
      setIsRunning(false);
      setTime(0);
    }
  },[visible, setTime]);


  useEffect(() => {
    let intervalID;

    if(isRunning){
      intervalID = setInterval(() =>{
        setTime((prevSeconds) => prevSeconds+1);
      }, 1000);
    } 
    else{
      setTime(0);
    }
    return () => clearInterval(intervalID);
  }, [isRunning, setTime]);

  return (
    <View style={styles.container}>
        <Text style={styles.timeText}> {formatTime(time)} </Text>        
    </View>
  );
};

const createStyles = (theme) => {
  return StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 10 },
  timeText: { fontSize: 18, fontWeight: 'bold', color: theme.textColor },
})};

export default WorkoutTimer;