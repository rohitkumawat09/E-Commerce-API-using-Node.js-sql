
import { instance } from "../axiosConfig";
import React, { useEffect, useState } from "react";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const res = await instance.get("/orders/all-orders", {
          withCredentials: true,
        });
        console.log("All Orders:", res.data);
        const data = Array.isArray(res.data) ? res.data : [];
        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders");
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Helper function to format payment method
  const formatPaymentMethod = (method) => {
    const paymentMap = {
      "C": "💳 Card (Stripe)",
      "N": "🏦 Net Banking",
      "U": "📱 UPI",
      "D": "📦 COD"
    };
    return paymentMap[method] || method;
  };

  // Download orders as PDF
  const downloadPDF = async () => {
    try {
      // Dynamic import to avoid loading library if not needed
      const { jsPDF } = await import('jspdf');
      const autoTableModule = await import('jspdf-autotable');
      const autoTable = autoTableModule.default || autoTableModule;

      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text("All Orders Report", 14, 15);
      
      // Add metadata
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
      doc.text(`Total Orders: ${filteredOrders.length}`, 14, 28);
      
      // Prepare table data
      const tableData = filteredOrders.map((order) => [
        order.orderId,
        order.userName || "N/A",
        order.email || "N/A",
        order.productName || "N/A",
        order.quantity,
        `₹${order.discountedPrice}`,
        formatPaymentMethod(order.payment_method),
        order.status,
        order.address || "N/A",
        order.phone || "N/A",
        formatDate(order.created_at)
      ]);

      // Add table (use the function exported by jspdf-autotable)
      await autoTable(doc, {
        head: [["Order ID", "Customer", "Email", "Product", "Qty", "Price", "Payment", "Status", "Address", "Phone", "Date"]],
        body: tableData,
        startY: 35,
        styles: {
          fontSize: 8,
          cellPadding: 3,
          overflow: "linebreak"
        },
        headStyles: {
          fillColor: [102, 126, 234],
          textColor: [255, 255, 255],
          fontStyle: "bold"
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        }
      });

      // Add footer with summary (use safe checks for page count and finalY)
      const pageCount = typeof doc.getNumberOfPages === 'function'
        ? doc.getNumberOfPages()
        : (doc.internal && doc.internal.pages)
          ? Object.keys(doc.internal.pages).length
          : 1;

      const lastAutoTableY = doc.lastAutoTable && doc.lastAutoTable.finalY ? doc.lastAutoTable.finalY : 35;
      const yPosition = lastAutoTableY + 15;

      doc.setFontSize(10);
      doc.text(`Total Revenue: ₹${filteredOrders.reduce((sum, order) => sum + (order.discountedPrice * order.quantity || 0), 0).toLocaleString()}`, 14, yPosition);
      doc.text(`Paid Orders: ${filteredOrders.filter(o => o.status === "Paid").length}`, 14, yPosition + 7);
      doc.text(`Pending Orders: ${filteredOrders.filter(o => o.status === "Pending").length}`, 14, yPosition + 14);

      // Save PDF
      doc.save(`orders_report_${new Date().getTime()}.pdf`);
    } catch (err) {
      console.error("PDF download error:", err);
      alert("Failed to download PDF. Please try again.");
    }
  };

  // Filter orders by search term
  const filteredOrders = orders.filter(order => 
    order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch(status) {
      case "Paid": return "#28a745";
      case "Pending": return "#ffc107";
      case "Cancelled": return "#dc3545";
      default: return "#6c757d";
    }
  };

  if (loading) {
    return <div style={styles.spinner}></div>;
  }

  if (error) {
    return <p style={styles.error}>{error}</p>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div>
            <h1>📊 Admin Dashboard - All Orders</h1>
            <p style={styles.subtitle}>Total Orders: {orders.length}</p>
          </div>
          <button 
            onClick={downloadPDF}
            style={styles.downloadButton}
            title="Download all orders as PDF"
          >
            📥 Download PDF
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by customer name, email, or product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {filteredOrders.length === 0 ? (
        <p style={styles.noOrders}>No orders found</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Order ID</th>
                <th style={styles.th}>Customer Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Payment</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Address</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Order Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.orderId} style={styles.tableRow}>
                  <td style={styles.td}><strong>#{order.orderId}</strong></td>
                  <td style={styles.td}>{order.userName || "N/A"}</td>
                  <td style={styles.td}>{order.email || "N/A"}</td>
                  <td style={styles.td}>{order.productName || "N/A"}</td>
                  <td style={styles.td}>{order.quantity}</td>
                  <td style={styles.td}>
                    <div>₹{order.discountedPrice}</div>
                    <small style={{color: "#999"}}><del>₹{order.originalPrice}</del></small>
                  </td>
                  <td style={styles.td}>{formatPaymentMethod(order.payment_method)}</td>
                  <td style={{
                    ...styles.td,
                    background: getStatusColor(order.status),
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: "4px"
                  }}>
                    {order.status}
                  </td>
                  <td style={styles.td}>{order.address || "N/A"}</td>
                  <td style={styles.td}>{order.phone || "N/A"}</td>
                  <td style={styles.td}>{formatDate(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Cards */}
      <div style={styles.summaryContainer}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>{filteredOrders.length}</div>
          <div style={styles.summaryLabel}>Total Orders</div>
        </div>

        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>
            {filteredOrders.filter(o => o.status === "Paid").length}
          </div>
          <div style={styles.summaryLabel}>Paid Orders</div>
        </div>

        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>
            {filteredOrders.filter(o => o.status === "Pending").length}
          </div>
          <div style={styles.summaryLabel}>Pending Orders</div>
        </div>

        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>
            ₹{filteredOrders.reduce((sum, order) => sum + (order.discountedPrice * order.quantity || 0), 0).toLocaleString()}
          </div>
          <div style={styles.summaryLabel}>Total Revenue</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    background: "#f8f9fa",
    minHeight: "100vh"
  },
  header: {
    marginBottom: "30px",
    color: "#333"
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px"
  },
  downloadButton: {
    background: "#28a745",
    color: "white",
    border: "none",
    padding: "10px 20px",
    fontSize: "14px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background 0.3s",
    whiteSpace: "nowrap"
  },
  subtitle: {
    fontSize: "16px",
    color: "#666",
    marginTop: "5px"
  },
  searchContainer: {
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center"
  },
  searchInput: {
    width: "100%",
    maxWidth: "500px",
    padding: "10px 15px",
    fontSize: "14px",
    border: "2px solid #ddd",
    borderRadius: "5px",
    boxSizing: "border-box"
  },
  tableContainer: {
    overflowX: "auto",
    marginBottom: "30px",
    background: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px"
  },
  tableHeader: {
    background: "#667eea",
    color: "white"
  },
  th: {
    padding: "12px",
    textAlign: "left",
    fontWeight: "bold",
    borderBottom: "2px solid #667eea"
  },
  tableRow: {
    borderBottom: "1px solid #eee",
    transition: "background 0.2s"
  },
  td: {
    padding: "12px",
    color: "#333"
  },
  noOrders: {
    textAlign: "center",
    color: "#999",
    padding: "30px",
    fontSize: "16px"
  },
  spinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    fontSize: "18px",
    color: "#667eea"
  },
  error: {
    color: "red",
    padding: "20px",
    textAlign: "center"
  },
  summaryContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginTop: "30px"
  },
  summaryCard: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  },
  summaryValue: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#667eea",
    marginBottom: "10px"
  },
  summaryLabel: {
    fontSize: "14px",
    color: "#666"
  }
};

export default AllOrders;
