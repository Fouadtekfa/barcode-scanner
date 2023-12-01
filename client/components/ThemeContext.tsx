import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const ThemeContext = createContext({
  theme: 'light',
  setTheme: (theme: string) => {}
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const changeTheme = async (newTheme: string) => {
    setTheme(newTheme);
    await SecureStore.setItemAsync('mode', newTheme);
  };

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await SecureStore.getItemAsync('mode');
      if (storedTheme) {
        setTheme(storedTheme);
      }
    };
    loadTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
