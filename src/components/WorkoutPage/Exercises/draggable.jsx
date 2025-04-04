import React, { useState } from "react";
import { Text, View } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";

const MyDraggableList = () => {
	const [data, setData] = useState(
		Array.from({ length: 10 }, (_, i) => ({
			key: `item-${i}`,
			label: `Item ${i}`,
		}))
	);

	const renderItem = ({ item, drag, isActive }) => (
		<View
			style={{
				height: 60,
				backgroundColor: isActive ? "#ccc" : "#fff",
				justifyContent: "center",
				alignItems: "center",
				borderBottomWidth: 1,
			}}
			onLongPress={drag}
		>
			<Text>{item.label}</Text>
		</View>
	);

	return (
		<DraggableFlatList
			data={data}
			renderItem={renderItem}
			keyExtractor={(item) => item.key}
			onDragEnd={({ data }) => setData(data)}
		/>
	);
};

export default MyDraggableList;
