import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { Plus, Edit2, Trash2, MapPin, Check, Save } from 'lucide-react';

interface ShippingZone {
  id: string;
  name: string;
  regions: string[];
  baseFee: number;
  freeAboveThreshold: number | null;
  estimatedDays: string;
  isActive: boolean;
}

const initialZones: ShippingZone[] = [
  {
    id: 'zone-1',
    name: 'Lagos Island & Lekki-Ikoyi Corridor',
    regions: ['Ikoyi', 'Victoria Island', 'Lekki Phase 1', 'Banana Island', 'Ajah'],
    baseFee: 3500,
    freeAboveThreshold: 100000,
    estimatedDays: 'Same-day to 24 hrs',
    isActive: true,
  },
  {
    id: 'zone-2',
    name: 'Lagos Mainland & Environs',
    regions: ['Ikeja', 'Yaba', 'Surulere', 'Maryland', 'Gbagada', 'Festac'],
    baseFee: 4000,
    freeAboveThreshold: 100000,
    estimatedDays: '1 - 2 business days',
    isActive: true,
  },
  {
    id: 'zone-3',
    name: 'Abuja Federal Capital Territory',
    regions: ['Maitama', 'Asokoro', 'Wuse II', 'Garki', 'Jabi'],
    baseFee: 6500,
    freeAboveThreshold: 150000,
    estimatedDays: '2 - 3 business days',
    isActive: true,
  },
  {
    id: 'zone-4',
    name: 'Port Harcourt & South-South',
    regions: ['Rivers', 'Delta', 'Akwa Ibom', 'Edo'],
    baseFee: 7500,
    freeAboveThreshold: 150000,
    estimatedDays: '3 - 4 business days',
    isActive: true,
  },
  {
    id: 'zone-5',
    name: 'Rest of Nigeria (Standard Domestic)',
    regions: ['Kano', 'Kaduna', 'Enugu', 'Oyo', 'Ogun', 'All Other States'],
    baseFee: 8000,
    freeAboveThreshold: 200000,
    estimatedDays: '3 - 5 business days',
    isActive: true,
  },
  {
    id: 'zone-6',
    name: 'International Air Courier (DHL)',
    regions: ['United Kingdom', 'United States', 'Ghana', 'Canada', 'Europe'],
    baseFee: 45000,
    freeAboveThreshold: 500000,
    estimatedDays: '4 - 7 business days',
    isActive: true,
  },
];

export default function ShippingZonesPage() {
  const [zones, setZones] = useState<ShippingZone[]>(initialZones);
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ShippingZone>>({});

  const handleEdit = (zone: ShippingZone) => {
    setEditingZoneId(zone.id);
    setEditForm({ ...zone });
  };

  const handleSave = (id: string) => {
    setZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, ...(editForm as ShippingZone) } : z))
    );
    setEditingZoneId(null);
  };

  const handleToggle = (id: string) => {
    setZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, isActive: !z.isActive } : z))
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shipping Zones & Rates"
        subtitle="Configure logistics tariff tiers, free delivery thresholds, and delivery windows"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Shipping', href: '/admin/shipping/deliveries' },
          { label: 'Zones & Rates' },
        ]}
      />

      <div className="grid grid-cols-1 gap-4">
        {zones.map((zone) => {
          const isEditing = editingZoneId === zone.id;

          return (
            <div
              key={zone.id}
              className={`bg-white border transition-colors ${
                zone.isActive ? 'border-[#E9E7E3]' : 'border-[#E9E7E3] opacity-60 bg-[#F6F3ED]/30'
              } p-5`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[#8A4735]" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="font-medium text-base text-[#171717] border border-[#E9E7E3] px-2 py-1"
                      />
                    ) : (
                      <h3 className="font-medium text-base text-[#171717]">{zone.name}</h3>
                    )}
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 uppercase tracking-wider ${
                        zone.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {zone.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  <p className="text-xs text-[#77746F]">
                    Covered: {zone.regions.join(', ')}
                  </p>
                </div>

                {/* Rates & Actions */}
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#77746F] block">Flat Rate</span>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editForm.baseFee || 0}
                        onChange={(e) => setEditForm({ ...editForm, baseFee: Number(e.target.value) })}
                        className="font-mono font-bold text-sm text-[#171717] border border-[#E9E7E3] px-2 py-0.5 w-28"
                      />
                    ) : (
                      <span className="font-mono font-bold text-base text-[#171717]">
                        ₦{zone.baseFee.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#77746F] block">Free Threshold</span>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editForm.freeAboveThreshold || 0}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            freeAboveThreshold: e.target.value ? Number(e.target.value) : null,
                          })
                        }
                        className="font-mono text-sm text-[#171717] border border-[#E9E7E3] px-2 py-0.5 w-28"
                      />
                    ) : (
                      <span className="font-mono text-xs text-[#77746F]">
                        {zone.freeAboveThreshold ? `Orders > ₦${zone.freeAboveThreshold.toLocaleString()}` : 'None'}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#77746F] block">Transit Window</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.estimatedDays || ''}
                        onChange={(e) => setEditForm({ ...editForm, estimatedDays: e.target.value })}
                        className="font-mono text-xs text-[#171717] border border-[#E9E7E3] px-2 py-0.5 w-36"
                      />
                    ) : (
                      <span className="font-mono text-xs text-[#171717]">{zone.estimatedDays}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <button
                        onClick={() => handleSave(zone.id)}
                        className="p-1.5 bg-[#171717] text-white hover:bg-black transition-colors"
                        title="Save changes"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(zone)}
                        className="p-1.5 text-[#77746F] hover:text-[#171717] hover:bg-[#F6F3ED] transition-colors"
                        title="Edit zone"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleToggle(zone.id)}
                      className="text-xs px-2.5 py-1 border border-[#E9E7E3] hover:border-[#171717] font-mono text-[#77746F] transition-colors"
                    >
                      {zone.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
