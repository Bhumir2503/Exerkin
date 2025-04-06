
export const getRealmUser = async (realm, userId) => {
    const user = realm.objects("User").filtered("uid == $0", userId)[0];
    return user;
}

export const setRealmUser = async (realm, userId, userData) => {
    realm.write(() => {
        realm.create("User", {
            uid: userId,
            ...userData,
        }, "modified");
    });
}

export const removeRealmUser = async (realm, userId) => {
    realm.write(() => {
        const user = realm.objects("User").filtered("uid == $0", userId)[0];
        if (user) {
            realm.delete(user);
        }
    });
}

