import React, { createContext, useReducer, useCallback } from 'react';

export const CartContext = createContext();

const initialState = {
  items: [],
  selectedItems: [],
  total: 0,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }],
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        selectedItems: state.selectedItems.filter(id => id !== action.payload),
      };

    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        ),
      };

    case 'CLEAR_CART':
      return { ...initialState };

    case 'SELECT_ITEM': {
      const isSelected = state.selectedItems.includes(action.payload);
      return {
        ...state,
        selectedItems: isSelected
          ? state.selectedItems.filter(id => id !== action.payload)
          : [...state.selectedItems, action.payload],
      };
    }

    case 'SELECT_ALL':
      return {
        ...state,
        selectedItems: action.payload ? state.items.map(item => item.id) : [],
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = useCallback((product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  }, []);

  const removeItem = useCallback((itemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  }, []);

  const updateItem = useCallback((itemId, quantity) => {
    dispatch({ type: 'UPDATE_ITEM', payload: { id: itemId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const selectItem = useCallback((itemId) => {
    dispatch({ type: 'SELECT_ITEM', payload: itemId });
  }, []);

  const selectAll = useCallback((selectAll) => {
    dispatch({ type: 'SELECT_ALL', payload: selectAll });
  }, []);

  const getTotal = useCallback(() => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [state.items]);

  const getSelectedItems = useCallback(() => {
    return state.items.filter(item => state.selectedItems.includes(item.id));
  }, [state.items, state.selectedItems]);

  const getSelectedTotal = useCallback(() => {
    return getSelectedItems().reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [getSelectedItems]);

  const value = {
    cart: state.items,
    selectedItems: state.selectedItems,
    addItem,
    removeItem,
    updateItem,
    clearCart,
    selectItem,
    selectAll,
    getTotal,
    getSelectedItems,
    getSelectedTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

