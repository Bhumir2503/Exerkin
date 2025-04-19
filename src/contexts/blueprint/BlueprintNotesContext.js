import { createContext, useContext } from "react";

const BlueprintNotesContext = createContext();


export const BlueprintNotesProvider = ({ children }) => {
    return (
        <BlueprintNotesContext.Provider value={{}}>
            {children}
        </BlueprintNotesContext.Provider>
    );
}

export const useBlueprintNotes = () => {
    const context = useContext(BlueprintNotesContext);
    if (!context) {
        throw new Error(
            "useBlueprintNotes must be used within a BlueprintNotesProvider"
        );
    }
    return context;
};