import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

// Collection references
const usersCollection = firestore().collection("users");
const usernamesCollection = firestore().collection("usernames");

export const checkUserSetup = async (user) => {

    if (!user) {
        return false;
    }

    try {
        const userDoc = await usersCollection.doc(user.uid).get();
        return [userDoc.exists, userDoc.data()];
    }
    catch (error) {
        console.error(error);
        return [false, "error"];
    }
}

export const checkUsernameAvailability = async (username) => {

}


