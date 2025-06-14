import React, { useState, useRef, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Alert,
	Modal,
    Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";

import {GestureHandlerRootView} from "react-native-gesture-handler"

import {
	GestureDetector,
	Gesture,
} from 'react-native-gesture-handler';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
    runOnJS,
} from 'react-native-reanimated';

const DraggableBox = ({width, height, onPositionChange}) => {
	const offsetX = useSharedValue(0);
	const offsetY = useSharedValue(0);
	const startX = useSharedValue(0);
	const startY = useSharedValue(0);
    const boxSize = 6;


	const panGesture = Gesture.Pan()
		.onStart(() => {
			startX.value = offsetX.value;
			startY.value = offsetY.value;
		})
		.onUpdate((e) => {
            const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
			const newY = clamp(startY.value + e.translationY, 0, height - boxSize - height * 0.7);
            offsetY.value = newY;
            runOnJS(onPositionChange)(newY)
		});

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateX: offsetX.value },
			{ translateY: offsetY.value },
		],
	}));

	return (
        <>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[stylesa.box, animatedStyle]} />
            </GestureDetector>
        </>
	);
};

const stylesa = StyleSheet.create({
	box: {
		width: "100%",
		//backgroundColor: 'tomato',
        borderWidth: 4,
        borderStyle: "solid",
	},
});


function DynamicPersonIcon({topOffset, width, height}) {
    const personStyle = StyleSheet.create({
        personHead: {
            top: topOffset,
            position: "absolute",
            margin: "auto",
            left: width * 0.5 - ((width * 0.24) / 2),
            width: width * 0.24,
            backgroundColor: "lightgrey",
            height: width * 0.24,
            borderRadius: 100,
        },
        personBody: {
            top: topOffset + (width * 0.25 + 15),
            position: "absolute",
            margin: "auto",
            left: width * 0.5 - ((width * 0.35) / 2),
            width: width * 0.35,
            backgroundColor: "lightgrey",
            height: (height - topOffset) * 0.37,
            borderRadius: 15,
        },
        personLegs: {
            bottom: 0,
            position: "absolute",
            margin: "auto",
            left: width * 0.5 - ((width * 0.22) / 2),
            width: width * 0.22,
            backgroundColor: "lightgrey",
            height: (height - topOffset) * 0.37,
            borderRadius: 15,
        },
    });
    return (
        <View style={{height: "100%"}}>
            <View style={personStyle.personHead} />
            <View style={personStyle.personBody} />
            <View style={personStyle.personLegs} />
        </View>
    )
}



function HeightModal({setShowModal}) {
    const { themeStyle } = useTheme();
    const styles = createStyles(themeStyle);
    const { width, height } = Dimensions.get("window");
    const [topOffset, setTopOffset] = useState(10);

    function handleBarMovement(newY) {
        setTopOffset(10 + newY);
    }

    return (
        <Modal
            transparent={true}
            onRequestClose={() => {setShowModal(false)}}
        >
            <View style={styles.modalBody}>
                <View style={styles.navigationBar}>
                    <TouchableOpacity onPress={() => {setShowModal(false)}}>
                        <Text style={styles.navText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {setShowModal(false)}}>
                        <Text style={styles.navText}>Save</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.titleText}>How tall are you?</Text>
                <View style={styles.sizeBox}>
                    <GestureHandlerRootView>
                        <DraggableBox 
                            width={width * 0.9} 
                            height={height * 0.7} 
                            onPositionChange={handleBarMovement}
                        />
                        <View style={[styles.heightResult, {top: topOffset - 25}]}>
                            <Text style={styles.heightsResultText}>{parseInt(topOffset - 10)}</Text>
                        </View>
                        <DynamicPersonIcon 
                            topOffset={topOffset} 
                            width={width * 0.9} 
                            height={height * 0.7}
                        />
                    </GestureHandlerRootView>
                </View>
            </View>
        </Modal>
    );
}

const createStyles = (themeStyle) => {
    const { width, height } = Dimensions.get("window");
	return StyleSheet.create({
        modalBody: {
            backgroundColor: themeStyle.card,
            width: width,
            height: height,
            display: "flex",
            alignItems: "center"
        },
        navigationBar: {
            width: "100%",
            padding: 15,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
        },
        titleText: {
            color: themeStyle.textColor,
            fontSize: 24,
        },
        navText: {
            color: themeStyle.textColorSecondary,
            fontWeight: "bold",
            fontSize: 20,
        },
        sizeBox: {
            width: "90%",
            height: "60%",
            marginTop: "20%",
            
        },
        personHead: {
            position: "absolute",
            margin: "auto",
            left: width * 0.5 - ((width * 0.25) / 2),
            width: width * 0.25,
            backgroundColor: "red",
            height: width * 0.25,
            borderRadius: 100,
        },        
        heightResult: {
            position: "absolute",
            right: 0,
            backgroundColor: themeStyle.backgroundColor,
            padding: 10,
            paddingHorizontal: 30,
        },
        heightsResultText: {
            color: themeStyle.textColor,
            fontSize: 19,
        }
    });
}

export default HeightModal;