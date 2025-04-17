import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";

const qutoes = require("success-motivational-quotes");

const QuoteCard = () => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	const quoteOfTheDay = qutoes.getTodaysQuote();

	return (
		<View style={{justifyContent: "center", alignItems: "center", marginTop: 20}}>
            <View style={styles.card}>
                <View style={styles.content}>
                    <Text style={styles.body}>{quoteOfTheDay.body}</Text>
                    <Text style={styles.by}>— {quoteOfTheDay.by}</Text>
                </View>
            </View>
        </View>
	);
};

const createStyles = (themeStyle) =>
	StyleSheet.create({
		card: {
			backgroundColor: themeStyle.card,
			borderRadius: 8,
			padding: 16,

			alignItems: "center",
			width: "90%",
		},
		content: {
			width: "100%",

		},
		body: {
			fontSize: 16,
			fontWeight: "bold",
			color: themeStyle.textColor,
			textAlign: "center",
		},
		by: {
			fontSize: 14,
            marginTop: 10,
			color: themeStyle.accent,
			textAlign: "right",
		},
	});

export default QuoteCard;
