import React, { createContext, useReducer, useCallback, useContext, useEffect } from 'react';
import { getCartApi, getProductsApi } from '../util/api';
import { AuthContext } from '../components/context/auth.context';

export const CartContext = createContext();

const initialState = {
  items: [],
  selectedItems: [],
  total: 0,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART': {
      return {
        ...state,
        items: action.payload.items || [],
        selectedItems: action.payload.selectedItems || [],
      };
    }

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
  const { auth } = useContext(AuthContext);

  // Khi user đã đăng nhập, load giỏ hàng từ backend để tránh mất khi reload
  useEffect(() => {
    const syncCartFromBackend = async () => {
      if (!auth?.user?.email) return;

      try {
        const res = await getCartApi(auth.user.email);
        const response = res?.data?.getCart || res?.getCart;
        if (!response || !response.success || !response.data) return;

        const serverCart = response.data;

        // Lấy danh sách sản phẩm để map tên, mô tả, ảnh đúng với product
        let productMap = {};
        try {
          const productsRes = await getProductsApi(1, 1000);
          if (productsRes && productsRes.EC === 0 && Array.isArray(productsRes.data)) {
            productMap = productsRes.data.reduce((acc, p) => {
              acc[p._id] = p;
              return acc;
            }, {});
          }
        } catch (e) {
          // nếu lỗi thì vẫn tiếp tục, chỉ mất phần tên đẹp
        }

        // Map data từ backend sang format frontend đang dùng
        const items = (serverCart.items || []).map((item) => ({
          id: item.id, // id của CartItem
          productId: item.productId,
          name: productMap[item.productId]?.title || `Sản phẩm ${item.productId?.slice(-6) || ''}`,
          description: productMap[item.productId]?.description || '',
          image: productMap[item.productId]?.image || '',
          price: item.price,
          quantity: item.quantity,
        }));

        dispatch({
          type: 'SET_CART',
          payload: {
            items,
            selectedItems: serverCart.selectedItems || [],
          },
        });
      } catch (err) {
        console.error('Failed to load cart from backend', err);
      }
    };

    syncCartFromBackend();
  }, [auth?.user?.email]);

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
