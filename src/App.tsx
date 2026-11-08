import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserLayout } from './layouts/UserLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Dedicated User Pages
import { UserDashboardPage } from './pages/user/UserDashboardPage';
import { AlertsPage } from './pages/user/AlertsPage';
import { LiveGoogleMapsPage } from './pages/user/LiveGoogleMapsPage';
import { EmergencyContactsPage } from './pages/user/EmergencyContactsPage';
import { SafeZonesPage } from './pages/user/SafeZonesPage';
import { WeatherPage } from './pages/user/WeatherPage';
import { DisasterResourcesPage } from './pages/user/DisasterResourcesPage';
import { NotificationsPage } from './pages/user/NotificationsPage';
import { UserProfilePage } from './pages/user/UserProfilePage';
import { SOSPage } from './pages/user/SOSPage';
import { DisasterReportingPage } from './pages/user/DisasterReportingPage';
import { EvacuationGuidancePage } from './pages/user/EvacuationGuidancePage';
import { LocationSubscriptionsPage } from './pages/user/LocationSubscriptionsPage';

// Dedicated Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminAlertsPage } from './pages/admin/AdminAlertsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminContactsPage } from './pages/admin/AdminContactsPage';
import { AdminSafeZonesPage } from './pages/admin/AdminSafeZonesPage';
import { AdminResourcesPage } from './pages/admin/AdminResourcesPage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminMonitoringPage } from './pages/admin/AdminMonitoringPage';
import { AdminActivityLogsPage } from './pages/admin/AdminActivityLogsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

import { StorageService } from './services/storage';
import { Language, translations } from './services/i18n';
import { UserProfile, AdminProfile } from './types';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('morai_language') as Language) || 'en';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => StorageService.getCurrentUser());
  const [currentAdmin, setCurrentAdmin] = useState<AdminProfile | null>(() => StorageService.getCurrentAdmin());

  // Demo key quota defense banner state per Section 8 of Google Maps skill
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Sync state with storage updates
  useEffect(() => {
    const refreshData = () => {
      setCurrentUser(StorageService.getCurrentUser());
      setCurrentAdmin(StorageService.getCurrentAdmin());
    };
    window.addEventListener('morai_storage_updated', refreshData);
    return () => window.removeEventListener('morai_storage_updated', refreshData);
  }, []);

  const handleToggleLanguage = () => {
    const next: Language = language === 'en' ? 'ta' : 'en';
    setLanguage(next);
    localStorage.setItem('morai_language', next);
  };

  const handleUserLogin = (user: UserProfile) => {
    StorageService.setCurrentUser(user);
    setCurrentUser(user);
  };

  const handleUserLogout = () => {
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
  };

  const handleAdminLogin = (admin: AdminProfile) => {
    StorageService.setCurrentAdmin(admin);
    setCurrentAdmin(admin);
  };

  const handleAdminLogout = () => {
    StorageService.setCurrentAdmin(null);
    setCurrentAdmin(null);
  };

  return (
    <BrowserRouter>
      {/* Google Maps Quota Defense Sticky Banner */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      <Routes>
        {/* Root Redirect to User Dashboard */}
        <Route path="/" element={<Navigate to="/user/dashboard" replace />} />

        {/* User Portal Routes */}
        <Route
          path="/user"
          element={
            <UserLayout
              language={language}
              onToggleLanguage={handleToggleLanguage}
              currentUser={currentUser}
              onUserLogin={handleUserLogin}
              onUserLogout={handleUserLogout}
            />
          }
        >
          <Route index element={<Navigate to="/user/dashboard" replace />} />
          <Route
            path="dashboard"
            element={<UserDashboardPage currentUser={currentUser} language={language} />}
          />
          <Route
            path="alerts"
            element={<AlertsPage currentUser={currentUser} language={language} />}
          />
          <Route
            path="maps"
            element={<LiveGoogleMapsPage language={language} />}
          />
          <Route
            path="emergency-contacts"
            element={<EmergencyContactsPage language={language} />}
          />
          <Route
            path="safe-zones"
            element={<SafeZonesPage language={language} />}
          />
          <Route
            path="weather"
            element={<WeatherPage language={language} />}
          />
          <Route
            path="resources"
            element={<DisasterResourcesPage language={language} />}
          />
          <Route
            path="notifications"
            element={<NotificationsPage language={language} />}
          />
          <Route
            path="profile"
            element={
              <UserProfilePage
                currentUser={currentUser}
                onUpdateUser={setCurrentUser}
                language={language}
              />
            }
          />
          <Route
            path="sos"
            element={<SOSPage currentUser={currentUser} language={language} />}
          />
          <Route
            path="report-disaster"
            element={<DisasterReportingPage currentUser={currentUser} language={language} />}
          />
          <Route
            path="evacuation"
            element={<EvacuationGuidancePage language={language} />}
          />
          <Route
            path="subscriptions"
            element={<LocationSubscriptionsPage language={language} />}
          />
        </Route>

        {/* Admin Portal Routes */}
        <Route
          path="/admin"
          element={
            <AdminLayout
              currentAdmin={currentAdmin}
              onAdminLogin={handleAdminLogin}
              onAdminLogout={handleAdminLogout}
            />
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="alerts" element={<AdminAlertsPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="contacts" element={<AdminContactsPage />} />
          <Route path="safe-zones" element={<AdminSafeZonesPage />} />
          <Route path="resources" element={<AdminResourcesPage />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="monitoring" element={<AdminMonitoringPage />} />
          <Route path="activity-logs" element={<AdminActivityLogsPage />} />
          <Route path="settings" element={<AdminSettingsPage currentAdmin={currentAdmin} />} />
        </Route>

        {/* Catch-All Redirect */}
        <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
