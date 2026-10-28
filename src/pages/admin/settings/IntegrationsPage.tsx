import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { Layers, CheckCircle2, AlertCircle, RefreshCw, Key, ExternalLink } from 'lucide-react';

interface IntegrationService {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'connected' | 'disconnected' | 'testing';
  lastSync: string;
  apiKeyMask: string;
}

const initialIntegrations: IntegrationService[] = [
  {
    id: 'paystack',
    name: 'Paystack Payment Gateway',
    category: 'Payments',
    description: 'Enables cards, Apple Pay, USSD, and bank transfers across Nigeria & West Africa.',
    status: 'connected',
    lastSync: '10 minutes ago',
    apiKeyMask: 'pk_live_893******************fa9',
  },
  {
    id: 'cloudinary',
    name: 'Cloudinary CDN & Image Optimization',
    category: 'Media Assets',
    description: 'Automatic WebP conversion, dynamic fashion lookbook cropping, and fast CDN delivery.',
    status: 'connected',
    lastSync: '1 hour ago',
    apiKeyMask: 'cld_892******************01a',
  },
  {
    id: 'gig_logistics',
    name: 'GIG Logistics Automated Waybills',
    category: 'Shipping & Delivery',
    description: 'Automated tracking generation, driver pickup dispatches, and delivery status webhooks.',
    status: 'connected',
    lastSync: '25 minutes ago',
    apiKeyMask: 'gig_api_918******************99e',
  },
  {
    id: 'resend_email',
    name: 'Resend Transactional Mail',
    category: 'Communications',
    description: 'High-deliverability branded order confirmations and abandoned checkout notifications.',
    status: 'connected',
    lastSync: '5 minutes ago',
    apiKeyMask: 're_481******************bc2',
  },
  {
    id: 'meta_pixel',
    name: 'Meta Pixel & Conversions API',
    category: 'Marketing Analytics',
    description: 'Server-side purchase tracking and retargeting for Instagram and Facebook campaigns.',
    status: 'testing',
    lastSync: 'Yesterday',
    apiKeyMask: 'meta_px_110******************77x',
  },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [testingId, setTestingId] = useState<string | null>(null);

  const handleTestConnection = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'connected', lastSync: 'Just now' } : item))
      );
      setTestingId(null);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Third-Party Integrations"
        subtitle="Manage payment gateways, logistics APIs, media CDNs, and operational webhooks"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Settings', href: '/admin/settings/general' },
          { label: 'Integrations' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((item) => (
          <div key={item.id} className="bg-white border border-[#E9E7E3] p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#77746F] tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="font-semibold text-base text-[#171717] mt-0.5">{item.name}</h3>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 uppercase tracking-wider inline-flex items-center gap-1 ${
                    item.status === 'connected'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      item.status === 'connected' ? 'bg-emerald-600' : 'bg-amber-600'
                    }`}
                  />
                  {item.status}
                </span>
              </div>

              <p className="text-xs text-[#77746F] mt-2 leading-relaxed">{item.description}</p>

              <div className="mt-4 p-2.5 bg-[#F6F3ED] border border-[#E9E7E3] flex items-center justify-between text-xs">
                <span className="font-mono text-[#77746F] flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" />
                  {item.apiKeyMask}
                </span>
                <span className="font-mono text-[10px] text-[#77746F]">Sync: {item.lastSync}</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E9E7E3] flex items-center justify-between">
              <button
                onClick={() => handleTestConnection(item.id)}
                disabled={testingId === item.id}
                className="text-xs font-mono uppercase tracking-wider text-[#171717] hover:text-[#8A4735] inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingId === item.id ? 'animate-spin' : ''}`} />
                {testingId === item.id ? 'Testing...' : 'Test Connection'}
              </button>
              <button className="text-xs font-mono text-[#77746F] hover:text-[#171717] inline-flex items-center gap-1">
                Configure <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
