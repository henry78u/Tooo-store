import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowRight, Eye, EyeOff, UserCheck } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { AdminRole } from '../../types/admin';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsStaff, staffList } = useAdminStore();

  const [email, setEmail] = useState('adaeze@tooostore.example');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsStaff('Owner');
    navigate('/admin');
  };

  const handleQuickDemoLogin = (role: AdminRole) => {
    loginAsStaff(role);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#171717] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-neutral-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block group mb-3">
          <span className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tighter">
            TOOO<span className="text-[#8A4735]">.</span>
          </span>
          <span className="ml-2 text-xs font-bold uppercase tracking-widest text-[#D8D0C5] border border-neutral-700 px-2 py-0.5">
            Admin Portal
          </span>
        </Link>
        <h2 className="text-sm font-medium text-neutral-400">
          Atelier & Business Operations Console
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#1F1F1F] border border-neutral-800 py-8 px-6 shadow-2xl sm:px-10">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Staff Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#171717] border border-neutral-700 p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#8A4735]"
                placeholder="staff@tooostore.example"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Demo prototype: Select any quick role below to access the console.')}
                  className="text-[11px] text-[#8A4735] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#171717] border border-neutral-700 p-3 pr-10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#8A4735]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-[#8A4735]"
                />
                <span>Remember this terminal</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-white hover:bg-neutral-200 text-neutral-900 font-semibold text-xs uppercase tracking-wider py-3 px-4 transition-colors flex items-center justify-center gap-2"
            >
              <span>Authenticate Staff Terminal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-8 pt-6 border-t border-neutral-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2.5 text-center">
              Quick 1-Click Demo Profiles:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Owner')}
                className="p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-left transition-colors"
              >
                <span className="font-semibold text-white block text-xs">Adaeze Okoro</span>
                <span className="text-[10px] text-[#8A4735] font-semibold">Owner / Director</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Store Manager')}
                className="p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-left transition-colors"
              >
                <span className="font-semibold text-white block text-xs">Tunde Adeleke</span>
                <span className="text-[10px] text-emerald-400 font-semibold">Store Manager</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Fulfilment Staff')}
                className="p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-left transition-colors"
              >
                <span className="font-semibold text-white block text-xs">Ngozi Mensah</span>
                <span className="text-[10px] text-amber-400 font-semibold">Fulfilment Staff</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Support Staff')}
                className="p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-left transition-colors"
              >
                <span className="font-semibold text-white block text-xs">Kofi Asare</span>
                <span className="text-[10px] text-blue-400 font-semibold">Support Desk</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-[11px] text-neutral-500">
            <Link to="/" className="hover:text-white underline underline-offset-2">
              ← Return to Customer Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
