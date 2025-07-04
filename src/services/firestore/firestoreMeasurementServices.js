import firestore from "@react-native-firebase/firestore";

// Collection references
const MeasurementsCollection = firestore().collection("measurements");

export const listenToMeasurementChanges = (
	userId,
	setMeasurementHistory,
	setMeasurements
) => {
	const unsubscribe = MeasurementsCollection.where("userId", "==", userId)
		.orderBy("createdAt", "desc")
		.onSnapshot(
			(snapshot) => {
				if (!snapshot || snapshot.empty) {
					console.log(
						"(FirestoreMeasurementServices) - No measurements found for user:",
						userId
					);
					setMeasurementHistory([]);
					setMeasurements({
						age: "",
						weight: "",
						height: "",
						chest: "",
						abdomen: "",
						waist: "",
						hips: "",
						rightBicep: "",
						leftBicep: "",
						rightForearm: "",
						leftForearm: "",
						rightThigh: "",
						leftThigh: "",
						rightCalf: "",
						leftCalf: "",
						neck: "",
						shoulder: "",
						bodyFat: "",
					});
					return;
				}
				console.log(
					"(FirestoreMeasurementServices) - Measurements fetched for user:",
					userId,
					"- Count:",
					snapshot.docs.length
				);

				const newMeasurements = snapshot.docs.map((doc) => ({
					...doc.data(),
				}));
				setMeasurementHistory(newMeasurements);
				setMeasurements(newMeasurements[0]);
			},
			(error) => {
				console.error("Error fetching measurements:", error);
			}
		);

	return unsubscribe;
};

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
