import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/therapist/Dashboard";
import Schedule from "./pages/therapist/Schedule";
import Clients from "./pages/therapist/Clients";
import Notes from "./pages/therapist/Notes";
import Messages from "./pages/therapist/Messages";
import Packages from "./pages/therapist/Packages";
import Analytics from "./pages/therapist/Analytics";
import Settings from "./pages/therapist/Settings";

import ClientDashboard from "./pages/client/ClientDashboard";
import Sessions from "./pages/client/Sessions";
import ClientMessages from "./pages/client/Messages";
import ClientPackage from "./pages/client/Package";
import ClientInvoices from "./pages/client/Invoices";

import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="therapist">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/schedule"
          element={
            <ProtectedRoute allowedRole="therapist">
              <Schedule />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clients"
          element={
            <ProtectedRoute allowedRole="therapist">
              <Clients />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes"
          element={
            <ProtectedRoute allowedRole="therapist">
              <Notes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <ProtectedRoute allowedRole="therapist">
              <Messages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/packages"
          element={
            <ProtectedRoute allowedRole="therapist">
              <Packages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute allowedRole="therapist">
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRole="therapist">
              <Settings />
            </ProtectedRoute>
          }
        />

        {}
        <Route
          path="/client/dashboard"
          element={
            <ProtectedRoute allowedRole="client">
              <ClientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client-dashboard"
          element={
            <ProtectedRoute allowedRole="client">
              <ClientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client/sessions"
          element={
            <ProtectedRoute allowedRole="client">
              <Sessions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client/messages"
          element={
            <ProtectedRoute allowedRole="client">
              <ClientMessages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client/package"
          element={
            <ProtectedRoute allowedRole="client">
              <ClientPackage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client/invoices"
          element={
            <ProtectedRoute allowedRole="client">
              <ClientInvoices />
            </ProtectedRoute>
          }
        />

        {}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;