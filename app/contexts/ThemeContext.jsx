import React, { createContext, useState, useContext } from 'react';

// Create a context to hold theme information
const ThemeContext = createContext();

// Theme styles for different themes
const themes = {
    blue: {
        primary: '#5c95f0',
        secondary: "#bed5f9",
        backgroundColor: '#e5eefd',
        textColor: '#1b1b1b',
        textColorSecondary: '#6C6C6C',
        hidenEye: '#848482',
        error: '#ff3333',
    },
    orange: {
        primary: '#ee964b',
        secondary: "#f8d5b7",
        backgroundColor: '#fceee2',
        textColor: '#1b1b1b',
        textColorSecondary: '#6C6C6C',
        hidenEye: '#848482',
        error: '#ff3333',
    },
    purple: {
        primary: '#836FFF',
        secondary: "#cdc5ff",
        backgroundColor: '#ebe8ff',
        textColor: '#1b1b1b',
        textColorSecondary: '#6C6C6C',
        hidenEye: '#848482',
        error: '#ff3333',
    },
    red: {
        primary: '#da3e52',
        secondary: "#f0b2ba",
        backgroundColor: '#f9e0e3',
        textColor: '#1b1b1b',
        textColorSecondary: '#6C6C6C',
        hidenEye: '#848482',
        error: '#ff3333',
    },
    green: {
        primary: '#099a9a',
        secondary: "#9dd7d7",
        backgroundColor: '#d8efef',
        textColor: '#1b1b1b',
        textColorSecondary: '#6C6C6C',
        hidenEye: '#848482',
        error: '#ff3333',
    },
    darkblue:{
            primary: '#acc2f8',
            secondary: "#3f3f3f",
            backgroundColor: '#121212',
            textColor: '#f2f3f4',
            textColorSecondary: '#9b9fab',
            hidenEye: '#f2f3f4',
            error: '#ff3333',
    }
};

// Create a provider component
export const ThemeProvider = ({ children }) => {
   const [theme, setTheme] = useState('blue');

   const changeTheme = (newTheme) => {
      setTheme(newTheme);
   };

   return (
      <ThemeContext.Provider value={{ theme, changeTheme, themeStyles: themes[theme] }}>
         {children}
      </ThemeContext.Provider>
   );
};

// Custom hook to use the ThemeContext
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
