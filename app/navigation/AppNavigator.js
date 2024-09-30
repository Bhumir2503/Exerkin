import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Account from '../screens/application/Account/account';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for icons
import { useTheme } from '../contexts/ThemeContext';


const Tab = createBottomTabNavigator();

export default AppNavigator = () => {
   const { themeStyles } = useTheme();

   return (
      <Tab.Navigator
         initialRouteName='Me'
         screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
               let iconName;

               if (route.name === 'Me') {
                  iconName = focused ? 'person' : 'person-outline';
               }
               return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarStyle: {
               backgroundColor: themeStyles.backgroundColor,
               borderTopWidth: 0,
               shadowOpacity: 0,
               elevation: 0,
               paddingBottom: 10, // Add padding at the bottom

            },
            tabBarActiveTintColor: themeStyles.primary,
            tabBarInactiveTintColor: themeStyles.textColorSecondary,
            tabBarHideOnKeyboard: true,
         })}
      >
         <Tab.Screen name="Me" component={Account} />
      </Tab.Navigator>
   );
}