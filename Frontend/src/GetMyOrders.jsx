import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { EcomContext } from "./UseContext";
import { useNavigate } from "react-router-dom";

const GetMyOrders = () => {
  const [loading, setLoading] = useState(true);
  const { orders, fetchOrders } = useContext(EcomContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const loadOrders = async () => {
      setLoading(true);
      await fetchOrders();
      setLoading(false);
    };

    loadOrders();
  }, [user, navigate]); 

  if (loading) return <div className="spinner"></div>;
  if (!orders || orders.length === 0) return <p>No orders found.</p>;

  return (
    <div>
      <h2>My Orders</h2>
      <ul>
        {orders.map((order) => (
          <li
            key={order.id}
            style={{
              marginBottom: "1rem",
              border: "1px solid #ccc",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {order.product?.image ? (
              <img
                src={order.product.image}
                alt={order.product.name}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  backgroundColor: "#eee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                No Image
              </div>
            )}

            <div>
              <p><strong>Product:</strong> {order.product?.name || "N/A"}</p>
              <p><strong>Quantity:</strong> {order.quantity}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>Phone:</strong> {order.phone}</p>
              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetMyOrders;
