import { createContext, useContext, useState } from "react";

const BlueprintNotesContext = createContext();


export const BlueprintNotesProvider = ({ children }) => {
    const [blueprintNotes, setBlueprintNotes] = useState("");

    return (
        <BlueprintNotesContext.Provider value={{ blueprintNotes, setBlueprintNotes }}>
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