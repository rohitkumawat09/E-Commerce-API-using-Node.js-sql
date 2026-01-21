import { createContext, useEffect, useState, useContext } from "react";
import { instance } from "../axiosConfig";
import { AuthContext } from "./AuthContext";

export const EcomContext = createContext();

function UserContext({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);


const fetchOrders = async () => {
  try {
    const res = await instance.get("/orders/my-orders", {
      withCredentials: true,
    });
    setOrders(res.data.orders || res.data);
  } catch (error) {
    console.error("Failed to fetch orders", error);
  }
};

useEffect(() => {
  if (user) {
    fetchOrders();
    fetchCart();
    fetchWishlist();
  }
}, [user]);


  //  console.log(user)

  const fetchCart = async () => {
    try {
      const res = await instance.get("/product/cart/data", {
        withCredentials: true,
      });

      const formatted = res.data.cart
        .filter((item) => item.product)
        .map((item) => ({
          ...item.product,
          quantity: item.quantity,
          id: item.product.id,
        }))
        .reduce((acc, curr) => {
          const existing = acc.find((item) => item.id === curr.id);
          if (existing) {
            existing.quantity += curr.quantity;
          } else {
            acc.push(curr);
          }
          return acc;
        }, []);

      setCart(formatted);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await instance.get("/product/wishlist/data", {
        withCredentials: true,
      });

      const formatted = res.data.wishlist
        .filter((item) => item.product)
        .map((item) => ({
          ...item.product,
          id: item.product.id,
        }));

      setWishlist(formatted);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      alert("Please login to add to cart");
      return;
    }
    try {
      await instance.post(
        `/product/cart/${product.id}`,
        { quantity: 1 },
        { withCredentials: true }
      );
      fetchCart();
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const handleAddToWishlist = async (product) => {
    if (!user) {
      alert("Please login to add to wishlist");
      return;
    }
    try {
      await instance.post(
        `/product/wishlist/${product.id}`,
        {},
        { withCredentials: true }
      );
      fetchWishlist();
    } catch (err) {
      console.error("Error adding to wishlist:", err);
    }
  };

  const updateQuantityInCart = async (productId, newQuantity) => {
    try {
      await instance.post(
        `/product/cart/${productId}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  const increaseQuantity = async (id) => {
    const product = cart.find((item) => item.id === id);
    if (!product || product.quantity >= 10) return;
    await updateQuantityInCart(id, product.quantity + 1);
  };

  const decreaseQuantity = async (id) => {
    const product = cart.find((item) => item.id === id);
    if (!product || product.quantity <= 1) return;
    await updateQuantityInCart(id, product.quantity - 1);
  };

  const updateCartQuantityAfterOrder = (productId, orderedQuantity) => {
    setCart((prevCart) => {
      return prevCart.reduce((acc, item) => {
        if (item.id === productId) {
          const newQuantity = item.quantity - orderedQuantity;
          if (newQuantity > 0) {
            acc.push({ ...item, quantity: newQuantity });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, []);
    });
  };

  const handleRemoveFromCart = async (id) => {
    try {
      await instance.delete(`/product/cart/${id}`, {
        withCredentials: true,
      });
      fetchCart();
    } catch (err) {
      console.error("Error removing item from cart:", err);
    }
  };

  return (
    <EcomContext.Provider
      value={{
        cart,
        setCart,
        handleAddToCart,
        handleRemoveFromCart,
        increaseQuantity,
        decreaseQuantity,
        fetchCart,
        wishlist,
        setWishlist,
        handleAddToWishlist,
        fetchWishlist,
        orders,
        setOrders,
        updateCartQuantityAfterOrder,
        updateQuantityInCart,
        fetchOrders,
      }}
    >
      {children}
    </EcomContext.Provider>
  );
}

export default UserContext;
