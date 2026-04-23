import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./features/user/pages/LoginPage";
import UserApp from "./features/user/UserApp";
import AdminApp from "./features/admin/AdminApp";

function AppContent() {
  const { isAuthenticated, isAdmin, isDocente, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: "#1a1a1e", display: "flex",
        alignItems: "center", justifyContent: "center", color: "#2196F3",
        fontFamily: "'Outfit', sans-serif", fontSize: 18,
      }}>
        Cargando...
      </div>
    );
  }

  if (!isAuthenticated) return <LoginPage />;
  if (isAdmin) return <AdminApp />;
  if (isDocente) return <UserApp />;

  return <LoginPage />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
