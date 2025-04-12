import { uploadTemplate } from "../firestore/firestoreTemplateServices";
import { setRealmTemplate } from "../database/realmTemplateFunctions";

export const getTemplates = async (realm) => {
    try {
        const templates = realm.objects("Template");
        return templates;
    } catch (error) {
        console.error("Error getting templates:", error);
        return [];
    }
}

export const addTemplate = async (realm, template) => {
    try{
        await uploadTemplate(template);
        await setRealmTemplate(realm, template, "synced");
    }catch(e){
        console.error("Error adding template:", e);
        template.syncStatus = "pending";
        await setRealmTemplate(realm, template, "pending");
    }
}