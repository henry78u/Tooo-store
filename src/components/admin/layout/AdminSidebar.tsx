import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Megaphone,
  Palette,
  Landmark,
  Truck,
  MessageSquare,
  Shield,
  Settings,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  X,
  AlertTriangle,
} from 'lucide-react';
import { useAdminStore } from '../../../store/useAdminStore';

interface AdminSidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  badge?: string | number;
}

interface NavGroup {
  name: string;
  icon: React.ReactNode;
  defaultExpanded?: boolean;
  items: NavItem[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const location = useLocation();
  const { notifications, products, orders, returnRequests } = useAdminStore();

  const lowStockCount = products.filter((p) => p.stock <= 5).length;
  const pendingOrdersCount = orders.filter((o) => o.deliveryStatus === 'Confirmed' || o.deliveryStatus === 'Processing').length;
  const pendingReturnsCount = returnRequests.filter((r) => r.status === 'Pending Review').length;

  // Track expanded groups
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Workspace: true,
    Commerce: true,
    Growth: false,
    Operations: false,
  });

  const toggleGroup = (name: string) => {
    setExpandedGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const navGroups: NavGroup[] = [
    {
      name: 'Workspace',
      icon: <LayoutDashboard className="w-4 h-4" />,
      items: [
        { label: 'Overview', href: '/admin' },
        { label: 'Sales Analytics', href: '/admin/analytics/sales' },
        { label: 'Product Analytics', href: '/admin/analytics/products' },
        { label: 'Customer Analytics', href: '/admin/analytics/customers' },
      ],
    },
    {
      name: 'Commerce',
      icon: <Package className="w-4 h-4" />,
      items: [
        { label: 'All Products', href: '/admin/products', badge: products.length },
        { label: 'Add Product', href: '/admin/products/new' },
        { label: 'Categories', href: '/admin/products/categories' },
        { label: 'Collections', href: '/admin/products/collections' },
        { label: 'Attributes', href: '/admin/products/attributes' },
        { label: 'Media Library', href: '/admin/products/media' },
        { label: 'Inventory Overview', href: '/admin/inventory' },
        { label: 'Low Stock & Alerts', href: '/admin/inventory/low-stock', badge: lowStockCount > 0 ? lowStockCount : undefined },
        { label: 'Stock Movements', href: '/admin/inventory/movements' },
        { label: 'All Orders', href: '/admin/orders', badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined },
        { label: 'Returns & Exchanges', href: '/admin/orders/returns', badge: pendingReturnsCount > 0 ? pendingReturnsCount : undefined },
        { label: 'Abandoned Checkouts', href: '/admin/orders/abandoned' },
        { label: 'All Customers', href: '/admin/customers' },
        { label: 'Customer Segments', href: '/admin/customers/segments' },
        { label: 'Customer Reviews', href: '/admin/customers/reviews' },
      ],
    },
    {
      name: 'Growth',
      icon: <Megaphone className="w-4 h-4" />,
      items: [
        { label: 'Discount Codes', href: '/admin/marketing/discounts' },
        { label: 'Campaigns', href: '/admin/marketing/campaigns' },
        { label: 'Email Subscribers', href: '/admin/marketing/subscribers' },
        { label: 'Promotional Banners', href: '/admin/marketing/banners' },
        { label: 'Homepage Editor', href: '/admin/storefront/homepage' },
        { label: 'Navigation & Footer', href: '/admin/storefront/navigation' },
        { label: 'Pages & Content', href: '/admin/storefront/pages' },
        { label: 'SEO Management', href: '/admin/storefront/seo' },
        { label: 'Transactions', href: '/admin/finance/transactions' },
        { label: 'Refunds', href: '/admin/finance/refunds' },
        { label: 'Financial Reports', href: '/admin/finance/reports' },
      ],
    },
    {
      name: 'Operations',
      icon: <Truck className="w-4 h-4" />,
      items: [
        { label: 'Deliveries', href: '/admin/shipping/deliveries' },
        { label: 'Zones & Rates', href: '/admin/shipping/zones' },
        { label: 'Customer Messages', href: '/admin/support/messages' },
        { label: 'Operational Alerts', href: '/admin/support/notifications' },
        { label: 'Staff & Permissions', href: '/admin/team/staff' },
        { label: 'Audit Logs', href: '/admin/team/audit-logs' },
        { label: 'General Settings', href: '/admin/settings/general' },
        { label: 'Checkout & Payments', href: '/admin/settings/checkout' },
        { label: 'Integrations', href: '/admin/settings/integrations' },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#171717] text-[#D8D0C5] border-r border-neutral-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-2 group">
          <span className="font-display font-extrabold text-xl text-white tracking-tighter">
            TOOO<span className="text-[#8A4735]">.</span>
          </span>
          <span className="text-[10px] font-bold tracking-widest text-[#D8D0C5] uppercase border border-neutral-700 px-1.5 py-0.5">
            Admin
          </span>
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1 text-neutral-400 hover:text-white"
            aria-label="Close admin menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Groups List */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {navGroups.map((group) => {
          const isExpanded = expandedGroups[group.name] !== false;
          return (
            <div key={group.name} className="space-y-1">
              {/* Group Toggle Header */}
              <button
                onClick={() => toggleGroup(group.name)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-neutral-400 hover:text-white uppercase tracking-wider transition-colors"
              >
                <div className="flex items-center gap-2">
                  {group.icon}
                  <span>{group.name}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                )}
              </button>

              {/* Group Nav Items */}
              {isExpanded && (
                <div className="space-y-0.5 pl-2 pt-1 border-l border-neutral-800 ml-3">
                  {group.items.map((item) => {
                    const isActive =
                      item.href === '/admin'
                        ? location.pathname === '/admin'
                        : location.pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={onCloseMobile}
                        className={`flex items-center justify-between px-3 py-1.5 text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-neutral-800 text-white font-semibold border-r-2 border-[#8A4735]'
                            : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {item.badge !== undefined && (
                          <span className="text-[10px] font-bold tabular-nums px-1.5 py-0.2 bg-neutral-800 text-neutral-300 border border-neutral-700">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer Link to Public Store */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-950/60">
        <Link
          to="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between p-2.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-medium text-white transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Storefront Preview</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-full h-full z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
