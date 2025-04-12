export const setRealmTemplate = async (realm, template, syncStatus) => {
    try {
        realm.write(() => {
            realm.create(
                "Template",
                { ...template, syncStatus: syncStatus },
                "modified"
            );
        });
    } catch (error) {
        console.error(
            "(RealmTemplateFunctions) - Error setting template:",
            error
        );
    }
}