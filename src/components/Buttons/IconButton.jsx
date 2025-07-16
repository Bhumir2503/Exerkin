import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const IconButton = ({ icon, onPress, buttonStyle, size, color }) => {
	return (
		<Pressable
			style={({ pressed }) => [
				{
					opacity: pressed ? 0.5 : 1,
				},
				buttonStyle,
			]}
			onPress={onPress}
		>
			<Ionicons name={icon} size={size} color={color} />
		</Pressable>
	);
};

export default IconButton;
