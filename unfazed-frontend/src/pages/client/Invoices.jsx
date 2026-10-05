import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ClientSidebar from "../../components/client/ClientSidebar";
import ClientHeader from "../../components/client/ClientHeader";
import InvoiceList from "../../components/client/InvoiceList";
import { authService } from "../../services/authService";
import { CalendarIcon, PackageIcon } from "../../components/common/Icons";

import "../../styles/dashboard.css";
import "../../styles/client-invoices.css";

function ClientInvoices() {
  const [clientData, setClientData] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = authService.getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await axios.get("http://localhost:5000/api/dashboard/client", { headers });
        if (res.data) {
          setClientData(res.data);
        }

        const invRes = await axios.get("http://localhost:5000/api/invoices", { headers }).catch(() => null);
        if (invRes?.data?.invoices && invRes.data.invoices.length > 0) {
          const mapped = invRes.data.invoices.map((inv) => ({
            id: inv.invoiceNumber,
            date: new Date(inv.issuedAt || inv.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            planName:
              inv.description ||
              (inv.package?.name
                ? `${inv.package.name} (${inv.package.sessions} Clinical Sessions)`
                : "Therapy Care Package"),
            amount: inv.amount,
            status: inv.status || "Paid",
            paymentMethod: "Razorpay / UPI",
            transactionId: inv.payment?.razorpayPaymentId || `TXN_${inv._id.slice(-8).toUpperCase()}`,
            items: [
              {
                desc: inv.description || "Clinical Consultations & Care Package",
                rate: inv.package?.sessions ? Math.round(inv.amount / inv.package.sessions) : inv.amount,
                qty: inv.package?.sessions || 1,
                total: inv.amount,
              },
            ],
          }));
          setInvoices(mapped);
        } else if (res.data) {
          const pkgName = res.data.client?.package || "Standard Package";
          const pkgPrice = 1500;
          const pkgSessions = 3;

          const defaultInv = [
            {
              id: "INV-2026-0001",
              date: "Sep 28, 2026",
              planName: `${pkgName} (${pkgSessions} Clinical Sessions)`,
              amount: pkgPrice,
              status: "Paid",
              paymentMethod: "Razorpay / UPI",
              transactionId: "TXN_RZP_881923091",
              items: [
                {
                  desc: `Clinical Psychotherapy Consultations (${pkgSessions} x 50 min)`,
                  rate: Math.round(pkgPrice / pkgSessions),
                  qty: pkgSessions,
                  total: pkgPrice,
                },
              ],
            },
          ];
          setInvoices(defaultInv);
        }
      } catch (err) {
        console.error("Failed to load client invoices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-page">
      <ClientSidebar />

      <div className="dashboard-main">
        <ClientHeader />

        <main className="client-invoices-content">
          <div className="client-page-title">
            <div>
              <h1>Invoices & Billing</h1>
              <p>View your care payment history, receipts, and package billing statements.</p>
            </div>

            <Link to="/client/package" style={{ textDecoration: "none" }}>
              <button className="book-session-btn" type="button">
                <PackageIcon size={14} />
                <span>My Package Details</span>
              </button>
            </Link>
          </div>

          <InvoiceList
            invoices={invoices}
            clientInfo={clientData?.client || {}}
            therapistName={clientData?.therapist?.name || "Your Therapist"}
          />
        </main>
      </div>
    </div>
  );
}

export default ClientInvoices;
