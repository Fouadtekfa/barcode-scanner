import { StripeProvider } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';
import CheckoutScreen from './CheckoutScreen';
import MainTabNavigator from './components/TabNavigator';
import { ThemeProvider } from './components/ThemeContext'; 
import { CartProvider } from './components/CartContext'; 

export default function App() {
  const stripePK = Constants.expoConfig.extra.stripePK;
  
  return(
    <CartProvider>
    <ThemeProvider> 
    <StripeProvider
    publishableKey={stripePK}
    merchantIdentifier="merchant.com.example"
  >
   
     <MainTabNavigator />
     </StripeProvider>

     </ThemeProvider>
     </CartProvider>
     );
}
