import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  authService,
  clearAuthToken,
  getAuthToken,
  setActiveTenantId,
  setAuthToken,
} from "../services/api";

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

const buildSession = ({
  tenantId,
  displayName,
  email,
  isAdmin = false,
  lastLoginAt = null,
}) => ({
  tenantId: (tenantId || "public").trim().toLowerCase(),
  displayName: displayName?.trim() || "Usuario portal",
  email: email?.trim() || "",
  isAdmin: Boolean(isAdmin),
  lastLoginAt: lastLoginAt || new Date().toISOString(),
});

const persistSession = (session) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const PortalSessionProvider = ({ children }) => {
  const [session, setSession] = useState(() => readStoredSession());
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      if (typeof window === "undefined") {
        if (mounted) setIsBootstrapping(false);
        return;
      }

      const storedSession = readStoredSession();
      const storedToken = getAuthToken();
      if (!storedSession || !storedToken) {
        if (storedToken && !storedSession) {
          clearAuthToken();
        }
        if (mounted) setIsBootstrapping(false);
        return;
      }

      try {
        setActiveTenantId(storedSession.tenantId || "public");
        const response = await authService.getCurrentUser();
        if (!mounted) return;
        const user = response.data;
        const nextSession = buildSession({
          tenantId: user.tenant_id || storedSession.tenantId,
          displayName: storedSession.displayName || user.email,
          email: user.email,
          isAdmin: user.is_admin,
          lastLoginAt: storedSession.lastLoginAt,
        });
        setSession(nextSession);
        persistSession(nextSession);
      } catch (error) {
        if (!mounted) return;
        setSession(null);
        localStorage.removeItem(SESSION_KEY);
        clearAuthToken();
      } finally {
        if (mounted) setIsBootstrapping(false);
      }
    };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async ({ tenantId, displayName, email, password }) => {
    const normalizedTenant = (tenantId || "public").trim().toLowerCase();
    setActiveTenantId(normalizedTenant);
    try {
      const loginResponse = await authService.login(email, password);
      setAuthToken(loginResponse.data.access_token);

      const meResponse = await authService.getCurrentUser();
      const currentUser = meResponse.data;
      const nextSession = buildSession({
        tenantId: currentUser.tenant_id || normalizedTenant,
        displayName: displayName || currentUser.email,
        email: currentUser.email,
        isAdmin: currentUser.is_admin,
      });
      setSession(nextSession);
      persistSession(nextSession);
      setActiveTenantId(nextSession.tenantId);
      return nextSession;
    } catch (error) {
      clearAuthToken();
      throw error;
    }
  };

  const updateSession = (partialData) => {
    setSession((current) => {
      if (!current) return current;
      const updated = buildSession({
        ...current,
        ...partialData,
        lastLoginAt: current.lastLoginAt,
      });
      persistSession(updated);
      setActiveTenantId(updated.tenantId);
      return updated;
    });
  };

  const logout = () => {
    setSession(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(SESSION_KEY);
    }
    authService.logout();
  };

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      isBootstrapping,
      login,
      logout,
      updateSession,
    }),
    [isBootstrapping, session]
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
  const { isAuthenticated, isBootstrapping } = usePortalSession();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-lg rounded-lg border border-slate-200 bg-white p-6 text-center">
          <p className="text-sm text-slate-600">Validando sesión segura del portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/portal/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

