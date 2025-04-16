import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "../contexts/ThemeContext";

import WorkoutScreen from "../screens/Workout/WorkoutScreen";
import WorkoutModalScreen from "../screens/Workout/WorkoutModalScreen";

// import TemplateModal from "../components/BlueprintPage/TemplateModal";
import { CardStyleInterpolators } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function WorkoutNavigator() {
	const { themeStyle } = useTheme();

	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: {
					backgroundColor: themeStyle.backgroundColor,
				},
				headerTintColor: themeStyle.textColor,
				headerShown: false,
				gestureEnabled: false,
				cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, // Use forModalPresentationIOS for iOS style modal slide
			}}
		>
			<Stack.Screen name="WorkoutScreen" component={WorkoutScreen} />
			<Stack.Screen
				name="WorkoutModalScreen"
				component={WorkoutModalScreen}
			/>
			{/* <Stack.Screen name="WorkoutModal" component={WorkoutModal} />
			<Stack.Screen name="TemplateModal" component={TemplateModal} /> */}
		</Stack.Navigator>
	);
}
