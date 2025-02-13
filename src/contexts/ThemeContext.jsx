import { createContext, useState, useContext } from "react";
const ThemeContext = createContext();

const themes = {
	darkPurple: {
		backgroundColor: "#16161a",
		primary: "#7f2af0",
		secondary: "#72757e",
		textColor: "#fffffe",
		textColorSecondary: "#94a1b2",
		card: "#212127",
	},
	darkBrown: {
		backgroundColor: "#55423d",
		primary: "#ffc0ad",
		secondary: "#ffc0ad",
		textColor: "#fffffe",
		textColorSecondary: "#fff3ec",
		card: "#7e6651",
	},
	darkYellow: {
		backgroundColor: "#0f0e17",
		primary: "#ff8906",
		secondary: "#f25f4c",
		textColor: "#fffffe",
		textColorSecondary: "#a7a9be",
		card: "#302c3b",
	},

	lightPurple: {
		backgroundColor: "#fffffe",
		primary: "#6246ea",
		secondary: "#d1d1e9",
		textColor: "#2b2c34",
		textColorSecondary: "#2b2c34",
		card: "#f3f3f5",
	},
	lightBrown: {
		backgroundColor: "#fef6e4",
		primary: "#f582ae",
		secondary: "#8bd3dd",
		textColor: "#001858",
		textColorSecondary: "#172c66",
		card: "#fff3ec",
	},
	lightYellow: {
		backgroundColor: "#fffffe",
		primary: "#ffd803",
		secondary: "#e3f6f5",
		textColor: "#272343",
		textColorSecondary: "#2d334a",
		card: "#f3f3f3",
	},
};

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState("lightPurple");

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
