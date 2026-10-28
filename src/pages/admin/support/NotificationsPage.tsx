import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { useAdminStore } from '../../../store/useAdminStore';
import { ShoppingBag, AlertTriangle, MessageSquare, Info, CheckCheck } from 'lucide-react';
import { OperationalNotification } from '../../../types/admin';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAdminStore();
  const [filter, setFilter] = useState<'all' | 'unread' | 'order' | 'inventory'>('all');

  const filtered = notifications.filter((n: OperationalNotification) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'order') return n.type === 'order';
    if (filter === 'inventory') return n.type === 'inventory';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-[#8A4735]" />;
      case 'inventory':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'payment':
        return <Info className="w-4 h-4 text-blue-600" />;
      default:
        return <Info className="w-4 h-4 text-[#77746F]" />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operational Notifications"
        subtitle="Live audit feed of store orders, low-stock thresholds, and security dispatches"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Support', href: '/admin/support/notifications' },
          { label: 'Notifications' },
        ]}
        actions={
          <button
            onClick={markAllNotificationsRead}
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#E9E7E3] bg-white text-xs font-mono uppercase tracking-wider text-[#171717] hover:bg-[#F6F3ED] transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All Read
          </button>
        }
      />

      <div className="bg-white border border-[#E9E7E3]">
        {/* Filter Bar */}
        <div className="p-3 border-b border-[#E9E7E3] bg-[#F6F3ED]/40 flex items-center gap-2">
          {(['all', 'unread', 'order', 'inventory'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-colors ${
                filter === t ? 'bg-[#171717] text-white' : 'bg-white border border-[#E9E7E3] text-[#77746F] hover:text-[#171717]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="divide-y divide-[#E9E7E3]">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-[#77746F] text-sm">
              No notifications found matching filter.
            </div>
          ) : (
            filtered.map((item: OperationalNotification) => (
              <div
                key={item.id}
                onClick={() => markNotificationRead(item.id)}
                className={`p-4 flex items-start justify-between gap-4 cursor-pointer transition-colors ${
                  !item.read ? 'bg-[#F6F3ED]/30 hover:bg-[#F6F3ED]/50' : 'bg-white hover:bg-[#F6F3ED]/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F6F3ED] border border-[#E9E7E3] flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-[#171717]">{item.title}</span>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-[#8A4735]" title="Unread" />
                      )}
                    </div>
                    <p className="text-xs text-[#77746F] mt-1">{item.message}</p>
                    <span className="text-[10px] font-mono text-[#77746F] mt-2 block">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 border border-[#E9E7E3] text-[#77746F]">
                    {item.type}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
