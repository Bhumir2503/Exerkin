import { View, Text, StyleSheet } from "react-native";
import { useUser } from "../../../contexts/UserContext";
import { useTheme } from "../../../contexts/ThemeContext";

const Profile = () => {
	const { themeStyle } = useTheme();
	const { username } = useUser();
	const styles = createStyles(themeStyle);

	const developerNames = ["Bhumir2503", "GradySenpai", "brian"];

	return (
		<View style={styles.profileSection}>
			<View style={styles.avatarContainer}>
				<View style={styles.avatar}>
					<Text style={styles.avatarText}>
						{username?.charAt(0)?.toUpperCase() || "U"}
					</Text>
				</View>
			</View>
			<View style={styles.profileInfo}>
				<Text style={styles.username}>{username}</Text>
				<Text
					style={{
						...styles.userBio,
						color: developerNames.includes(username)
							? "#efbf04"
							: themeStyle.textColorSecondary,
					}}
				>
					{developerNames.includes(username)
						? "Developer"
						: "Fitness Enthusiast"}
				</Text>
			</View>
		</View>
	);
};

const createStyles = (themeStyle) =>
	StyleSheet.create({
		profileSection: {
			paddingHorizontal: 20,
			paddingTop: 20,
			flexDirection: "row",
			alignItems: "center",
		},
		avatarContainer: {
			marginRight: 15,
		},
		avatar: {
			width: 70,
			height: 70,
			borderRadius: 35,
			backgroundColor: themeStyle.primary,
			justifyContent: "center",
			alignItems: "center",
			borderWidth: 3,
			borderColor: themeStyle.backgroundColor,
		},
		avatarText: {
			color: "#fff",
			fontSize: 28,
			fontWeight: "bold",
		},
		profileInfo: {
			flex: 1,
		},
		username: {
			fontSize: 24,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginBottom: 4,
		},
		userBio: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
			opacity: 0.8,
		},
	});

export default Profile;
