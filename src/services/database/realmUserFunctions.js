import Realm from "realm";
import { UserSchema } from "../schemas/userSchema";
import { getRealm } from "./realmConfig";

const realmConfig = {
    schema: [UserSchema],
    schemaVersion: 1,
}


export const getRealmUser = async (userId) => {
    const realm = await getRealm();
    const user = realm.objects("User").filtered("uid == $0", userId)[0];
    return user;
}

export const setRealmUser = async (userId, userData) => {
    const realm = await getRealm();
    realm.write(() => {
        realm.create("User", {
            uid: userId,
            ...userData,
        }, "modified");
    });
}

export const removeRealmUser = async (userId) => {
    const realm = await getRealm();
    realm.write(() => {
        const user = realm.objects("User").filtered("uid == $0", userId)[0];
        if (user) {
            realm.delete(user);
        }
    });
}

