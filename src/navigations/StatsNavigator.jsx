import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "../contexts/ThemeContext";
import StatsScreen from "../screens/Stats/StatsScreen";
import WorkoutModalScreen from "../screens/Workout/WorkoutModalScreen";
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
			<Stack.Screen name="StatsScreen" component={StatsScreen} />
			<Stack.Screen name="WorkoutModalScreen" component={WorkoutModalScreen} />
		</Stack.Navigator>
	);
}
