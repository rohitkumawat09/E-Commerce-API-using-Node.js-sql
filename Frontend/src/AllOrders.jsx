
import { instance } from "../axiosConfig";
import React, { useEffect, useState } from "react";
import axios from "axios";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const res = await instance.get("/orders/all-orders", {
          withCredentials: true,
        });
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders");
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  if (loading) return <div className="spinner"></div>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((user) => (
          <div
            key={user.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "20px",
              borderRadius: "8px",
            }}
          >
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <h4>Orders:</h4>
            {user.orders.map((order, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "15px",
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                  marginBottom: "10px",
                  alignItems: "center",
                }}
              >
                {/* Product Image */}
                {order.product?.image && (
                  <img
                    src={order.product.image}
                    alt={order.product.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "5px",
                    }}
                  />
                )}

                {/* Product Details */}
                <div>
                  <p>
                    <strong>Product:</strong> {order.product?.name}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {order.quantity}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{order.product?.discountedPrice}{" "}
                    <del>₹{order.product?.originalPrice}</del>
                  </p>
                  <p>
                    <strong>Status:</strong> {order.status}
                  </p>
                  <p>
                    <strong>Payment:</strong> {order.paymentMethod}
                  </p>
                  <p>
                    <strong>Address:</strong> {order.address}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default AllOrders;
