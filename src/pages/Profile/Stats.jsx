import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import { useTheme } from "../../contexts/ThemeContext";
import { useWorkout } from "../../contexts/WorkoutContext";
import storage from "../../utils/storage";

export default function Stats({navigation}) {
	const { workoutHistory } = useWorkout();
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const [toggle, setToggle] = useState(false);
	const [workouts, setWorkouts] = useState([]);

	const toggleFilter = () => {
		setToggle((prevToggle)  => !prevToggle);
		//getBestLift(filterWorkoutData("Barbell Bench Press", workoutHistory), toggle);
	};

	//Pass this the exercise name and workoutHistory context
	const filterWorkoutData = (targetName, workouts) => {
		let filteredWorkoutHistory = []
		workouts.forEach(workout => {
			workout.exercises.map((exercise, index) => {
				if (exercise.name === targetName){
					filteredWorkoutHistory.push(exercise)
				}
			})
		})
		//This returned value will be the first parameter to the getBestLift function
		return filteredWorkoutHistory;
	};

	const getBestLift = (filteredWorkoutHistory, toggle) => {
		
		// If no sessions have been logged for the target exercise, no data available will be displayed
		if(filteredWorkoutHistory.length < 1){ return { text: `No data available`, isEstimated: true } }

		let bestOneRepMaxWeight = 0;
		let bestOneRepMaxReps = 0;
		let bestVolume = 0;
		let bestSetWeight = 0;
		let bestSetReps = 0;

		filteredWorkoutHistory.forEach( exercise => {
			if(Array.isArray(exercise.sets) &&	exercise.sets.length > 0) {
				exercise.sets.map((set, setIndex) => {
					console.log(`Set: ${setIndex+1} Weight: ${set.weight}  Reps: ${set.reps} Volume: ${set.weight * set.reps}`)
					if(toggle){
						if(Number(set.weight) > Number(bestOneRepMaxWeight)){
							bestOneRepMaxWeight = set.weight
							bestOneRepMaxReps = set.reps
							//return
						}
						else if(Number(set.weight) == Number(bestOneRepMaxWeight) && Number(set.reps) > Number(bestOneRepMaxReps)) { 
							bestOneRepMaxReps = set.reps
						}
					}
					else{
						if(Number(set.weight) * Number(set.reps) > Number(bestVolume)){
							bestVolume = set.weight * set.reps
							bestSetWeight = set.weight
							bestSetReps = set.reps
						}
					}
				})
			}
			else {console.log("no set data available")}
		})
		if((bestOneRepMaxReps == 0 || bestOneRepMaxWeight == 0) && bestVolume == 0){
			return{text: `No data available`, isEstimated: true}
		}
		if(toggle){
			if(bestOneRepMaxReps == 1){
				console.log(`Best 1RM Weight: ${bestOneRepMaxWeight} Best 1RM Reps: ${bestOneRepMaxReps}`)
				return { text: `${bestOneRepMaxWeight}lbs`, isEstimated: false }
			}
			else{
				//call 1RM calculator function here
				bestOneRepMaxWeight= calcOneRepMax(bestOneRepMaxWeight, bestOneRepMaxReps);
				console.log(`Best 1RM Weight: ${bestOneRepMaxWeight}`)
				return { text: `${bestOneRepMaxWeight}lbs`, isEstimated: true } 
			}
		}
		else{
			console.log(`Best set is ${bestSetWeight}lbs for ${bestSetReps} reps`) 
			return { text: `${bestSetWeight}lbs x ${bestSetReps} reps`, isEstimated: false }
		}
	};

	const calcOneRepMax = (bestOverallWeight, bestSetReps) =>{
		return (Math.round(bestOverallWeight / ((1.0278)-(0.0278*bestSetReps))))
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style = {styles.topBar}>
				<Ionicons name="chevron-back" size={35} color={themeStyle.textColor} onPress={()=>navigation.goBack()}/>
				<Text style={styles.title}>Stats</Text>
			</View>

			<View style = {styles.bestLiftsBox} >

				<View style = {styles.headerRow} >
					<Text style = {styles.bestLiftsTitle}>Best Lifts </Text>
					<View style = {styles.filterRow}>
						<FilterBy
								style={styles.filterButton} 
								onPress = {toggleFilter}
								toggle = {toggle}
						/>
						<Ionicons name="chevron-down-outline" size={12} color={themeStyle.textColor} />
					</View>
				</View>
				
				<View style = {styles.headerRow}>
					<Text style = {styles.liftName}>Barbell Bench Press: </Text>
					{(() => {
						const { text, isEstimated } = getBestLift(filterWorkoutData("Barbell Bench Press", workoutHistory), toggle);
						return <Text style = {isEstimated ? styles.liftNameEstimated : styles.liftName}>{text}</Text>
					})()}
				</View>
				<View style = {styles.headerRow}>
					<Text style = {styles.liftName}>Barbell Deadlift: </Text>
					{(() => {
						const { text, isEstimated } = getBestLift(filterWorkoutData("Barbell Deadlift", workoutHistory), toggle);
						return <Text style = {isEstimated ? styles.liftNameEstimated : styles.liftName}>{text}</Text>
					})()}
				</View>
				<View style = {styles.headerRow}>
					<Text style = {styles.liftName}>Smith Machine Squat: </Text>
					{(() => {
						const { text, isEstimated } = getBestLift(filterWorkoutData("Smith Machine Squat", workoutHistory), toggle);
						return <Text style = {isEstimated ? styles.liftNameEstimated : styles.liftName}>{text}</Text>
					})()}
				</View>
				
			</View>
		</SafeAreaView>
	);
}

const FilterBy = ({onPress, toggle}) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	return (
		<TouchableOpacity onPress={onPress}>
			<Text style = {styles.filterButtonText}>
				{toggle ? 'Filter: 1RM' : 'Filter: Reps'}
			</Text>
		</TouchableOpacity>
	);
};

const createStyles = (themeStyle) =>
	StyleSheet.create({
		container: {
			flex: 1,
			alignItems: "center",
			backgroundColor: themeStyle.backgroundColor,
		},
		topBar: {
			marginTop: 20,
			paddingHorizontal: 25,
			width: "100%",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
		},
		title: {
			flex: 1,
			fontSize: 36,
			fontWeight: "bold",
			color: themeStyle.textColor,
			paddingHorizontal: 110,
		},
		bestLiftsBox: {
			justifyContent: "center",
			borderRadius: 10,
			marginHorizontal: 30,
			padding: 10,
			backgroundColor: themeStyle.primary,
			marginTop: 20,
			width: "90%",
		},
		bestLiftsTitle:{
			paddingHorizontal: 10,
			marginBottom: 2,
			fontSize: 16,
			alignSelf: "left",
			color: themeStyle.textColor,
			fontWeight: "bold",
			textDecorationLine: "underline",
		},
		headerRow:{
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between"
		},	
		filterRow:{
			flexDirection: "row",
			alignItems: "center",
			justifyContent:"space-between",
		},
		liftName: {
			paddingHorizontal: 10,
			marginBottom: 2,
			fontSize: 16,
			alignSelf: "left",
			color: themeStyle.textColor,
		},
		liftNameEstimated:{
			paddingHorizontal: 10,
			marginBottom: 2,
			fontSize: 16,
			alignSelf: "left",
			color: themeStyle.textColor,
			fontStyle: "italic",
		},
		filterButton: {
			backgroundColor: themeStyle.primary,
		},
		filterButtonText: {
			color: themeStyle.textColor,
			fontSize: 16,
			paddingHorizontal: 0,
			fontWeight: "bold",
			textDecorationLine: "underline",
		},
	});

	
	// useEffect to call fetchWorkouts when the component mounts and when toggle changes
	/*useEffect(() => {
		fetchWorkouts(workoutHistory);
	}, [toggle]);  // This only runs on initial render
	*/