import { StripeProvider } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';
import MainTabNavigator from './components/TabNavigator';
import { ThemeProvider } from './contexts/ThemeContext'; 
import { CartProvider } from './contexts/CartContext'; 

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
