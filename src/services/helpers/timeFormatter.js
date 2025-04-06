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

export const formatDateObjectToTime = (dateObject) => {
	
	if (!dateObject) return "No time";

	// Ensure the dateObject is a valid Date instance
	if (dateObject instanceof Date) {
		const options = {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		};
		return dateObject.toLocaleTimeString(undefined, options);
	} else if (typeof dateObject === "number") {
		// Handle timestamp in milliseconds
		return new Date(dateObject).toLocaleTimeString(undefined, {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	}
	return "Invalid date";
}

// This function formats a time string in the format HH:MM:SS or MM:SS to a more readable format
// Example: 1h 30m
export const formatDurationTimeToText = (time) => {
	if (!time) return "0m";

	//change MM:SS to HH:MM:SS if needed for consistency in parsing
	let formattedTime = time;

	// Check if time is in MM:SS format (only has one colon)
	if (time.split(":").length === 2) {
		// Add 00 hours at the beginning
		formattedTime = "00:" + time;
	}

	const timeArray = formattedTime.split(":");
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

export const formatDuration = (seconds) => {
	// Format as MM:SS if less than 1 hour
	if (seconds < 3600) {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
	} else {
		// Format as HH:MM:SS if 1 hour or more
		const hrs = Math.floor(seconds / 3600);
		const mins = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return `${hrs.toString().padStart(2, "0")}:${mins
			.toString()
			.padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	}
}