import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext({
    cartItems: [],
    setCartItems: (items) => {}
});

export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    return (
        <CartContext.Provider value={{ cartItems, setCartItems }}>
            {children}
        </CartContext.Provider>
    );
};
