import { Text, View, TextInput, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";

export default function EditProfile({navigation}) {
    const { themeStyle } = useTheme();
    const styles = createStyles(themeStyle);
    return (
		<SafeAreaView style={{ backgroundColor: themeStyle.backgroundColor, flex: 1 }}>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					alignContent: "center",
					marginBottom: 30,
				}}
			>
				<Ionicons
					name="chevron-back-outline"
					size={25}
					color={themeStyle.textColor}
					style={{ marginLeft: 10, marginTop: 1 }}
					onPress={() => navigation.goBack()}
				/>
				<Text style={styles.title}>Edit Profile</Text>
			</View>
            <View>
                {inputText({header: "Username", placeholder: "Enter your username", maxLength: 20, inputType: "text"})}
                {inputText({header: "Bio", placeholder: "Enter your bio", maxLength: 50, inputType: "email"})}
                {inputText({header: "Height", placeholder: "Enter your height", maxLength: 3, inputType: "numberic"})}
                {inputText({header: "Weight", placeholder: "Enter your weight", maxLength: 3, inputType: "numberic"})}
                {inputText({header: "Age", placeholder: "Enter your age", maxLength: 2, inputType: "numberic"})}

    
            </View>
		</SafeAreaView>
	);
}

const inputText = ({header, placeholder, maxLength, inputType}) => {
    const { themeStyle } = useTheme();
    const styles = createStyles(themeStyle);
    return (
        <View>
            <Text style={styles.header}>{header}</Text>
            <TextInput style={styles.input} placeholder={placeholder} placeholderTextColor={themeStyle.textColorSecondary} inputMode={inputType} maxLength={maxLength} />
        </View>
    );
}

const createStyles = (themeStyle) =>
	StyleSheet.create({
		title: {
			fontSize: 20,
			color: themeStyle.textColor,
			fontWeight: "bold",
			marginLeft: 5,
		},
        header: {
            fontSize: 14,
            color: themeStyle.textColor,
            fontWeight: "bold",
            marginBottom: 5,
            marginLeft: 25,
        },
        input:{
            backgroundColor: themeStyle.card,
            color: themeStyle.textColor,
            borderRadius: 5,
            padding: 10,
            marginHorizontal: 25,
            marginBottom: 20,
        }
	});
