/*
 * This component handles the components and modal allowing the user to select an exercise to add to
 * their workout. The user can choose between a predefined exercise or create their own.
*/
import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import { useTheme } from "../../../../../contexts/ThemeContext";


/**
 * 
 * @param {list} values list of possible selection values. values are of form {id: "...", name: "..."}
 * @param {bool} wrap true if values should flex-wrap, scroll view otherwise
 * @param {bool} all true if there should be an all button, false otherwise
 * @param {bool} multiple true if multiple items can be selected, false otherwise
 * @param {list} selected list of the selected items
 * @param {function} setSelected callback to alter the selected values 
 * @returns 
 */
function SelectionChips({values, wrap=false, all=true, multiple=false, selectedRef, selectedHook, setSelectedHook}) {
    let update = !(selectedHook === undefined);
    
    const { themeStyle } = useTheme();
    const styles = createStyles(themeStyle);

    const [internalSelected, setInternelSelected] = useState([]);

    const selected = () => {
        if (update) {
            return selectedHook;
        } else {
            return internalSelected;
        }
    };

    const setSelected = (value) => {
        if (update) {
            setSelectedHook(value);
        } else {
            if (selectedRef !== undefined) {
                selectedRef.current = value;
            }
            setInternelSelected(value);
        }
    };


    // generates a button that acts 
    const AllButton = () => {
        return (
            <TouchableOpacity
                style={[
                    styles.valueChip,
                    selected().length === 0 && styles.selectedValueChip,
                ]}
                onPress={() => setSelected([])}
            >
                <Text
                    style={[
                        styles.valueText,
                        selected().length === 0 && styles.selectedValueText,
                    ]}
                >
                    All
                </Text>
            </TouchableOpacity>
        )
    };

    const updateSelected = (valueID) => {
        if (multiple === true && selected().includes(valueID)) {
            setSelected(selected().filter((id) => id != valueID));
        } else if (multiple === true) {
            setSelected([...selected(), valueID]);
        } else if (multiple === false && selected().includes(valueID)) {
            setSelected([]);
        } else {
            setSelected([valueID]);
        }
    };

    // generates all of the chips that go into the container
    const ChipContent = () => {
        return (
            <>
            {/* display the all option if set */}
            {all && <AllButton />}

            {values.map((value) => (
                <TouchableOpacity
                    key={value.id}
                    style={[
                        styles.valueChip,
                        selected().includes(value.id) &&
                            styles.selectedValueChip,
                    ]}
                    onPress={() => updateSelected(value.id)}
                >
                    <Text
                        key={value.id}
                        style={[
                            selected().includes(value.id)
                                ? styles.selectedValueText
                                : styles.valueText,
                        ]}
                    >
                        {value.name}
                    </Text>
                </TouchableOpacity>
            ))}
            </>
        )
    };

    const ScrollContainer = () => {
        return (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.valueScrollContainer}
                contentContainerStyle={styles.valueContentContainer}
            >
                <ChipContent />
            </ScrollView>
        );
    };

    const WrapContainer = () => {
        return (
            <View style={styles.valueWrapContainer}>
                <ChipContent />
            </View>
        )
    };

    return (
        <>
            {wrap ? <WrapContainer /> : <ScrollContainer />}
        </>
    );
}


const createStyles = (themeStyle) =>
    StyleSheet.create({
		valueScrollContainer: {
			marginBottom: 12,
			flexGrow: 0,
		},
        valueWrapContainer: {
            width: "100%",
            flexDirection: "row",
            marginBottom: 12,
            display: "flex",
            flexWrap: "wrap",
        },
		valueContentContainer: {
			paddingHorizontal: 4,
		},
		valueChip: {
			backgroundColor: themeStyle.card,
			paddingHorizontal: 12,
			paddingVertical: 6,
			borderRadius: 10,
			marginRight: 8,
            marginBottom: 10,
		},
		selectedValueChip: {
			backgroundColor: themeStyle.primary,
		},
		valueText: {
			color: themeStyle.textColor,
			fontWeight: "500",
		},
		selectedValueText: {
			color: "white",
            fontWeight: "500",
		},
    });

export default SelectionChips;