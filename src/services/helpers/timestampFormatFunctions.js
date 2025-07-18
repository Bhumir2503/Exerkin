/*
 * This function formats a timestamp to a date string.
 * Example: 12/31/2023
 *
 * @param {Object|number} timestamp - The timestamp to be formatted, can be a Firestore Timestamp object or a Date object.
 * @return {string} - The formatted date string.
 */
export const formatTimeStamptoDateString = (timestamp) => {
	if (!timestamp) return "No date";

	const options = {
		year: "numeric",
		month: "numeric",
		day: "numeric",
	};

	if (timestamp.seconds) {
		return new Date(timestamp.seconds * 1000).toLocaleDateString(
			undefined,
			options
		);
	}
	return new Date(timestamp).toLocaleDateString(undefined, options);
};

/*
 * This function formats a timestamp to a short date string.
 * Example: Jan 1, 2023
 *
 * @param {Object|number} timestamp - The timestamp to be formatted, can be a Firestore Timestamp object or a Date object.
 * @return {string} - The formatted short date string.
 */
export const formatTimestampToShortDate = (timestamp) => {
	if (!timestamp) return "No date";

	const options = {
		year: "numeric",
		month: "short",
		day: "numeric",
	};

	if (timestamp.seconds) {
		return new Date(timestamp.seconds * 1000).toLocaleString(
			undefined,
			options
		);
	}
	return new Date(timestamp).toLocaleString(undefined, options);
};

/*
 * This function formats a timestamp to a time string.
 * Example: 12:00 PM
 *
 * @param {Object|number} timestamp - The timestamp to be formatted, can be a Firestore Timestamp object or a Date object.
 * @return {string} - The formatted time string.
 */
export const formatTimeStamptoTimeString = (timestamp) => {
	if (!timestamp) return "No time";

	const options = {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	};

	if (timestamp.seconds) {
		return new Date(timestamp.seconds * 1000).toLocaleTimeString(
			undefined,
			options
		);
	}
	return new Date(timestamp).toLocaleTimeString(undefined, options);
};
