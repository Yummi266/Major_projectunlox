import { useEffect, useState } from "react";
import axios from "axios";

import { InvoiceIcon, ShieldLockIcon } from "../common/Icons";
import { authService } from "../../services/authService";

function InvoiceList({
  invoices: initialInvoices = [],
  clientInfo = {},
  therapistName = "Your Therapist",
}) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // =====================================================
  // FETCH REAL INVOICES
  // =====================================================

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        setError("");

        const token = authService.getToken();

        if (!token) {
          setError("Please log in to view your invoices.");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/invoices",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data?.success) {
          setInvoices(response.data.invoices || []);
        } else {
          setInvoices([]);
        }
      } catch (err) {
        console.error("Failed to load invoices:", err);

        setError(
          err.response?.data?.message ||
          "Unable to load your invoices."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // CONVERT BACKEND INVOICE TO UI FORMAT
  // =====================================================

  const formatInvoice = (invoice) => {
    const packageName =
      invoice.package?.name ||
      invoice.description ||
      "Therapy Service";

    const sessionCount =
      invoice.package?.sessions || 1;

    const amount = Number(invoice.amount) || 0;

    const rate =
      sessionCount > 0
        ? Math.round(amount / sessionCount)
        : amount;

    return {
      id:
        invoice.invoiceNumber ||
        invoice._id,

      date: formatDate(invoice.issuedAt),

      planName: packageName,

      amount,

      status: invoice.status || "Paid",

      paymentMethod:
        invoice.payment?.provider ||
        "Razorpay",

      transactionId:
        invoice.payment?.razorpayPaymentId ||
        invoice.payment?._id ||
        "—",

      description:
        invoice.description ||
        `${packageName} - ${sessionCount} therapy sessions`,

      items: [
        {
          desc:
            invoice.description ||
            `${packageName} (${sessionCount} sessions)`,

          rate,

          qty: sessionCount,

          total: amount,
        },
      ],
    };
  };

  const list = invoices.map(formatInvoice);

  // =====================================================
  // TOTAL PAID
  // =====================================================

  const totalPaid = list.reduce(
    (acc, invoice) =>
      invoice.status === "Paid"
        ? acc + invoice.amount
        : acc,
    0
  );

  // =====================================================
  // PRINT
  // =====================================================

  const handlePrint = () => {
    window.print();
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="invoice-loading-state">
        <p>Loading your invoices...</p>
      </div>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================

  if (error) {
    return (
      <div className="invoice-error-state">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* =================================================
          BILLING SUMMARY METRICS
      ================================================= */}

      <section className="invoices-summary-row">
        <div className="invoice-stat-card">
          <span>Total Care Investment</span>

          <strong>
            ₹{totalPaid.toLocaleString("en-IN")}
          </strong>

          <small>✓ Fully Settled</small>
        </div>

        <div className="invoice-stat-card">
          <span>Active Invoices</span>

          <strong>
            {list.length} Records
          </strong>

          <small style={{ color: "#6c8a9d" }}>
            All receipts verified
          </small>
        </div>

        <div className="invoice-stat-card">
          <span>Payment Security</span>

          <strong>Razorpay</strong>

          <small>
            Secure Payment Gateway
          </small>
        </div>

        <div className="invoice-stat-card">
          <span>Current Care Plan</span>

          <strong>
            {clientInfo.package ||
              list[0]?.planName ||
              "No Active Package"}
          </strong>

          <small style={{ color: "#174d73" }}>
            Valid & Active
          </small>
        </div>
      </section>

      {/* =================================================
          INVOICES LIST TABLE
      ================================================= */}

      <article className="invoices-table-card">
        <div className="invoices-card-header">
          <div>
            <h3>Billing & Payment Records</h3>

            <span>
              Download official tax receipts for your therapy care.
            </span>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          {list.length === 0 ? (
            <div className="invoice-empty-state">
              <p>No invoices available yet.</p>

              <span>
                Your invoices will appear here after a
                successful package payment.
              </span>
            </div>
          ) : (
            <table className="invoices-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Date</th>
                  <th>Care Description</th>
                  <th>Payment Mode</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {list.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>
                      <span className="invoice-id-badge">
                        {invoice.id}
                      </span>
                    </td>

                    <td>
                      {invoice.date}
                    </td>

                    <td>
                      <strong>
                        {invoice.planName}
                      </strong>
                    </td>

                    <td>
                      {invoice.paymentMethod}
                    </td>

                    <td>
                      <strong>
                        ₹
                        {invoice.amount.toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`invoice-status-pill ${invoice.status
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                          }`}
                      >
                        {invoice.status}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="view-receipt-btn"
                        onClick={() =>
                          setSelectedInvoice(invoice)
                        }
                      >
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </article>

      {/* =================================================
          FORMAL TAX RECEIPT MODAL
      ================================================= */}

      {selectedInvoice && (
        <div className="receipt-modal-overlay">
          <div className="receipt-modal">
            <div className="receipt-content">

              {/* Clinic Header */}

              <div className="receipt-clinic-header">
                <div className="clinic-brand-block">
                  <h2>Unfazed Healthcare</h2>

                  <p>
                    Clinical Psychological Practice &
                    Psychotherapy Center
                  </p>

                  <p
                    style={{
                      marginTop: "4px",
                      color: "#8aa2b0",
                    }}
                  >
                    License: RCI-MH-82910 · Care Lead:{" "}
                    {therapistName}
                  </p>
                </div>

                <div className="receipt-title-block">
                  <h3>Tax Invoice</h3>

                  <span>
                    {selectedInvoice.id}
                  </span>
                </div>
              </div>

              {/* Patient & Invoice Metadata */}

              <div className="receipt-meta-grid">
                <div className="receipt-meta-col">
                  <span>Billed To:</span>

                  <strong>
                    {clientInfo.name ||
                      "Patient / Client"}
                  </strong>

                  <div
                    style={{
                      fontSize: "12px",
                      color: "#688496",
                      marginTop: "2px",
                    }}
                  >
                    {clientInfo.email ||
                      "client@practice.com"}
                  </div>
                </div>

                <div className="receipt-meta-col">
                  <span>Billing Date:</span>

                  <strong>
                    {selectedInvoice.date}
                  </strong>

                  <div
                    style={{
                      fontSize: "12px",
                      color: "#688496",
                      marginTop: "2px",
                    }}
                  >
                    Method:{" "}
                    {selectedInvoice.paymentMethod}
                  </div>
                </div>
              </div>

              {/* Itemized Table */}

              <table className="receipt-items-table">
                <thead>
                  <tr>
                    <th>Item & Description</th>
                    <th>Rate</th>
                    <th>Qty</th>
                    <th style={{ textAlign: "right" }}>
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {selectedInvoice.items?.map(
                    (item, index) => (
                      <tr key={index}>
                        <td>{item.desc}</td>

                        <td>
                          ₹
                          {Number(
                            item.rate
                          ).toLocaleString("en-IN")}
                        </td>

                        <td>
                          {item.qty}
                        </td>

                        <td
                          style={{
                            textAlign: "right",
                          }}
                        >
                          ₹
                          {Number(
                            item.total
                          ).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>

              {/* Totals */}

              <div className="receipt-total-block">
                <div className="receipt-total-line">
                  <span>Subtotal:</span>

                  <span>
                    ₹
                    {selectedInvoice.amount.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="receipt-total-line">
                  <span>
                    Healthcare Service Tax (GST Exempt):
                  </span>

                  <span>₹0</span>
                </div>

                <div className="receipt-total-line final">
                  <span>
                    Total Amount Paid:
                  </span>

                  <span>
                    ₹
                    {selectedInvoice.amount.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>
              </div>

              {/* Payment Status */}

              <div
                style={{
                  marginTop: "24px",
                  padding: "12px 16px",
                  background: "#e6f7ef",
                  borderRadius: "8px",
                  color: "#128253",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "15px",
                }}
              >
                <span>
                  Status:{" "}
                  {selectedInvoice.status}
                </span>

                <span>
                  Ref:{" "}
                  {selectedInvoice.transactionId}
                </span>
              </div>
            </div>

            {/* Modal Footer */}

            <div className="receipt-modal-footer">
              <button
                type="button"
                className="receipt-btn close"
                onClick={() =>
                  setSelectedInvoice(null)
                }
              >
                Close
              </button>

              <button
                type="button"
                className="receipt-btn print"
                onClick={handlePrint}
              >
                Print / Save Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvoiceList;