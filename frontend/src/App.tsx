import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "./routes";
import { AuthProvider } from "./context/AuthContext";

const AppRoutes = () => useRoutes(routes);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
