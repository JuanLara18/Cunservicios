import React, { createContext, useContext, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { setActiveTenantId } from "../services/api";

const SESSION_KEY = "portal.session.v1";

const PortalSessionContext = createContext(null);

const readStoredSession = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};

export const PortalSessionProvider = ({ children }) => {
  const [session, setSession] = useState(() => readStoredSession());

  const login = ({ tenantId, displayName, email }) => {
    const nextSession = {
      tenantId: (tenantId || "public").trim().toLowerCase(),
      displayName: displayName?.trim() || "Usuario portal",
      email: email?.trim() || "",
      lastLoginAt: new Date().toISOString(),
    };
    setSession(nextSession);
    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    }
    setActiveTenantId(nextSession.tenantId);
  };

  const updateSession = (partialData) => {
    setSession((current) => {
      if (!current) return current;
      const updated = { ...current, ...partialData };
      if (typeof window !== "undefined") {
        localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      }
      if (updated.tenantId) {
        setActiveTenantId(updated.tenantId);
      }
      return updated;
    });
  };

  const logout = () => {
    setSession(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem("token");
    }
  };

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      login,
      logout,
      updateSession,
    }),
    [session]
  );

  return <PortalSessionContext.Provider value={value}>{children}</PortalSessionContext.Provider>;
};

export const usePortalSession = () => {
  const context = useContext(PortalSessionContext);
  if (!context) {
    throw new Error("usePortalSession debe usarse dentro de PortalSessionProvider");
  }
  return context;
};

export const RequirePortalSession = ({ children }) => {
  const { isAuthenticated } = usePortalSession();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/portal/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

