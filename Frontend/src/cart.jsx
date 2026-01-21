

import React, { useContext } from "react";
import { EcomContext } from "./UseContext";

function Cart() {
  const {
    cart,
    handleRemoveFromCart,
    increaseQuantity,
    decreaseQuantity,
    orders,
  } = useContext(EcomContext);

  const totalAmount = cart.reduce(
    (acc, item) =>
      acc + (item.discountedPrice || 0) * (item.quantity || 0),
    0
  );

   // Function to check if product is ordered
  const isProductOrdered = (productId) => {
    return orders.some(order => order.product?.id === productId);
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Shopping Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item, index) =>
            item && item.id ? (
              <div className="cart-item" key={`${item.id}-${index}`}>
                <div className="cart_img">
                  <img
                    src={item.image}
                    alt={item.name}
                    width="120"
                    style={{ borderRadius: "8px" }}
                  />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>Original Price: ₹{item.originalPrice || 0}</p>
                  <p>Discounted Price: ₹{item.discountedPrice || 0}</p>

                  <div className="quantity-controls" style={{ margin: "10px 0" }}>
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      style={{
                        padding: "4px 10px",
                        marginRight: "6px",
                        cursor: isProductOrdered(item.id) ? "not-allowed" : "pointer",
                      }}
                      disabled={isProductOrdered(item.id)} 
                    >
                      −
                    </button>
                    <span>{item.quantity || 1}</span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      style={{
                        padding: "4px 10px",
                        marginLeft: "6px",
                        cursor: isProductOrdered(item.id) ? "not-allowed" : "pointer",
                      }}
                      disabled={isProductOrdered(item.id)} 
                    >
                      +
                    </button>
                  </div>

                  <p>
                    <strong>
                      Total: ₹
                      {(item.discountedPrice || 0) * (item.quantity || 0)}
                    </strong>
                  </p>

                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "4px",
                      marginTop: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : null
          )}

          <div className="total-amount" style={{ marginTop: "20px" }}>
            <h3>Total Amount: ₹{totalAmount}</h3>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;

