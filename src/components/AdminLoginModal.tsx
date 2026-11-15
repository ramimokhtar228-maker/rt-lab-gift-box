import { useState } from 'react';
import { Eye, EyeOff, Lock, X } from 'lucide-react';
import { apiClient } from '../services/apiClient';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (token: string) => void;
}

export function AdminLoginModal({
  isOpen,
  onClose,
  onAuthenticated,
}: AdminLoginModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.adminLogin(password);
      if (!data.ok || !data.token) {
        setError(data.message || 'كلمة المرور غير صحيحة.');
      } else {
        setPassword('');
        onAuthenticated(data.token);
      }
    } catch {
      setError('تعذر الاتصال بالخادم.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-title"
    >
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 id="admin-login-title" className="text-base font-extrabold text-slate-900">
                دخول الإدارة
              </h2>
              <p className="text-xs text-slate-500">مخصص لمسؤول المعمل فقط</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-password-input"
              className="mb-1.5 block text-xs font-bold text-slate-700"
            >
              كلمة مرور الإدارة
            </label>
            <div className="relative">
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                autoFocus
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pr-3.5 pl-11 text-left font-mono text-sm text-slate-900 focus:border-teal-700 focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                className="absolute inset-y-0 left-0 flex w-10 items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="flex min-h-[46px] w-full items-center justify-center rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-extrabold text-white transition-colors hover:bg-teal-800 disabled:opacity-60 cursor-pointer"
          >
            {loading ? 'جاري التحقق...' : 'دخول لوحة الإدارة'}
          </button>
        </form>
      </div>
    </div>
  );
}
