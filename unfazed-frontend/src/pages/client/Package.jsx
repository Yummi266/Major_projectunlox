import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ClientSidebar from "../../components/client/ClientSidebar";
import ClientHeader from "../../components/client/ClientHeader";
import PackageOverview from "../../components/client/PackageOverview";
import PackageSessions from "../../components/client/PackageSessions";
import { authService } from "../../services/authService";
import { CalendarIcon, PackageIcon } from "../../components/common/Icons";

import "../../styles/dashboard.css";
import "../../styles/client-package.css";

function ClientPackage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlanForRenewal, setSelectedPlanForRenewal] = useState(null);
  const [successNotice, setSuccessNotice] = useState("");

  const fetchClientData = async () => {
    try {
      const token = authService.getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get("http://localhost:5000/api/dashboard/client", { headers });
      if (res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Failed to load client package details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, []);

  const handlePlanSelection = (pkg) => {
    setSelectedPlanForRenewal(pkg);
  };

  const handleConfirmPlanRenewal = async () => {
    if (!selectedPlanForRenewal) return;

    try {
      const token = authService.getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // 1. Create order on backend
      const orderRes = await axios.post(
        "http://localhost:5000/api/payments/create-order",
        { packageId: selectedPlanForRenewal._id },
        { headers }
      );

      const orderData = orderRes.data;
      if (!orderData?.success) {
        throw new Error(orderData?.message || "Failed to create payment order");
      }

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK is not loaded. Please ensure you have an active internet connection.");
      }

      // Open official Razorpay Checkout modal
      const options = {
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Unfazed Therapy & Care",
        description: `Care Package: ${selectedPlanForRenewal.name}`,
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            await axios.post(
              "http://localhost:5000/api/payments/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers }
            );

            setSuccessNotice(
              `Payment verified! Successfully activated "${selectedPlanForRenewal.name}". Quota refreshed!`
            );
            setSelectedPlanForRenewal(null);
            fetchClientData();
          } catch (vErr) {
            alert("Payment verification failed. Please contact clinic support.");
          }
        },
        prefill: {
          name: data?.client?.name || "",
          email: data?.client?.email || "",
        },
        theme: {
          color: "#1c5b88",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        alert(`Payment failed: ${response.error.description}`);
      });
      rzp.open();

      setTimeout(() => {
        setSuccessNotice("");
      }, 6000);
    } catch (err) {
      console.error("Payment error:", err);
      alert(err.response?.data?.message || err.message || "Failed to process payment.");
    }
  };

  return (
    <div className="dashboard-page">
      <ClientSidebar />

      <div className="dashboard-main">
        <ClientHeader />

        <main className="client-package-content">
          <div className="client-page-title">
            <div>
              <h1>My Therapy Package</h1>
              <p>Monitor your active care plan, remaining session quotas, and renewal options.</p>
            </div>

            <Link to="/client/sessions" style={{ textDecoration: "none" }}>
              <button className="book-session-btn" type="button">
                <CalendarIcon size={14} />
                <span>Book A Session</span>
              </button>
            </Link>
          </div>

          {successNotice && (
            <div
              style={{
                padding: "14px 20px",
                marginBottom: "20px",
                borderRadius: "10px",
                backgroundColor: "#e6f7ef",
                border: "1px solid #b8ebd2",
                color: "#128253",
                fontSize: "13.5px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span>✓</span>
              <span>{successNotice}</span>
            </div>
          )}

          <div className="package-page-grid">
            <PackageOverview
              packageProgress={data?.packageProgress}
              therapistName={data?.therapist?.name || "Dr. ThuWai"}
            />

            <PackageSessions
              packageProgress={data?.packageProgress}
              onPackageSelected={handlePlanSelection}
            />
          </div>

          {/* Plan Confirmation Modal */}
          {selectedPlanForRenewal && (
            <div className="book-modal-overlay">
              <div className="book-modal">
                <div className="book-modal-header">
                  <h3>Confirm Care Package</h3>
                  <button
                    className="book-modal-close"
                    onClick={() => setSelectedPlanForRenewal(null)}
                  >
                    ×
                  </button>
                </div>

                <div className="book-modal-body">
                  <p style={{ margin: "0 0 16px", color: "#547589", fontSize: "13.5px" }}>
                    You are selecting <strong>{selectedPlanForRenewal.name}</strong> with{" "}
                    <strong>{selectedPlanForRenewal.sessions} sessions</strong> for{" "}
                    <strong>₹{selectedPlanForRenewal.price.toLocaleString()}</strong>.
                  </p>

                  <div
                    style={{
                      background: "#f7fafc",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "1px solid #e2ecf2",
                      marginBottom: "16px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
                      <span>Session Count:</span>
                      <strong>{selectedPlanForRenewal.sessions} Sessions</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
                      <span>Duration per session:</span>
                      <strong>{selectedPlanForRenewal.duration || "50 min"}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                      <span>Billing:</span>
                      <strong style={{ color: "#174d73" }}>₹{selectedPlanForRenewal.price.toLocaleString()} (All inclusive)</strong>
                    </div>
                  </div>

                  <p style={{ margin: 0, color: "#7894a4", fontSize: "12px", lineHeight: "1.4" }}>
                    Upon confirming, an official invoice will be generated in your Invoices tab and payment confirmation will be logged with your care coordinator.
                  </p>
                </div>

                <div className="book-modal-footer">
                  <button
                    type="button"
                    className="details-btn"
                    onClick={() => setSelectedPlanForRenewal(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="join-btn"
                    onClick={handleConfirmPlanRenewal}
                  >
                    Confirm & Activate Plan
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ClientPackage;
