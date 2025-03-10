// Function to format a timestamp to a date string
// Example: 3/1/2025
export const formatTimeStamptoDateString = (timestamp) => {
	if (!timestamp) return "No date";
	if (timestamp.seconds) {
		return new Date(timestamp.seconds * 1000).toLocaleDateString();
	}
	return new Date(timestamp).toLocaleDateString();
};

// Function to format a timestamp to a time string
// Example: 12:00 PM
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

// Function to format a string time to display in seconds or mins or hours
// Example: 1h 30m
export const formatTimeToText = (time) => {
	if (!time) return "0m";
	const timeArray = time.split(":");
	const hours = parseInt(timeArray[0]);
	const mins = parseInt(timeArray[1]);
	const secs = parseInt(timeArray[2]);

	if (hours > 0) {
		return `${hours}h ${mins}m`;
	} else if (mins > 10) {
		return `${mins}m`;
	} else if (mins > 0) {
		return `${mins}m ${secs}s`;
	} else {
		return `${secs}s`;
	}
};
