import { useNavigate } from "react-router-dom";

const CancelPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cancelIcon}>❌</div>
        <h1 style={styles.title}>Payment Cancelled</h1>
        <p style={styles.message}>
          You cancelled the payment. Your order was not created.
        </p>
        <button 
          onClick={() => navigate("/productorder")}
          style={styles.button}
        >
          Try Again
        </button>
        <button 
          onClick={() => navigate("/Home")}
          style={{...styles.button, background: "#6c757d"}}
        >
          Continue Shopping
        </button>
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
  cancelIcon: {
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
  }
};

export default CancelPage;