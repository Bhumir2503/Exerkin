/*
 * Function to save measurement data to Realm database
 * @param {Realm} realm - The Realm instance
 * @param {Object} measurementData - The measurement data to be saved
 * @returns {Promise<void>} - A promise that resolves when the measurement is saved
 */
export const saveMeasurementToRealm = async (realm, measurementData) => {
	try {
		realm.write(() => {
			realm.create("Measurements", {
				...measurementData,
				createdAt: new Date(), // Assuming you want to add a timestamp
			});
			console.log("Measurement saved to Realm");
		});
	} catch (error) {
		throw new Error(`Failed to save measurement: ${error.message}`);
	}
};
