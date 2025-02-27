import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import Billing from "./pages/Billing";
import PQR from "./pages/PQR";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Components
import Layout from "./components/layout/Layout";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicios" element={<Services />} />
        <Route path="/facturacion" element={<Billing />} />
        <Route path="/pqr" element={<PQR />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
