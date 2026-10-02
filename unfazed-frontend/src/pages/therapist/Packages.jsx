import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import DashboardSidebar from "../../components/therapist/DashboardSidebar";
import DashboardHeader from "../../components/therapist/DashboardHeader";
import PackageToolbar from "../../components/therapist/PackageToolbar";
import PackageList from "../../components/therapist/PackageList";
import CreatePackageModal from "../../components/therapist/CreatePackageModal";
import EditPackageModal from "../../components/therapist/EditPackageModal";
import ViewPackageModal from "../../components/therapist/ViewPackageModal";

import "../../styles/packages.css";

function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewingPackage, setViewingPackage] = useState(null);
  const [editingPackage, setEditingPackage] = useState(null);

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/packages");
      if (res.data?.packages && Array.isArray(res.data.packages)) {
        setPackages(res.data.packages);
      } else {
        setPackages([]);
      }
    } catch (err) {
      console.error("Failed to fetch packages:", err);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  // Compute live statistics
  const totalPackages = packages.length;
  const activePackages = packages.filter((p) => p.status === "Active").length;
  const totalClientsEnrolled = packages.reduce(
    (acc, p) => acc + (typeof p.clients === "number" ? p.clients : 0),
    0
  );
  const averagePrice =
    totalPackages > 0
      ? Math.round(
          packages.reduce((acc, p) => acc + (Number(p.price) || 0), 0) /
            totalPackages
        )
      : 0;

  // Filter packages by search query
  const displayedPackages = packages.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="dashboard-page">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardHeader />

        <main className="packages-content">
          <PackageToolbar
            onCreateClick={() => setIsCreateOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* Quick Metrics Cards */}
          <div className="packages-stats-row">
            <div className="package-stat-card">
              <span>Total Packages</span>
              <strong>{totalPackages}</strong>
            </div>

            <div className="package-stat-card">
              <span>Active Plans</span>
              <strong>{activePackages}</strong>
            </div>

            <div className="package-stat-card">
              <span>Enrolled Clients</span>
              <strong>{totalClientsEnrolled}</strong>
            </div>

            <div className="package-stat-card">
              <span>Average Package Value</span>
              <strong>₹{averagePrice.toLocaleString()}</strong>
            </div>
          </div>

          <PackageList
            packages={displayedPackages}
            loading={loading}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onView={(pkg) => setViewingPackage(pkg)}
            onEdit={(pkg) => setEditingPackage(pkg)}
          />
        </main>
      </div>

      {/* Modals */}
      <CreatePackageModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={fetchPackages}
      />

      <ViewPackageModal
        pkg={viewingPackage}
        isOpen={Boolean(viewingPackage)}
        onClose={() => setViewingPackage(null)}
        onEditClick={(pkg) => setEditingPackage(pkg)}
      />

      <EditPackageModal
        pkg={editingPackage}
        isOpen={Boolean(editingPackage)}
        onClose={() => setEditingPackage(null)}
        onUpdated={fetchPackages}
        onDeleted={fetchPackages}
      />
    </div>
  );
}

export default Packages;
