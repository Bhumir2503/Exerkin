import { BlueprintExercisesProvider } from "./BlueprintExercisesContext";
import { BlueprintMetaProvider } from "./BlueprintMetaContext";
import { BlueprintNotesProvider } from "./BlueprintNotesContext";
import { BlueprintStorageProvider } from "./BlueprintStorageContext";
import { BlueprintTitleProvider } from "./BlueprintTitleContext";

const BlueprintProvider = ({ children }) => {
    return (
        <BlueprintStorageProvider>
            <BlueprintTitleProvider>
                <BlueprintMetaProvider>
                    <BlueprintNotesProvider>
                        <BlueprintExercisesProvider>
                            {children}
                        </BlueprintExercisesProvider>
                    </BlueprintNotesProvider>
                </BlueprintMetaProvider>
            </BlueprintTitleProvider>
        </BlueprintStorageProvider>
    );
}

export default BlueprintProvider;