import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { instance } from "../axiosConfig";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Processing your payment...");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    
    if (!sessionId) {
      setMessage("❌ No payment session found");
      setStatus("error");
      return;
    }

    console.log("Session ID:", sessionId);

    const saveOrder = async () => {
      try {
        const res = await instance.post(
          "/payment/stripe-success",
          { sessionId },
          { withCredentials: true }
        );
        
        setMessage(res.data.message);
        setStatus(res.data.status);
        
        console.log("Success response:", res.data);
      } catch (err) {
        console.error("Error:", err);
        setMessage("❌ " + (err.response?.data?.error || "Failed to process payment"));
        setStatus("error");
      }
    };

    saveOrder();
  }, [searchParams]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {status === "loading" && (
          <>
            <div style={styles.spinner}></div>
            <p style={styles.message}>{message}</p>
          </>
        )}

        {status === "paid" && (
          <>
            <div style={styles.successIcon}>✅</div>
            <h1 style={styles.title}>Payment Successful!</h1>
            <p style={styles.message}>{message}</p>
            <button 
              onClick={() => navigate("/GetMyOrders")}
              style={styles.button}
            >
              View My Orders
            </button>
            <button 
              onClick={() => navigate("/Home")}
              style={{...styles.button, background: "#6c757d"}}
            >
              Continue Shopping
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div style={styles.errorIcon}>❌</div>
            <h1 style={styles.title}>Payment Failed</h1>
            <p style={styles.message}>{message}</p>
            <button 
              onClick={() => navigate("/productorder")}
              style={styles.button}
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px"
  },
  card: {
    background: "white",
    borderRadius: "10px",
    padding: "40px",
    textAlign: "center",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
    maxWidth: "500px",
    width: "100%"
  },
  successIcon: {
    fontSize: "60px",
    marginBottom: "20px"
  },
  errorIcon: {
    fontSize: "60px",
    marginBottom: "20px"
  },
  title: {
    fontSize: "28px",
    marginBottom: "20px",
    color: "#333"
  },
  message: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "30px",
    lineHeight: "1.5"
  },
  button: {
    background: "#667eea",
    color: "white",
    border: "none",
    padding: "12px 30px",
    fontSize: "16px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
    marginBottom: "10px",
    transition: "background 0.3s"
  },
  spinner: {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #667eea",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite",
    margin: "20px auto"
  }
};

export default SuccessPage;
