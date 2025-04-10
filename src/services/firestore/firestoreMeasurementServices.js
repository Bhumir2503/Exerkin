import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

// Collection references
const MeasurementsCollection = firestore().collection("measurements");

// Function to add a new measurement
export const addMeasurement = async (measurementData) => {
    try {
        await MeasurementsCollection.doc(measurementData.measurementId).set({measurementData,
            createdAt: firestore.Timestamp.now(),
            updatedAt: firestore.Timestamp.now(),
        });
    } catch (error) {
        console.error("Error adding measurement: ", error);
        throw error;
    }
};