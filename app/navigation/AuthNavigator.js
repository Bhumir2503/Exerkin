import { createStackNavigator } from '@react-navigation/stack';
import Onboarding from '../screens/authentication/onboard';
import Login from '../screens/authentication/login';
import Register from '../screens/authentication/register';
import ForgotPassword from '../screens/authentication/forgotPassword';
import AuthCode from '../screens/authentication/authCode';


const Stack = createStackNavigator();

export default AppNavigator = () => {
   return (
      <Stack.Navigator initialRouteName={'Landing'} screenOptions={{ headerShown: false }}>
         <Stack.Screen name="Onboarding" component={Onboarding} />
         <Stack.Screen name="Login" component={Login} />
         <Stack.Screen name="Register" component={Register} />
         <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
         <Stack.Screen name="AuthCode" component={AuthCode} />
      </Stack.Navigator>
   );
}