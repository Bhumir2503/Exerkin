import { createContext, useState, useContext } from "react";
const ThemeContext = createContext();

const themes = {
	dark: {
		backgroundColor: "#16161a",
		primary: "#7f2af0",
		secondary: "#72757e",
		textColor: "#fffffe",
		textColorSecondary: "#94a1b2",
	},
	light: {
		backgroundColor: "#fff",
		color: "#000",
	},
};

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState("dark");

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