import { createContext, useContext } from "react";

const BlueprintMetaContext = createContext();


export const BlueprintMetaProvider = ({ children }) => {
    return (
        <BlueprintMetaContext.Provider value={{}}>
            {children}
        </BlueprintMetaContext.Provider>
    );
}

export const useBlueprintMeta = () => {
    const context = useContext(BlueprintMetaContext);
    if (!context) {
        throw new Error(
            "useBlueprintMeta must be used within a BlueprintMetaProvider"
        );
    }
    return context;
};