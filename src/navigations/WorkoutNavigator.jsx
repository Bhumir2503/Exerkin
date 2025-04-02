import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "../contexts/ThemeContext";
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Profile/Settings";
import Stats from "../pages/Stats/Stats";

import Workout from "../pages/Workout/Workout";
import WorkoutModal from "../components/WorkoutPage/WorkoutModal";
import { CardStyleInterpolators } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function WorkoutNavigator() {
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
                cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS, // Use forModalPresentationIOS for iOS style modal slide
            }}
        >

            <Stack.Screen name="Workout" component={Workout} />
            <Stack.Screen name="WorkoutModal" component={WorkoutModal}/>
            
        </Stack.Navigator>
    );
}
