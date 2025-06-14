import { View, Text, StyleSheet } from "react-native";
import { useUser } from "../../../contexts/UserContext";
import { useTheme } from "../../../contexts/ThemeContext";
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

const Profile = () => {
	const { themeStyle } = useTheme();
	const { username } = useUser();
	const styles = createStyles(themeStyle);

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
				
				<MaskedView maskElement={
				(<Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>

					Developer
				</Text>)
				}>
				<LinearGradient
					colors={['#FFD700', '#FFC200', '#FFB300']}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
					style={{width: "35%", height: 30, marginTop: 0}}
				/>
				</MaskedView>
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
