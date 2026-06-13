"use client";

import PostEditorPage from "../../views/PostEditorPage";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute requiredRole="admin">
      <PostEditorPage />
    </ProtectedRoute>
  );
}
