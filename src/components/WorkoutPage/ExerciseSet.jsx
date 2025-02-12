import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useTheme } from "../../contexts/ThemeContext";


const ExerciseSet = ({setNum, setData}) => {
    const { themeStyle } = useTheme();
    return (
        <View>
            <Text>{setData}</Text>
        </View>
    );
}

export default ExerciseSet