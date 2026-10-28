import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Package, ShoppingBag, Users, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useAdminStore } from '../../../store/useAdminStore';
import { formatNaira } from '../../../store/useStore';

interface AdminSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSearchModal: React.FC<AdminSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { products, orders, customers } = useAdminStore();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchingProducts = q
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.slug.toLowerCase().includes(q)
        )
        .slice(0, 4)
    : [];

  const matchingOrders = q
    ? orders
        .filter(
          (o) =>
            o.orderReference.toLowerCase().includes(q) ||
            o.address.fullName.toLowerCase().includes(q) ||
            o.address.email.toLowerCase().includes(q)
        )
        .slice(0, 3)
    : [];

  const matchingCustomers = q
    ? customers
        .filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.phone.toLowerCase().includes(q)
        )
        .slice(0, 3)
    : [];

  const hasResults =
    matchingProducts.length > 0 || matchingOrders.length > 0 || matchingCustomers.length > 0;

  const handleNavigate = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white border border-[#E9E7E3] shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E9E7E3] flex items-center gap-3 bg-[#FAF8F5]">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, orders, clients, or SKU..."
            className="flex-1 bg-transparent text-sm sm:text-base text-neutral-900 placeholder-neutral-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-neutral-400 hover:text-neutral-700"
            >
              Clear
            </button>
          )}
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {!query ? (
            <div className="py-8 text-center text-xs text-neutral-400">
              Type to search across the TOOO STORE database...
            </div>
          ) : !hasResults ? (
            <div className="py-8 text-center text-xs text-neutral-500">
              No results found for "{query}".
            </div>
          ) : (
            <>
              {/* Products */}
              {matchingProducts.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider px-2">
                    Products
                  </span>
                  {matchingProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleNavigate(`/admin/products/${p.id}/edit`)}
                      className="flex items-center justify-between p-2.5 hover:bg-[#FAF8F5] cursor-pointer border border-transparent hover:border-[#E9E7E3] text-xs transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Package className="w-4 h-4 text-[#8A4735]" />
                        <div>
                          <span className="font-semibold text-neutral-900">{p.name}</span>
                          <span className="text-neutral-500 block text-[11px]">
                            {p.category} · {formatNaira(p.price)} · {p.stock} in stock
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Orders */}
              {matchingOrders.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider px-2">
                    Orders
                  </span>
                  {matchingOrders.map((o) => (
                    <div
                      key={o.orderReference}
                      onClick={() => handleNavigate(`/admin/orders/${o.orderReference}`)}
                      className="flex items-center justify-between p-2.5 hover:bg-[#FAF8F5] cursor-pointer border border-transparent hover:border-[#E9E7E3] text-xs transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <ShoppingBag className="w-4 h-4 text-neutral-700" />
                        <div>
                          <span className="font-semibold text-neutral-900">{o.orderReference}</span>
                          <span className="text-neutral-500 block text-[11px]">
                            {o.address.fullName} · {formatNaira(o.total)} · {o.deliveryStatus}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Customers */}
              {matchingCustomers.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider px-2">
                    Customers
                  </span>
                  {matchingCustomers.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => handleNavigate(`/admin/customers/${c.id}`)}
                      className="flex items-center justify-between p-2.5 hover:bg-[#FAF8F5] cursor-pointer border border-transparent hover:border-[#E9E7E3] text-xs transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-neutral-700" />
                        <div>
                          <span className="font-semibold text-neutral-900">{c.name}</span>
                          <span className="text-neutral-500 block text-[11px]">
                            {c.email} · {c.totalOrders} orders · {formatNaira(c.totalSpent)}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-[#FAF8F5] border-t border-[#E9E7E3] flex items-center justify-between text-[11px] text-neutral-500">
          <span>Search across TOOO Store database</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 text-[10px] rounded">ESC</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
};
