import { createContext, useContext } from "react";

const BlueprintExercisesContext = createContext();


export const BlueprintExercisesProvider = ({ children }) => {
    return (
        <BlueprintExercisesContext.Provider value={{}}>
            {children}
        </BlueprintExercisesContext.Provider>
    );
}

export const useBlueprintExercises = () => {
    const context = useContext(BlueprintExercisesContext);
    if (!context) {
        throw new Error(
            "useBlueprintExercises must be used within a BlueprintExercisesProvider"
        );
    }
    return context;
};