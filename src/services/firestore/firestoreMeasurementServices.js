import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

// Collection references
const MeasurementsCollection = firestore().collection("measurements");

/*
 * Function to save measurement data to Firestore
 * @param {Object} measurementData - The measurement data to be saved
 * @returns {Promise<void>} - A promise that resolves when the measurement is saved
 */
export const saveMeasurementToFirestore = async (measurementData) => {
	try {
        // Ensure measurementData contains the necessary fields
		const userId = measurementData.userId || auth().currentUser?.uid;
		if (!userId) {
			throw new Error("User ID not provided or authenticated");
		}

        // Ensure measurementData has a unique measurementId
		const measurementDocRef = MeasurementsCollection.doc(
			measurementData.measurementId
		);

        // Prepare the measurement data with userId and createdAt timestamp
		await measurementDocRef.set({
			...measurementData,
			createdAt: firestore.FieldValue.serverTimestamp(),
		});

		console.log(
			"Measurement saved successfully:",
			measurementData.measurementId
		);
	} catch (error) {
		throw new Error(`Failed to save measurement: ${error.message}`);
	}
};
