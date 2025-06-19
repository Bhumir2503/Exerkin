/*
 * This module provides functions to calculate body fat percentage based on user measurements.
 * It supports both metric and imperial units, and handles different
 *
 * @param {Object} measurements - An object containing user measurements.
 * @returns {number} - The calculated body fat percentage.
 */
export const calculateBodyFat = (measurements, isFemale, unitSystem) => {
	let { height, neck, waist, hips } = measurements;

	//convert from string to number
	height = parseFloat(height);
	neck = parseFloat(neck);
	waist = parseFloat(waist);
	hips = hips ? parseFloat(hips) : undefined;

	// Convert from metric to inches if needed
	if (unitSystem === "Metric") {
		height *= 0.393701;
		neck *= 0.393701;
		waist *= 0.393701;
		hips = hips ? hips * 0.393701 : undefined;
	}

	let bodyFatPercentage;

	if (isFemale) {
		// Female formula
		bodyFatPercentage =
			163.205 * Math.log10(waist + hips - neck) -
			97.684 * Math.log10(height) -
			78.387;
	} else {
		// Male formula
		bodyFatPercentage =
			86.01 * Math.log10(waist - neck) -
			70.041 * Math.log10(height) +
			36.76;
	}

	return bodyFatPercentage;
};
