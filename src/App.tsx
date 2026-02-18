import { ScopeProvider } from "./contexts/ScopeContext";
import { useAuth } from "./hooks/useAuth";
import { AppRoutes } from "./routes/AppRoutes";

export default function App() {
  const { user } = useAuth();
  
  return (
    <ScopeProvider identity={user}>
      <AppRoutes />
    </ScopeProvider>
  );
}