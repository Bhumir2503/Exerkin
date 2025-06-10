import React, { useState, useEffect } from "react";
import {
	View,
	TextInput,
	StyleSheet,
	Text,
	Modal,
	TouchableOpacity,
	ScrollView,
	FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useWorkoutExercises } from "../contexts/workout/WorkoutExercisesContext";
import {
	exercises,
	exerciseCategories,
	getExercisesByCategory,
    equipmentTypes,
    exerciseTypes
} from "../services/constants/exerciseLibrary";


function ExerciseCreator({cancelCreateWorkout}) {
    const { themeStyle } = useTheme();
    const styles = createStyles(themeStyle);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const [selectedEquipment, setSelectedEquipment] = useState("");

    const difficulties = [
        { id: "beginner", name: "beginner"}, 
        { id: "intermediate", name: "intermediate" }, 
        {id: "advanced", name: "advanced"}, 
        {id: "scalable", name: "scalable"}]

    return (
        <View style={styles.primaryContent}>
            <Text style={styles.primaryHeader}> Exercise Creator</Text>
            <TextInput placeholder="Exercise name"></TextInput>
            <Text style={styles.categorySeperator}>Category</Text>
            <View style={styles.categoryContainer}>
                {exerciseCategories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.categoryChip,
                            selectedCategory === category.id &&
                                styles.selectedCategoryChip,
                        ]}
                        onPress={() => setSelectedCategory(category.id)}
                    >
                        <Text
                            key={category.id}
                            style={[
                                selectedCategory === category.id
                                    ? styles.selectedCategoryText
                                    : styles.categoryText,
                            ]}
                        >
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Text style={styles.categorySeperator}>Primary Muscles</Text>
            <Text style={styles.categorySeperator}>Secondary Muscles</Text>
            <Text style={styles.categorySeperator}>Difficulty</Text>
            <View style={styles.categoryContainer}>
                {difficulties.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.categoryChip,
                            selectedDifficulty === category.id &&
                                styles.selectedCategoryChip,
                        ]}
                        onPress={() => setSelectedDifficulty(category.id)}
                    >
                        <Text
                            key={category.id}
                            style={[
                                selectedDifficulty === category.id
                                    ? styles.selectedCategoryText
                                    : styles.categoryText,
                            ]}
                        >
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Text style={styles.categorySeperator}>Type</Text>
            <View style={styles.categoryContainer}>
                {exerciseTypes.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.categoryChip,
                            selectedType === category.id &&
                                styles.selectedCategoryChip,
                        ]}
                        onPress={() => setSelectedType(category.id)}
                    >
                        <Text
                            key={category.id}
                            style={[
                                selectedType === category.id
                                    ? styles.selectedCategoryText
                                    : styles.categoryText,
                            ]}
                        >
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Text style={styles.categorySeperator}>Equipment</Text>
            <View style={styles.categoryContainer}>
                {equipmentTypes.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.categoryChip,
                            selectedEquipment === category.id &&
                                styles.selectedCategoryChip,
                        ]}
                        onPress={() => setSelectedEquipment(category.id)}
                    >
                        <Text
                            key={category.id}
                            style={[
                                selectedEquipment === category.id
                                    ? styles.selectedCategoryText
                                    : styles.categoryText,
                            ]}
                        >
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity onPress={() => cancelCreateWorkout()}><Text>Go back</Text></TouchableOpacity>
        </View>
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
    });


export default ExerciseCreator;