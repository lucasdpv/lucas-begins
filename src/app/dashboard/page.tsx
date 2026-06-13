"use client";

import DashboardPage from "../../views/DashboardPage";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
}
