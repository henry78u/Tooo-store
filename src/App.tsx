/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Storefront Chrome Components
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { MobileNavigation } from './components/layout/MobileNavigation';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/commerce/CartDrawer';
import { QuickAddModal } from './components/commerce/QuickAddModal';
import { SearchOverlay } from './components/commerce/SearchOverlay';
import { ToastContainer } from './components/ui/ToastContainer';

// Storefront Customer Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { WishlistPage } from './pages/WishlistPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { AboutPage } from './pages/AboutPage';

// Admin Architecture
import { AdminLayout } from './components/admin/layout/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminOverviewPage } from './pages/admin/overview/AdminOverviewPage';

// Admin Analytics
import { SalesAnalyticsPage } from './pages/admin/analytics/SalesAnalyticsPage';
import { ProductAnalyticsPage } from './pages/admin/analytics/ProductAnalyticsPage';
import { CustomerAnalyticsPage } from './pages/admin/analytics/CustomerAnalyticsPage';

// Admin Products
import { AllProductsPage } from './pages/admin/products/AllProductsPage';
import { AddProductPage } from './pages/admin/products/AddProductPage';
import { CategoriesPage } from './pages/admin/products/CategoriesPage';
import { CollectionsPage as AdminCollectionsPage } from './pages/admin/products/CollectionsPage';
import { AttributesPage } from './pages/admin/products/AttributesPage';
import { MediaLibraryPage } from './pages/admin/products/MediaLibraryPage';

// Admin Inventory
import { InventoryOverviewPage } from './pages/admin/inventory/InventoryOverviewPage';
import { LowStockPage } from './pages/admin/inventory/LowStockPage';
import { StockMovementsPage } from './pages/admin/inventory/StockMovementsPage';

// Admin Orders
import { AllOrdersPage } from './pages/admin/orders/AllOrdersPage';
import { OrderDetailsPage } from './pages/admin/orders/OrderDetailsPage';
import { ReturnsPage } from './pages/admin/orders/ReturnsPage';
import { AbandonedCheckoutsPage } from './pages/admin/orders/AbandonedCheckoutsPage';

// Admin Customers
import { AllCustomersPage } from './pages/admin/customers/AllCustomersPage';
import { CustomerSegmentsPage } from './pages/admin/customers/CustomerSegmentsPage';
import { CustomerReviewsPage } from './pages/admin/customers/CustomerReviewsPage';

// Admin Marketing
import { DiscountsPage } from './pages/admin/marketing/DiscountsPage';
import { CampaignsPage } from './pages/admin/marketing/CampaignsPage';
import { SubscribersPage } from './pages/admin/marketing/SubscribersPage';
import { BannersPage } from './pages/admin/marketing/BannersPage';

// Admin Storefront CMS
import { HomepageEditorPage } from './pages/admin/storefront/HomepageEditorPage';
import { NavigationFooterPage } from './pages/admin/storefront/NavigationFooterPage';
import { PagesContentPage } from './pages/admin/storefront/PagesContentPage';
import { SeoManagementPage } from './pages/admin/storefront/SeoManagementPage';

// Admin Finance
import { TransactionsPage } from './pages/admin/finance/TransactionsPage';
import RefundsPage from './pages/admin/finance/RefundsPage';
import FinancialReportsPage from './pages/admin/finance/FinancialReportsPage';

// Admin Shipping
import DeliveriesPage from './pages/admin/shipping/DeliveriesPage';
import ShippingZonesPage from './pages/admin/shipping/ShippingZonesPage';

// Admin Support
import MessagesPage from './pages/admin/support/MessagesPage';
import NotificationsPage from './pages/admin/support/NotificationsPage';

// Admin Team
import StaffManagementPage from './pages/admin/team/StaffManagementPage';
import AuditLogsPage from './pages/admin/team/AuditLogsPage';

// Admin Settings
import GeneralSettingsPage from './pages/admin/settings/GeneralSettingsPage';
import CheckoutSettingsPage from './pages/admin/settings/CheckoutSettingsPage';
import IntegrationsPage from './pages/admin/settings/IntegrationsPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#171717] selection:bg-[#171717] selection:text-white">
      {/* Customer Storefront Chrome - Hidden when viewing Admin routes */}
      {!isAdminRoute && (
        <>
          <AnnouncementBar />
          <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
          <MobileNavigation
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        </>
      )}

      {/* Main Dynamic View Area */}
      <main className="flex-1">
        <Routes>
          {/* Customer Facing Storefront */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:slug" element={<ProductDetailsPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:slug" element={<CollectionsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/track-order" element={<OrderTrackingPage />} />

          {/* Admin Authentication Terminal */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Comprehensive Admin Dashboard Workspace */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverviewPage />} />

            {/* Analytics */}
            <Route path="analytics/sales" element={<SalesAnalyticsPage />} />
            <Route path="analytics/products" element={<ProductAnalyticsPage />} />
            <Route path="analytics/customers" element={<CustomerAnalyticsPage />} />

            {/* Products */}
            <Route path="products" element={<AllProductsPage />} />
            <Route path="products/new" element={<AddProductPage />} />
            <Route path="products/:id/edit" element={<AddProductPage />} />
            <Route path="products/categories" element={<CategoriesPage />} />
            <Route path="products/collections" element={<AdminCollectionsPage />} />
            <Route path="products/attributes" element={<AttributesPage />} />
            <Route path="products/media" element={<MediaLibraryPage />} />

            {/* Inventory */}
            <Route path="inventory" element={<InventoryOverviewPage />} />
            <Route path="inventory/low-stock" element={<LowStockPage />} />
            <Route path="inventory/movements" element={<StockMovementsPage />} />

            {/* Orders */}
            <Route path="orders" element={<AllOrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailsPage />} />
            <Route path="orders/returns" element={<ReturnsPage />} />
            <Route path="orders/abandoned" element={<AbandonedCheckoutsPage />} />

            {/* Customers */}
            <Route path="customers" element={<AllCustomersPage />} />
            <Route path="customers/segments" element={<CustomerSegmentsPage />} />
            <Route path="customers/reviews" element={<CustomerReviewsPage />} />

            {/* Marketing */}
            <Route path="marketing/discounts" element={<DiscountsPage />} />
            <Route path="marketing/campaigns" element={<CampaignsPage />} />
            <Route path="marketing/subscribers" element={<SubscribersPage />} />
            <Route path="marketing/banners" element={<BannersPage />} />

            {/* Storefront CMS */}
            <Route path="storefront/homepage" element={<HomepageEditorPage />} />
            <Route path="storefront/navigation" element={<NavigationFooterPage />} />
            <Route path="storefront/pages" element={<PagesContentPage />} />
            <Route path="storefront/seo" element={<SeoManagementPage />} />

            {/* Finance */}
            <Route path="finance/transactions" element={<TransactionsPage />} />
            <Route path="finance/refunds" element={<RefundsPage />} />
            <Route path="finance/reports" element={<FinancialReportsPage />} />

            {/* Shipping */}
            <Route path="shipping/deliveries" element={<DeliveriesPage />} />
            <Route path="shipping/zones" element={<ShippingZonesPage />} />

            {/* Support */}
            <Route path="support/messages" element={<MessagesPage />} />
            <Route path="support/notifications" element={<NotificationsPage />} />

            {/* Team */}
            <Route path="team/staff" element={<StaffManagementPage />} />
            <Route path="team/audit-logs" element={<AuditLogsPage />} />

            {/* Settings */}
            <Route path="settings/general" element={<GeneralSettingsPage />} />
            <Route path="settings/checkout" element={<CheckoutSettingsPage />} />
            <Route path="settings/integrations" element={<IntegrationsPage />} />

            {/* Fallback to Overview */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>

          {/* Catch-all customer fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Customer Commerce Overlays */}
      {!isAdminRoute && (
        <>
          <CartDrawer />
          <QuickAddModal />
          <SearchOverlay />
          <Footer />
        </>
      )}

      {/* Global Feedback Toasts */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}
