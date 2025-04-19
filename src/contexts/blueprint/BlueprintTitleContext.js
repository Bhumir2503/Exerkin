import { createContext, useContext } from "react";

const BlueprintTitleContext = createContext();


export const BlueprintTitleProvider = ({ children }) => {
    return (
        <BlueprintTitleContext.Provider value={{}}>
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