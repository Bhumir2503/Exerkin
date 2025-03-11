import { createContext, useState, useContext, useEffect } from "react";
import { getThemeCache } from "../cache/themeCache";
const ThemeContext = createContext();

const themes = {
	// Dark Themes
	midnightPurple: {
		backgroundColor: "#16161a",
		primary: "#7f2af0",
		secondary: "#72757e",
		textColor: "#fffffe",
		textColorSecondary: "#94a1b2",
		card: "#2d2d3a", // Darker card background
		cardAlt: "#2d2d3a", // Alternative card background for variety
		inputBackground: "#1e1e24", // Text input field background
		inputBorder: "#383844", // Text input border
		accent: "#e53170",
		success: "#72B01D",
		error: "#F87060",
		warning: "#F7B32B",
		info: "#3DA9FC",
	},

	moodyEspresso: {
		backgroundColor: "#2a1a12",
		primary: "#c17c41",
		secondary: "#8c5330",
		textColor: "#f2e9e4",
		textColorSecondary: "#d3beaf",
		card: "#4a352c", // Rich brown card background
		cardAlt: "#4a352c", // Alternate card color
		inputBackground: "#362218", // Text input field background
		inputBorder: "#503c30", // Text input border
		accent: "#ff9e6d",
		success: "#58B368",
		error: "#E05D5D",
		warning: "#FFAA5A",
		info: "#55BCD5",
	},

	sunsetBlaze: {
		backgroundColor: "#0f0e17",
		primary: "#ff8906",
		secondary: "#f25f4c",
		textColor: "#fffffe",
		textColorSecondary: "#a7a9be",
		card: "#322f40", // Deep purple-black card
		cardAlt: "#322f40", // Alternate card color
		inputBackground: "#1c1b26", // Text input field background
		inputBorder: "#3c3a4a", // Text input border
		accent: "#e53170",
		success: "#4CAF50",
		error: "#FF5252",
		warning: "#FFB74D",
		info: "#29B6F6",
	},

	oceanDepth: {
		backgroundColor: "#0b2027",
		primary: "#3e92cc",
		secondary: "#57a6d4",
		textColor: "#f6f8ff",
		textColorSecondary: "#cad8de",
		card: "#1d4354", // Deep teal card
		cardAlt: "#1d4354", // Alternate card color
		inputBackground: "#102a33", // Text input field background
		inputBorder: "#265566", // Text input border
		accent: "#1fc3aa",
		success: "#4CAF50",
		error: "#FF5252",
		warning: "#FFC107",
		info: "#03A9F4",
	},

	forestNight: {
		backgroundColor: "#192626",
		primary: "#4d9078",
		secondary: "#64b29e",
		textColor: "#f2f2f2",
		textColorSecondary: "#d3d0cb",
		card: "#324747", // Deep forest green card
		cardAlt: "#324747", // Alternate card color
		inputBackground: "#223131", // Text input field background
		inputBorder: "#3e5151", // Text input border
		accent: "#f98948",
		success: "#8BC34A",
		error: "#FF5722",
		warning: "#FFC107",
		info: "#03A9F4",
	},

	cyberMagenta: {
		backgroundColor: "#180026",
		primary: "#d100d1",
		secondary: "#8800f8",
		textColor: "#f5f5ff",
		textColorSecondary: "#c1b8d9",
		card: "#350d4e", // Deep purple card
		cardAlt: "#350d4e", // Alternate card color
		inputBackground: "#220033", // Text input field background
		inputBorder: "#440066", // Text input border
		accent: "#00ffe0",
		success: "#00E676",
		error: "#FF1744",
		warning: "#FFEA00",
		info: "#00B0FF",
	},

	// Light Themes (making sure cards aren't white)
	lavenderMist: {
		backgroundColor: "#fdfdff",
		primary: "#6246ea",
		secondary: "#d1d1e9",
		textColor: "#2b2c34",
		textColorSecondary: "#47484e",
		card: "#f3f3ff", // Light lavender card (not white)
		cardAlt: "#f3f3ff", // Alternate card color
		inputBackground: "#ebebff", // Text input field background
		inputBorder: "#d1d1e9", // Text input border
		accent: "#e45858",
		success: "#4BB543",
		error: "#FF3B30",
		warning: "#FF9500",
		info: "#007AFF",
	},

	peachCream: {
		backgroundColor: "#fef6e4",
		primary: "#f582ae",
		secondary: "#8bd3dd",
		textColor: "#001858",
		textColorSecondary: "#172c66",
		card: "#feeadc", // Peachy card (not white)
		cardAlt: "#feeadc", // Alternate card color
		inputBackground: "#fef0e4", // Text input field background
		inputBorder: "#f3d2c1", // Text input border
		accent: "#e78a61",
		success: "#4CAF50",
		error: "#F44336",
		warning: "#FFC107",
		info: "#2196F3",
	},

	sunnyDaisy: {
		backgroundColor: "#fffffe",
		primary: "#ffc107",
		secondary: "#e5f4e3",
		textColor: "#272343",
		textColorSecondary: "#2d334a",
		card: "#f0f0f0", // Very light gray card (not white)
		cardAlt: "#f0f0f0", // Alternate card color
		inputBackground: "#f5f5f5", // Text input field background
		inputBorder: "#e0e0e0", // Text input border
		accent: "#ff6b6b",
		success: "#4CAF50",
		error: "#F44336",
		warning: "#FFC107",
		info: "#2196F3",
	},

	skyBlossom: {
		backgroundColor: "#f4f9ff",
		primary: "#3da9fc",
		secondary: "#c4e0ff",
		textColor: "#1e293b",
		textColorSecondary: "#475569",
		card: "#e6f0ff", // White card (consider making it #f0f5ff for non-white)
		cardAlt: "#e6f0ff", // A more noticeable blue tint
		inputBackground: "#ecf4ff", // Text input field background
		inputBorder: "#c4e0ff", // Text input border
		accent: "#ef4565",
		success: "#4CAF50",
		error: "#F44336",
		warning: "#FFC107",
		info: "#2196F3",
	},

	mintFresh: {
		backgroundColor: "#fafffb",
		primary: "#00bd8e",
		secondary: "#c3f0e4",
		textColor: "#194350",
		textColorSecondary: "#2d5f5d",
		card: "#e3faef", // Light mint card (not white)
		cardAlt: "#e3faef", // Alternate card color
		inputBackground: "#e8fff1", // Text input field background
		inputBorder: "#c3f0e4", // Text input border
		accent: "#ff8552",
		success: "#4CAF50",
		error: "#F44336",
		warning: "#FFC107",
		info: "#2196F3",
	},

	rosePetal: {
		backgroundColor: "#fff8f8",
		primary: "#d85893",
		secondary: "#f8d1e0",
		textColor: "#33272a",
		textColorSecondary: "#594a4e",
		card: "#ffe4eb", // Light pink card (not white)
		cardAlt: "#ffe4eb", // Alternate card color
		inputBackground: "#ffecf0", // Text input field background
		inputBorder: "#f8d1e0", // Text input border
		accent: "#ff8e3c",
		success: "#4CAF50",
		error: "#F44336",
		warning: "#FFC107",
		info: "#2196F3",
	},
};

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState("lavenderMist"); // Default theme

	useEffect(() => {
		const getTheme = async () => {
			const theme = await getThemeCache();
			console.log("Theme: ", theme);
			if (theme) {
				setTheme(theme);
			}
		};

		getTheme();
	}, []);

	const changeTheme = (theme) => {
		setTheme(theme);
	};

	return (
		<ThemeContext.Provider
			value={{ theme, themeStyle: themes[theme], changeTheme }}
		>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
