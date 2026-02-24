import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import Billing from "./pages/Billing";
import PQR from "./pages/PQR";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Transparency from "./pages/Transparency";
import PortalLogin from "./pages/portal/PortalLogin";
import PortalDashboard from "./pages/portal/PortalDashboard";
import PortalRecibos from "./pages/portal/PortalRecibos";
import PortalDataInbox from "./pages/portal/PortalDataInbox";
import PortalSettings from "./pages/portal/PortalSettings";

// Components
import Layout from "./components/layout/Layout";
import PortalLayout from "./components/portal/PortalLayout";
import { PortalSessionProvider, RequirePortalSession } from "./context/PortalSessionContext";

function App() {
  return (
    <Routes>
      <Route
        path="/portal/login"
        element={
          <PortalSessionProvider>
            <PortalLogin />
          </PortalSessionProvider>
        }
      />

      <Route
        path="/portal/*"
        element={
          <PortalSessionProvider>
            <RequirePortalSession>
              <PortalLayout />
            </RequirePortalSession>
          </PortalSessionProvider>
        }
      >
        <Route index element={<PortalDashboard />} />
        <Route path="recibos" element={<PortalRecibos />} />
        <Route path="datos" element={<PortalDataInbox />} />
        <Route path="configuracion" element={<PortalSettings />} />
        <Route path="*" element={<PortalDashboard />} />
      </Route>

      <Route
        element={
          <Layout>
            <Outlet />
          </Layout>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/servicios" element={<Services />} />
        <Route path="/facturacion" element={<Billing />} />
        <Route path="/pqr" element={<PQR />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/terminos" element={<Terms />} />
        <Route path="/privacidad" element={<Privacy />} />
        <Route path="/transparencia" element={<Transparency />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
