import React, { createContext, useContext, useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";

const NetworkContext = createContext();

let subscriptionCount = 0;

export const NetworkProvider = ({ children }) => {
	const [isConnected, setIsConnected] = useState(true);
	const [connectionType, setConnectionType] = useState(null);
	const [isInternetReachable, setIsInternetReachable] = useState(true);
	const [details, setDetails] = useState(null);

	useEffect(() => {
		// Increment the subscription count
		subscriptionCount++;
		console.log(`Subscribers: ${subscriptionCount}`);

		// Subscribe to network state updates
		const unsubscribe = NetInfo.addEventListener((state) => {
			console.log("(NetworkContext) - Connected: ", state.isConnected);
			setIsConnected(state.isConnected);
			setConnectionType(state.type);
			setIsInternetReachable(state.isInternetReachable);
			setDetails(state.details);
		});

		// Initial check
		checkNetworkStatus();

		// Cleanup subscription on unmount
		return () => {
			// Decrement the subscription count
			subscriptionCount--;
			console.log(`Subscribers after cleanup: ${subscriptionCount}`);
			unsubscribe();
		};
	}, []);


	const checkNetworkStatus = async () => {
		try {
			const state = await NetInfo.fetch();
			setIsConnected(state.isConnected);
			setConnectionType(state.type);
			setIsInternetReachable(state.isInternetReachable);
			setDetails(state.details);
		} catch (error) {
			console.error("Failed to fetch network status:", error);
		}
	};

	// Method to manually refresh network status
	const refreshNetworkStatus = () => {
		return checkNetworkStatus();
	};

	return (
		<NetworkContext.Provider
			value={{
				isConnected,
				connectionType,
				isInternetReachable,
				details,
				refreshNetworkStatus,
			}}
		>
			{children}
		</NetworkContext.Provider>
	);
};

export const useNetwork = () => useContext(NetworkContext);