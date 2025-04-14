import React from "react";
import { StyleSheet, View, TextInput } from "react-native";
import FinishButton from "./Modals/FinishButton";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useTemplate } from "../../contexts/TemplateContext";

const TemplateHeader = ({ navigation }) => {
	const { themeStyle } = useTheme();
	const { templateExercises, TemplateTitle: TemplateTitleRef } =
		useTemplate();

	const styles = createStyles(themeStyle);
	const [templateTitle, setTemplateTitle] = useState(
		TemplateTitleRef.current
	);

	useEffect(() => {
		setTemplateTitle(TemplateTitleRef.current);
	}, [TemplateTitleRef.current]);

	const handleTitleChange = (text) => {
		setTemplateTitle(text);
		TemplateTitleRef.current = text;
	};

	const handleDownArrowPress = () => {
		navigation.goBack(); // This will close the modal and return to the previous screen in the stack navigator
	};

	return (
		<>
			<View style={{ ...styles.container }}>
				{/* Left section */}
				<View style={styles.leftSection}>
					<Ionicons
						name="chevron-down"
						size={32}
						color={themeStyle.primary}
						onPress={handleDownArrowPress}
					/>
				</View>

				{/* Center section - always centered */}
				<View style={styles.centerSection}>
					<TextInput
						style={styles.titleInput}
						value={templateTitle}
						placeholder={"Untitled Blueprint"}
						onChangeText={(text) => handleTitleChange(text)}
						maxLength={30}
						placeholderTextColor={themeStyle.textColorSecondary}
						cursorColor={themeStyle.primary} // Add primary color to cursor
						autoCapitalize="none"
						caretHidden={false}
						showSoftInputOnFocus={true}
					/>
				</View>

				{/* Right section */}
				<View style={styles.rightSection}>
					{templateExercises.length > 0 && (
						<FinishButton navigation={navigation} />
					)}
				</View>
			</View>
		</>
	);
};

const createStyles = (themeStyle) => {
	return StyleSheet.create({
		container: {
			flexDirection: "row",
			paddingHorizontal: 20,
			paddingTop: 15,
			paddingBottom: 0,
			alignItems: "center",
		},
		leftSection: {
			flex: 1,
			alignItems: "flex-start",
		},
		centerSection: {
			flex: 4,
			alignItems: "center",
		},
		rightSection: {
			flex: 1,
			alignItems: "flex-end",
		},
		text: {
			color: themeStyle.accent,
			fontSize: 24,
		},
		titleInput: {
			color: themeStyle.textColor,
			fontSize: 24,
			textAlign: "center",
			fontWeight: "bold",
		},
	});
};

export default TemplateHeader;
