import { createContext, useContext, useState, useRef } from "react";

const BlueprintMetaContext = createContext();


export const BlueprintMetaProvider = ({ children }) => {
    const blueprintIdRef = useRef(null);
    const templateCreatedAtRef = useRef(null); 
    const [unitSystem, setUnitSystem] = useState("imperial");

    const resetBlueprintMeta = () => {
        blueprintIdRef.current = null;
        templateCreatedAtRef.current = null;
        setUnitSystem("imperial");
    }

    return (
        <BlueprintMetaContext.Provider value={{
            blueprintIdRef,
            templateCreatedAtRef,
            unitSystem,
            setUnitSystem,
            resetBlueprintMeta,
        }}>
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