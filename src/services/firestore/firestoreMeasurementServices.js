import firestore from "@react-native-firebase/firestore";

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
		const userId = measurementData.userId;
		if (!userId) {
			throw new Error("User ID not provided or authenticated");
		}

		// Ensure measurementData has a unique measurementId
		await MeasurementsCollection.doc(measurementData.measurementId).set(
			measurementData
		);
	} catch (error) {
		throw new Error(`Failed to save measurement: ${error.message}`);
	}
};
