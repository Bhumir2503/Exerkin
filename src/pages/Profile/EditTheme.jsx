import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function EditTheme({ navigation }) {
	const { themeStyle, setTheme } = useTheme();
	const [selected, setSelected] = useState(themeStyle.name);
    const styles = createStyles(themeStyle);

	return (
		<SafeAreaView
			style={{ backgroundColor: themeStyle.backgroundColor, flex: 1 }}
		>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        alignContent: "center",
                    }}
                >
                    <Ionicons
                        name="chevron-back-outline"
                        size={25}
                        color={themeStyle.textColor}
                        style={{ marginLeft: 5, marginTop: 1 }}
                        onPress={() => navigation.goBack()}
                    />
                    <Text style={styles.title}>Edit Theme</Text>
                </View>
		</SafeAreaView>
	);
}

const createStyles = (themeStyle) => StyleSheet.create({
    title: {
        fontSize: 20,
        color: themeStyle.textColor,
        fontWeight: "bold",
        marginLeft: 5,
    },
});
