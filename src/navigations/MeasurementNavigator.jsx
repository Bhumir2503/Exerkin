import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "../contexts/ThemeContext";
import Measurement from "../pages/Measure/Measurement";
import WorkoutModal from "../components/WorkoutPage/WorkoutModal";
import { CardStyleInterpolators } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function MeasurementNavigator() {
	const { themeStyle } = useTheme();

	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: {
					backgroundColor: themeStyle.backgroundColor,
					elevation: 0,
					shadowOpacity: 0,
				},
				headerTintColor: themeStyle.textColor,
				headerShown: false,
				gestureEnabled: true,
				// Slide in from bottom for modals on iOS and Android
				cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, // Use forModalPresentationIOS for iOS style modal slide
			}}
		>
			<Stack.Screen name="Measurements" component={Measurement} />
			<Stack.Screen name="WorkoutModal" component={WorkoutModal} />
		</Stack.Navigator>
	);
}
