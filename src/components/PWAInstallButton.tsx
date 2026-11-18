import { CheckCircle2, Download, Laptop, Share, Smartphone, X } from 'lucide-react';
import type { AppLang } from '../types';
import { UI_COPY } from '../i18n/translations';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  lang: AppLang;
  variant?: 'header' | 'card';
}

export function PWAInstallButton({ lang, variant = 'header' }: PWAInstallButtonProps) {
  const {
    isInstalled,
    isIOS,
    canNativeInstall,
    showInstructionsModal,
    setShowInstructionsModal,
    promptInstall,
  } = usePWAInstall();

  const copy = UI_COPY[lang];

  if (isInstalled) {
    if (variant === 'header') return null;
    return (
      <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span>{copy.installedBadge}</span>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => void promptInstall()}
        className={
          variant === 'header'
            ? 'inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#C9962D]/50 bg-[#FFF8EB] px-3 py-1.5 text-xs font-extrabold text-[#5C1422] transition-colors hover:bg-[#FDEFD1] cursor-pointer whitespace-nowrap shrink-0'
            : 'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#5C1422] px-4 py-2.5 text-xs font-extrabold text-white shadow-xs transition-colors hover:bg-[#7A1C2E] cursor-pointer whitespace-nowrap'
        }
        title={copy.installApp}
      >
        <Download className="h-4 w-4 text-[#B8860B]" />
        <span>{copy.installApp}</span>
      </button>

      {showInstructionsModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setShowInstructionsModal(false)}
        >
          <div
            className="w-full max-w-md space-y-4 rounded-3xl border border-[#C9962D]/40 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#5C1422] text-[#C9962D]">
                  <Download className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {lang === 'en'
                      ? 'Install RT LAB Happiness Box'
                      : 'تثبيت تطبيق RT LAB Happiness Box'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'en'
                      ? 'Works online & offline on Mobile and Laptop'
                      : 'يعمل أونلاين وأوفلاين على الموبايل واللاب توب'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInstructionsModal(false)}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {isIOS ? (
              <div className="space-y-3 rounded-2xl border border-[#5C1422]/15 bg-[#FAF7F4] p-4 text-xs leading-relaxed text-slate-700">
                <div className="flex items-center gap-2 font-extrabold text-[#5C1422]">
                  <Smartphone className="h-4 w-4" />
                  <span>
                    {lang === 'en' ? 'iPhone / iPad (Safari)' : 'على الآيفون والآيباد (Safari)'}
                  </span>
                </div>
                <ol className="list-inside list-decimal space-y-1.5">
                  <li>
                    {lang === 'en'
                      ? 'Tap the Share button at the bottom of Safari'
                      : 'اضغط على زر المشاركة (Share) أسفل متصفح Safari'}
                    <Share className="mx-1 inline h-3.5 w-3.5 text-[#5C1422]" />
                  </li>
                  <li>
                    {lang === 'en'
                      ? 'Select "Add to Home Screen"'
                      : 'اختر "إضافة إلى الشاشة الرئيسية" (Add to Home Screen)'}
                  </li>
                  <li>
                    {lang === 'en'
                      ? 'Tap "Add" to install on your device'
                      : 'اضغط "إضافة" ليظهر التطبيق فوراً على شاشة هاتفك'}
                  </li>
                </ol>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2 rounded-2xl border border-[#5C1422]/15 bg-[#FAF7F4] p-4 text-xs leading-relaxed text-slate-700">
                  <div className="flex items-center gap-2 font-extrabold text-[#5C1422]">
                    <Smartphone className="h-4 w-4" />
                    <span>{lang === 'en' ? 'Android Mobile (Chrome)' : 'على هواتف أندرويد (Chrome)'}</span>
                  </div>
                  <p>
                    {lang === 'en'
                      ? 'Open the browser menu (⋮) -> select "Install App" or "Add to Home screen".'
                      : 'اضغط على قائمة المتصفح (⋮) بالأعلى -> اختر "تثبيت التطبيق" (Install App) أو "الإضافة إلى الشاشة الرئيسية".'}
                  </p>
                </div>

                <div className="space-y-2 rounded-2xl border border-[#C9962D]/35 bg-[#FFF8EB] p-4 text-xs leading-relaxed text-slate-700">
                  <div className="flex items-center gap-2 font-extrabold text-[#7A5600]">
                    <Laptop className="h-4 w-4" />
                    <span>{lang === 'en' ? 'Windows / Mac Laptop (Chrome / Edge)' : 'على اللاب توب والكمبيوتر (Chrome / Edge)'}</span>
                  </div>
                  <p>
                    {lang === 'en'
                      ? 'Click the Install icon inside the address bar on the right, or open Browser Menu -> Apps -> Install RT Happiness Box.'
                      : 'اضغط على أيقونة التثبيت داخل شريط العنوان بالأعلى، أو من قائمة المتصفح اختر "تثبيت التطبيق" لفتحه كبرنامج مستقل.'}
                  </p>
                </div>
              </div>
            )}

            {canNativeInstall ? (
              <button
                type="button"
                onClick={() => void promptInstall()}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#5C1422] px-4 py-2.5 text-xs font-extrabold text-white hover:bg-[#7A1C2E] cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>{copy.installApp}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowInstructionsModal(false)}
                className="flex min-h-[44px] w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                {lang === 'en' ? 'Got it' : 'حسناً'}
              </button>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
