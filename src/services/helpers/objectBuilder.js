import { FieldValue } from "@react-native-firebase/firestore";
import uuid from "react-native-uuid";


export const buildExerciseObject = (selectedExercise, unitSystem) => {
	const exercise = {
		exerciseId: selectedExercise.id,
		name: selectedExercise.name,
		sets: [buildSetObject()],
		notes: null,
		exerciseType: selectedExercise.type,
		unitSystem: unitSystem,
	};

	return exercise;
};

export const buildSetObject = () => {
	const set = {
		weight: null,
		time: null,
		distance: null,
		reps: null,
		completed: false,
		setType: null,
	};
	return set;
};

export const buildMeasurementObject = (measurements, userId, unitSystem) => {
	const measurementData = {
		...measurements,
		// Convert all measurement values to integers
		age: parseInt(measurements.age, 10),
		weight: parseFloat(measurements.weight, 10),
		height: parseInt(measurements.height, 10),
		chest: parseFloat(measurements.chest, 10),
		abdomen: parseFloat(measurements.abdomen, 10),
		waist: parseFloat(measurements.waist, 10),
		hips: parseFloat(measurements.hips, 10),
		rightBicep: parseFloat(measurements.rightBicep, 10),
		leftBicep: parseFloat(measurements.leftBicep, 10),
		rightForearm: parseFloat(measurements.rightForearm, 10),
		leftForearm: parseFloat(measurements.leftForearm, 10),
		rightThigh: parseFloat(measurements.rightThigh, 10),
		leftThigh: parseFloat(measurements.leftThigh, 10),
		rightCalf: parseFloat(measurements.rightCalf, 10),
		leftCalf: parseFloat(measurements.leftCalf, 10),
		neck: parseFloat(measurements.neck, 10),
		shoulder: parseFloat(measurements.shoulder, 10),
		bodyFat: parseFloat(measurements.bodyFat, 10),
		userId: userId,
		measurementId: uuid.v4(),
		unitSystem: unitSystem,
		createdAt: FieldValue.serverTimestamp(),
	};

	if (isNaN(measurementData.bodyFat)) {
		measurementData.bodyFat = 0; // Set to 0 if body fat cannot be calculated
	}
	if (isNaN(measurementData.weight)) {
		measurementData.weight = 0; // Set to 0 if weight is not provided
	}
	if (isNaN(measurementData.height)) {
		measurementData.height = 0; // Set to 0 if height is not provided
	}
	if (isNaN(measurementData.age)) {
		measurementData.age = 0; // Set to 0 if age is not provided
	}
	if (isNaN(measurementData.chest)) {
		measurementData.chest = 0; // Set to 0 if chest measurement is not provided
	}
	if (isNaN(measurementData.waist)) {
		measurementData.waist = 0; // Set to 0 if waist measurement is not provided
	}
	if (isNaN(measurementData.hips)) {
		measurementData.hips = 0; // Set to 0 if hips measurement is not provided
	}
	if (isNaN(measurementData.neck)) {
		measurementData.neck = 0; // Set to 0 if neck measurement is not provided
	}
	if (isNaN(measurementData.shoulder)) {
		measurementData.shoulder = 0; // Set to 0 if shoulder measurement is not provided
	}
	if (isNaN(measurementData.rightBicep)) {
		measurementData.rightBicep = 0; // Set to 0 if right bicep measurement is not provided
	}
	if (isNaN(measurementData.leftBicep)) {
		measurementData.leftBicep = 0; // Set to 0 if left bicep measurement is not provided
	}
	if (isNaN(measurementData.rightForearm)) {
		measurementData.rightForearm = 0; // Set to 0 if right forearm measurement is not provided
	}
	if (isNaN(measurementData.leftForearm)) {
		measurementData.leftForearm = 0; // Set to 0 if left forearm measurement is not provided
	}
	if (isNaN(measurementData.rightThigh)) {
		measurementData.rightThigh = 0; // Set to 0 if right thigh measurement is not provided
	}
	if (isNaN(measurementData.leftThigh)) {
		measurementData.leftThigh = 0; // Set to 0 if left thigh measurement is not provided
	}
	if (isNaN(measurementData.rightCalf)) {
		measurementData.rightCalf = 0; // Set to 0 if right calf measurement is not provided
	}
	if (isNaN(measurementData.leftCalf)) {
		measurementData.leftCalf = 0; // Set to 0 if left calf measurement is not provided
	}
	if (isNaN(measurementData.abdomen)) {
		measurementData.abdomen = 0; // Set to 0 if abdomen measurement is not provided
	}

	console.log("Built measurement object:", measurementData);

	return measurementData;
};
