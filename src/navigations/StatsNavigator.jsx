import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "../contexts/ThemeContext";
import Stats from "../pages/Stats/Stats";
import WorkoutModal from "../components/WorkoutPage/WorkoutModal";
import { CardStyleInterpolators } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function StatsNavigator() {
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
			<Stack.Screen name="Stats" component={Stats} />
			<Stack.Screen name="WorkoutModal" component={WorkoutModal} />
		</Stack.Navigator>
	);
}
