import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Processing...");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    
    if (!sessionId) return;
    console.log("Session ID:", sessionId);


    const saveOrder = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND}/payment/stripe-success`,
          { sessionId },

          { withCredentials: true }
          
        );
        setMessage(res.data.message);
      } catch (err) {
        console.error(err);
        setMessage("❌ Order failed!");
      }
    };

    saveOrder();
  }, [searchParams]);

  return <h1>{message}</h1>;
};

export default SuccessPage;
