import React, { useState, useRef } from "react";
import {
	View,
	TextInput,
	StyleSheet,
	Text,
	TouchableOpacity,
	ScrollView,
    Alert,
} from "react-native";
import { buildExerciseObject } from "../../services/helpers/objectBuilder";
import { useWorkoutExercises } from "../../contexts/workout/WorkoutExercisesContext";
import { useBlueprintExercises } from "../../contexts/blueprint/BlueprintExercisesContext";
import { useTheme } from "../../contexts/ThemeContext";
import {
	exerciseCategories,
    equipmentTypes,
    exerciseTypes,
    muscleTypes,
} from "../../services/constants/exerciseLibrary";
import SelectionChips from "./components/SelectionChips";


function ExerciseCreator({setCreatingExercise, closeModal, type}) {
    const { themeStyle } = useTheme();
    const styles = createStyles(themeStyle);

    const { workoutExercises, addExercise } = useWorkoutExercises();
    const { blueprintExercises, addExerciseToBlueprint } = useBlueprintExercises();

    const difficulties = [
        { id: "beginner", name: "beginner"}, 
        { id: "intermediate", name: "intermediate" }, 
        {id: "advanced", name: "advanced"}, 
        {id: "scalable", name: "scalable"}
    ];

    const category = useRef([]);
    const exerciseType = useRef([]);
    const difficulty = useRef([]);
    const equipment = useRef([]);
    const primaryMuscle = useRef([]);
    const secondaryMuscle = useRef([]);

    const exerciseTitle = useRef("");


    const handleAddExercise = () => {
            let selectedExercise = {
                categoryId: category.current,
                difficulty: difficulty.current,
                equipment: equipment.current,
                id: exerciseTitle.current,
                insructions: "input not added yet",
                name: exerciseTitle.current,
                primaryMuscles: primaryMuscle.current,
                secondaryMuscles: secondaryMuscle.current,
                type: exerciseType.current[0],
            }
            
            if (!category.current.length || !exerciseType.current.length || !difficulty.current.length || 
                !equipment.current.length || !primaryMuscle.current.length || !secondaryMuscle.current.length) {

                Alert.alert("Empty Field", "Please fill out all fields before creating the exercise");
                return
            }

            if (type === "workout") {
                const exercise = buildExerciseObject(selectedExercise);
                addExercise(exercise);
            } else if (type === "blueprint") {
                const exercise = buildExerciseObject(selectedExercise);
                addExerciseToBlueprint(exercise);
            }
            setCreatingExercise(false);
            closeModal();
    };

    return (
        <View style={styles.modalContent}>
            <TitleInput titleRef={exerciseTitle} />
        <View style={styles.actionContainer}>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.primaryContent}>

                <Text style={styles.categorySeperator}>Category</Text>
                <SelectionChips 
                    all={false}
                    wrap={true}
                    values={exerciseCategories}
                    selectedRef={category}
                />
                
                <Text style={styles.categorySeperator}>Primary Muscles</Text>
                <SelectionChips 
                    multiple={true}
                    all={false}
                    wrap={true}
                    values={muscleTypes}
                    selectedRef={primaryMuscle}
                />
                
                <Text style={styles.categorySeperator}>Secondary Muscles</Text>
                <SelectionChips 
                    multiple={true}
                    all={false}
                    wrap={true}
                    values={muscleTypes} 
                    selectedRef={secondaryMuscle}
                />
                
                <Text style={styles.categorySeperator}>Difficulty</Text>
                <SelectionChips 
                    all={false}
                    wrap={true}
                    values={difficulties} 
                    selectedRef={difficulty}
                />

                <Text style={styles.categorySeperator}>Type</Text>
                <SelectionChips 
                    all={false}
                    wrap={true}
                    values={exerciseTypes} 
                    selectedRef={exerciseType}
                />

                <Text style={styles.categorySeperator}>Equipment</Text>
                <SelectionChips 
                    all={false}
                    wrap={true}
                    values={equipmentTypes} 
                    selectedRef={equipment}
                />

            </View>
        </ScrollView>
        <View style={styles.actionContainer}>
                <TouchableOpacity
                    style={[
                        styles.actionButton,
                        styles.cancelButton,
                    ]}
                    onPress={() => setCreatingExercise(false)}
                >
                    <Text style={styles.cancelButtonText}>
                        Go Back
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.actionButton,
                        styles.addButton,
                    ]}
                    onPress={handleAddExercise}
                >
                    <Text style={styles.addButtonText}>
                        Create Exercise
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}


function TitleInput({titleRef}) {
    const { themeStyle } = useTheme();
    const styles = createStyles(themeStyle);

    const [title, setTitle] = useState("");

    return (
        <TextInput
            style={styles.titleInput}
            value={title}
            placeholder={"Untitled Exercise"}
            onChangeText={(text) => {titleRef.current = text; setTitle(text)}}
            maxLength={30}
            placeholderTextColor={themeStyle.textColorSecondary}
            cursorColor={themeStyle.primary} // Add primary color to cursor
            autoCapitalize="words"
            caretHidden={false}
            showSoftInputOnFocus={true}
        />
    )
}

const createStyles = (themeStyle) =>
	StyleSheet.create({
        primaryContent: {
            display: "flex",
            flexDirection: "column"
        },
        primaryHeader: {
            margin: "auto",
            fontSize: 26,
			fontWeight: "bold",
			color: themeStyle.textColor,
        },
        header: {
            display: "flex",
            flexDirection: "row"
        },
        categorySeperator: {
            fontSize: 20,
			fontWeight: "bold",
			color: themeStyle.textColor,
            marginBottom: 10,
        },

        // Category filters
		categoryContainer: {
			display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
		},

		categoryChip: {
			backgroundColor: themeStyle.card,
			paddingHorizontal: 12,
			paddingVertical: 6,
			borderRadius: 10,
            margin: 2,
            marginBottom: 4,
		},
		selectedCategoryChip: {
			backgroundColor: themeStyle.primary,
		},
		categoryText: {
			color: themeStyle.textColor,
			fontWeight: "500",
		},
		selectedCategoryText: {
			color: "white",
		},
		// Action buttons
		actionContainer: {
			flexDirection: "row",
			justifyContent: "space-between",
			marginTop: 12,
			paddingVertical: 8,
		},
		actionButton: {
			flex: 1,
			padding: 12,
			borderRadius: 6,
			alignItems: "center",
			justifyContent: "center",
		},
		cancelButton: {
			marginRight: 8,
			backgroundColor: themeStyle.card,
		},
		addButton: {
			backgroundColor: themeStyle.primary,
		},
		disabledButton: {
			opacity: 0.5,
		},
		cancelButtonText: {
			color: themeStyle.textColor,
			fontWeight: "600",
		},
		addButtonText: {
			color: "white",
			fontWeight: "600",
		},
        modalContent: {
			width: "95%",
			height: "85%",
			backgroundColor: themeStyle.backgroundColor,
			borderRadius: 8,
			padding: "3%",
			paddingBottom: 8,
			overflow: "hidden",
		},
        titleInput: {
			color: themeStyle.textColor,
			fontSize: 24,
			textAlign: "center",
			fontWeight: "bold",
		},
    });


export default ExerciseCreator;