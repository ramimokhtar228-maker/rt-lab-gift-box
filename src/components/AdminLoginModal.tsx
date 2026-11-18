import { useState } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { AlertCircle, Check, Copy, ExternalLink, Lock, ShieldCheck, X } from 'lucide-react';
import { ADMIN_BOOTSTRAP_EMAIL, auth, FIREBASE_PROJECT_ID, googleProvider } from '../firebase';
import { copyToClipboard } from '../utils/whatsapp';

interface AdminLoginModalProps {
  isOpen: boolean;
  pendingActivateCode?: string | null;
  onClose: () => void;
  onAuthenticated: () => void;
}

export function AdminLoginModal({
  isOpen,
  pendingActivateCode,
  onClose,
  onAuthenticated,
}: AdminLoginModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setUnauthorizedDomain(null);

    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const email = cred.user.email?.toLowerCase();
      if (!email || !cred.user.emailVerified) {
        await signOut(auth);
        setError('يرجى استخدام حساب Google موثّق للوصول إلى لوحة الإدارة.');
        return;
      }
      if (email !== ADMIN_BOOTSTRAP_EMAIL.toLowerCase()) {
        await signOut(auth);
        setError(`هذا الحساب (${cred.user.email}) غير مصرح له بإدارة المعمل. الحساب المصرح: ${ADMIN_BOOTSTRAP_EMAIL}`);
        return;
      }
      onAuthenticated();
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      if (code === 'auth/unauthorized-domain') {
        const host = typeof window !== 'undefined' ? window.location.hostname : '';
        setUnauthorizedDomain(host);
        setError(
          `نطاق الاستضافة (${host}) غير مضاف بعد في قائمة النطاقات المصرح بها (Authorized domains) في Firebase.`
        );
      } else if (code === 'auth/popup-closed-by-user') {
        setError('تم إغلاق نافذة تسجيل الدخول قبل إتمام العملية.');
      } else {
        setError('تعذر تسجيل الدخول عبر Google. تأكد من السماح بالنوافذ المنبثقة وحاول مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-title"
    >
      <div className="w-full max-w-md rounded-3xl border border-[#C9962D]/40 bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5C1422]/10 text-[#5C1422]">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 id="admin-login-title" className="text-base font-extrabold text-slate-900">
                دخول إدارة المعمل
              </h2>
              <p className="text-xs text-slate-500">مزامنة سحابية لحظية لبيانات المرضى</p>
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

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#C9962D]/35 bg-[#FFF8EB] p-4 text-xs leading-relaxed text-slate-800">
            <div className="mb-1 flex items-center gap-1.5 font-extrabold text-[#5C1422]">
              <ShieldCheck className="h-4 w-4 text-[#B8860B]" />
              <span>تسجيل دخول آمن ومرتبط بقاعدة البيانات السحابية</span>
            </div>
            <p className="text-slate-700">
              سجّل الدخول بحساب المعمل المعتمد (
              <span dir="ltr" className="font-mono font-bold text-[#5C1422]">
                {ADMIN_BOOTSTRAP_EMAIL}
              </span>
              ) لعرض كافة المرضى الذين فتحوا صندوق الفرحة وتحديد مواعيدهم لحظياً.
            </p>
          </div>

          {error ? (
            <div className="space-y-2 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-900">
              <div className="flex items-start gap-2 font-semibold">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-700" />
                <span>{error}</span>
              </div>
              {unauthorizedDomain ? (
                <div className="space-y-2 border-t border-rose-200 pt-2 text-[11px] leading-relaxed text-rose-800">
                  <p className="font-bold">للتفعيل على هذا الرابط ({unauthorizedDomain}) خلال 10 ثوانٍ:</p>
                  <ol className="list-inside list-decimal space-y-1">
                    <li>افتح إعدادات Authentication في Firebase Console.</li>
                    <li>أضف النطاق التالي في Authorized domains:</li>
                  </ol>
                  <div className="flex items-center justify-between gap-2 rounded-lg bg-white px-2.5 py-1.5 font-mono text-slate-900">
                    <span dir="ltr">{unauthorizedDomain}</span>
                    <button
                      type="button"
                      onClick={async () => {
                        const ok = await copyToClipboard(unauthorizedDomain);
                        if (ok) {
                          setCopiedDomain(true);
                          window.setTimeout(() => setCopiedDomain(false), 1800);
                        }
                      }}
                      className="inline-flex items-center gap-1 font-sans font-bold text-[#5C1422] cursor-pointer"
                    >
                      {copiedDomain ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedDomain ? 'نُسخ' : 'نسخ'}</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <a
                      href={`https://console.firebase.google.com/project/${FIREBASE_PROJECT_ID}/authentication/settings`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-[#5C1422] underline"
                    >
                      <span>فتح إعدادات Firebase Console</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <a
                      href={`https://ais-pre-uktgxyai3tq7v64jdhupar-928451427848.europe-west2.run.app/?view=admin${
                        pendingActivateCode ? `&activate=${encodeURIComponent(pendingActivateCode)}` : ''
                      }`}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#5C1422] px-2.5 py-1.5 font-bold text-white hover:bg-[#7A1C2E]"
                    >
                      <span>أو افتح الإدارة فوراً من الرابط المعتمد</span>
                    </a>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-2xl bg-[#5C1422] px-5 py-3 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-[#7A1C2E] disabled:opacity-60 cursor-pointer"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"
              />
            </svg>
            <span>{loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول بحساب Google للإدارة'}</span>
          </button>

          {typeof window !== 'undefined' && window.location.hostname.endsWith('.github.io') ? (
            <a
              href={`https://ais-pre-uktgxyai3tq7v64jdhupar-928451427848.europe-west2.run.app/?view=admin${
                pendingActivateCode ? `&activate=${encodeURIComponent(pendingActivateCode)}` : ''
              }`}
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-[#FAF7F4] px-4 py-2.5 text-xs font-extrabold text-slate-800 transition-colors hover:bg-slate-100"
            >
              <ExternalLink className="h-4 w-4 text-[#5C1422]" />
              <span>الدخول الفوري عبر رابط الإدارة المعتمد</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
