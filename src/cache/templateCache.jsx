import AsyncStorage from "@react-native-async-storage/async-storage";

const key = "workoutTempalte";
const key2 = "Sync"

export const getTemplateCache = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.log(e);
        return [];
    }
}

export const setTemplateCache = async (template) => {
    try {
        const jsonValue = JSON.stringify(template);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.log(e);
    }
}

export const resetTemplateCache = async () => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {
        console.log(e);
    }
}

export const addTemplateToCache = async (template, time) => {
    try {
        const templateCache = await getTemplateCache();
        // If the templateCache is empty, create a new one
        if (templateCache.length === 0) {
            await setTemplateCache({
                lastSynced: time,
                templates: [template],
            });
            return;
        }
        // If the templateCache is not empty, add the template to the existing cache
        templateCache.lastSynced = template.completedAt;
        templateCache.templates.push(template);
        await setTemplateCache(templateCache);
    } catch (e) {
        console.log(e);
    }
}

export const removeTemplateFromCache = async (templateId, deleteTime) => {
    try {
        const templateCache = await getTemplateCache();
        // If the templateCache is not empty, remove the template from the existing cache
        const updatedTemplateCache = templateCache.templates.filter(
            (template) => template.id !== templateId
        );
        const updatedCache = templateCache;
        updatedCache.lastSynced = deleteTime;
        updatedCache.templates = updatedTemplateCache;
        await setTemplateCache(updatedCache);
    } catch (e) {
        console.log(e);
    }
}

export const updateTemplateInCache = async (template) => {
    try {
        const templateCache = await getTemplateCache();
        const updatedTemplateCache = templateCache.templates.map((temp) => 
            temp.id === template.id ? template : temp
        );

        const updatedCache = templateCache;
        updatedCache.templates = updatedTemplateCache;
        updatedCache.lastSynced = template.updatedAt;
        await setTemplateCache(updatedCache);
    } catch (e) {
        console.log(e);
    }
}