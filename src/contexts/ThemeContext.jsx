import { createContext, useState, useContext } from "react";
const ThemeContext = createContext();

const themes = {
	// Dark Themes
	midnightPurple: {
		backgroundColor: "#16161a",
		primary: "#7f2af0",
		secondary: "#72757e",
		textColor: "#fffffe",
		textColorSecondary: "#94a1b2",
		card: "#242430",
		accent: "#e53170",
	},

	moodyEspresso: {
		backgroundColor: "#2a1a12",
		primary: "#c17c41",
		secondary: "#8c5330",
		textColor: "#f2e9e4",
		textColorSecondary: "#d3beaf",
		card: "#402e25",
		accent: "#ff9e6d",
	},

	sunsetBlaze: {
		backgroundColor: "#0f0e17",
		primary: "#ff8906",
		secondary: "#f25f4c",
		textColor: "#fffffe",
		textColorSecondary: "#a7a9be",
		card: "#272534",
		accent: "#e53170",
	},

	oceanDepth: {
		backgroundColor: "#0b2027",
		primary: "#3e92cc",
		secondary: "#57a6d4",
		textColor: "#f6f8ff",
		textColorSecondary: "#cad8de",
		card: "#153642",
		accent: "#1fc3aa",
	},

	forestNight: {
		backgroundColor: "#192626",
		primary: "#4d9078",
		secondary: "#64b29e",
		textColor: "#f2f2f2",
		textColorSecondary: "#d3d0cb",
		card: "#2a3c3c",
		accent: "#f98948",
	},

	cyberMagenta: {
		backgroundColor: "#180026",
		primary: "#d100d1",
		secondary: "#8800f8",
		textColor: "#f5f5ff",
		textColorSecondary: "#c1b8d9",
		card: "#2c0940",
		accent: "#00ffe0",
	},

	// Light Themes
	lavenderMist: {
		backgroundColor: "#fdfdff",
		primary: "#6246ea",
		secondary: "#d1d1e9",
		textColor: "#2b2c34",
		textColorSecondary: "#47484e",
		card: "#f3f3ff",
		accent: "#e45858",
	},

	peachCream: {
		backgroundColor: "#fef6e4",
		primary: "#f582ae",
		secondary: "#8bd3dd",
		textColor: "#001858",
		textColorSecondary: "#172c66",
		card: "#fff3ec",
		accent: "#e78a61",
	},

	sunnyDaisy: {
		backgroundColor: "#fffffe",
		primary: "#ffc107",
		secondary: "#e5f4e3",
		textColor: "#272343",
		textColorSecondary: "#2d334a",
		card: "#fafafa",
		accent: "#ff6b6b",
	},

	skyBlossom: {
		backgroundColor: "#f4f9ff",
		primary: "#3da9fc",
		secondary: "#c4e0ff",
		textColor: "#1e293b",
		textColorSecondary: "#475569",
		card: "#ffffff",
		accent: "#ef4565",
	},

	mintFresh: {
		backgroundColor: "#fafffb",
		primary: "#00bd8e",
		secondary: "#c3f0e4",
		textColor: "#194350",
		textColorSecondary: "#2d5f5d",
		card: "#f0fff7",
		accent: "#ff8552",
	},

	rosePetal: {
		backgroundColor: "#fff8f8",
		primary: "#d85893",
		secondary: "#f8d1e0",
		textColor: "#33272a",
		textColorSecondary: "#594a4e",
		card: "#fff0f3",
		accent: "#ff8e3c",
	},
};

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState("sunsetBlaze"); // Default theme

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
