import firestore from "@react-native-firebase/firestore";

const blueprintCollection = firestore().collection("blueprints");
import { getLastBlueprintSyncTime, updateLastBlueprintSyncTime, mergeBlueprintsToRealm } from "../database/realmBlueprintFunction";

export const listenToBlueprintChanges = (realm, userId, onUpdate) => {
    const lastSynced = getLastBlueprintSyncTime(realm);

    const unsubscribe = blueprintCollection
        .where("userId", "==", userId)
        .where("updatedAt", ">", lastSynced)
        .where("deletedAt", "==", null)
        .onSnapshot(
            (snapshot) => {
                if (!snapshot || snapshot.empty) {
                    onUpdate();
                    return;
                }

                const newBlueprints = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                }));

                realm.write(() => {
                    mergeBlueprintsToRealm(realm, newBlueprints);
                    updateLastBlueprintSyncTime(realm);
                });

                onUpdate();
            },
            (error) => {
                console.error("Error fetching blueprints:", error);
            }
        );
    return unsubscribe;
}

export const listenToDeletedBlueprintChanges = (realm, userId, onUpdate) => {
    const lastSynced = getLastBlueprintSyncTime(realm);
    const effectiveLastSynced =
        lastSynced.getTime() === new Date(0).getTime()
            ? new Date()
            : lastSynced;

    const unsubscribe = blueprintCollection
        .where("userId", "==", userId)
        .where("deletedAt", ">", effectiveLastSynced)
        .onSnapshot(
            (snapshot) => {
                if (!snapshot || snapshot.empty) {
                    onUpdate();
                    return;
                }

                const deletedBlueprints = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                }));

                realm.write(() => {
                    deletedBlueprints.forEach((blueprint) => {
                        realm.delete(
                            realm
                                .objects("Blueprint")
                                .filtered("blueprintId == $0", blueprint.blueprintId)[0]
                        );
                    });
                });

                onUpdate();
            },
            (error) => {
                console.error("Error fetching deleted blueprints:", error);
            }
        );
    return unsubscribe;
};
