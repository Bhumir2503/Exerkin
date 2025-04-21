import { createContext, useContext, useState } from "react";

const BlueprintTitleContext = createContext();


export const BlueprintTitleProvider = ({ children }) => {
    const [blueprintTitle, setBlueprintTitle] = useState("");
    return (
        <BlueprintTitleContext.Provider value={{
            blueprintTitle,
            setBlueprintTitle,
        }}>
            {children}
        </BlueprintTitleContext.Provider>
    );
}

export const useBlueprintTitle = () => {
    const context = useContext(BlueprintTitleContext);
    if (!context) {
        throw new Error(
            "useBlueprintTitle must be used within a BlueprintTitleProvider"
        );
    }
    return context;
};