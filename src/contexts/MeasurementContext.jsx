import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";
import {
	listenToMeasurementChanges,
	saveMeasurementToFirestore,
} from "../services/firestore/firestoreMeasurementServices";
import firestore from "@react-native-firebase/firestore";

import { buildMeasurementObject } from "../services/helpers/objectBuilder";

const MeasurementContext = createContext();

export const MeasurementProvider = ({ children }) => {
	const { unitSystem, userId } = useUser();
	const [measurements, setMeasurements] = useState({
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
	const [measurementHistory, setMeasurementHistory] = useState([]);

	useEffect(() => {
		if (!userId) return;
		const unsubscribe = listenToMeasurementChanges(
			userId,
			setMeasurementHistory,
			setMeasurements
		);

		return () => {
			unsubscribe();
		};
	}, [userId]);

	const handleMeasurementChange = (field, value) => {
		setMeasurements((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleMeasurementSubmit = async () => {
		if (!userId) {
			console.error("User not authenticated");
			return;
		}
		const measurementData = buildMeasurementObject(
			measurements,
			userId,
			unitSystem
		);
		try {
			console.log("Saving measurement data:", measurementData);
			await saveMeasurementToFirestore(measurementData);
			setMeasurementHistory((prev) => [...prev, measurementData]);
			console.log("Measurement saved successfully");
		} catch (error) {
			console.error("Error saving measurement:", error);
		}
	};

	return (
		<MeasurementContext.Provider
			value={{
				measurements,
				setMeasurements,
				handleMeasurementChange,
				handleMeasurementSubmit,
			}}
		>
			{children}
		</MeasurementContext.Provider>
	);
};

export const useMeasurement = () => {
	return useContext(MeasurementContext);
};
export default MeasurementContext;
