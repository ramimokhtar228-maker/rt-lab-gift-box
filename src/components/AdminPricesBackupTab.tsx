import { useMemo, useRef, useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  Plus,
  Save,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import type { AdminDashboardData, LabPriceItem } from '../types';
import { apiClient } from '../services/apiClient';

interface AdminPricesBackupTabProps {
  dashboardData: AdminDashboardData;
  onRefresh: () => Promise<void>;
  onNotify: (msg: string, isError?: boolean) => void;
}

export function AdminPricesBackupTab({
  dashboardData,
  onRefresh,
  onNotify,
}: AdminPricesBackupTabProps) {
  const { prices } = dashboardData;
  const [localPrices, setLocalPrices] = useState<LabPriceItem[]>(prices);
  const [dirty, setDirty] = useState(false);
  const [savingAll, setSavingAll] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNameAr, setNewNameAr] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newOfferPrice, setNewOfferPrice] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activePrices = dirty ? localPrices : prices;

  const filteredPrices = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q
      ? activePrices.filter(
          (p) =>
            p.nameAr.toLowerCase().includes(q) ||
            (p.nameEn || '').toLowerCase().includes(q) ||
            p.code.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        )
      : activePrices;
    return list.slice(0, 80);
  }, [activePrices, search]);

  const handleInlineChange = (id: string, field: 'price' | 'offerPrice', val: string) => {
    const source = dirty ? localPrices : prices;
    const numeric = val.trim() === '' ? undefined : Math.max(0, Number(val) || 0);
    const updated = source.map((item) => {
      if (item.id !== id) return item;
      if (field === 'price') {
        return { ...item, price: numeric ?? 0 };
      }
      return { ...item, offerPrice: numeric };
    });
    setLocalPrices(updated);
    setDirty(true);
  };

  const handleSaveAllPrices = async () => {
    setSavingAll(true);
    try {
      const data = await apiClient.bulkSavePrices(activePrices);
      if (!data.ok) {
        onNotify(data.message || 'تعذر حفظ الأسعار.', true);
      } else {
        setDirty(false);
        await onRefresh();
        onNotify('تم تثبيت وحفظ كافة الأسعار المعدلة في قاعدة البيانات السحابية.');
      }
    } catch {
      onNotify('تعذر الاتصال بقاعدة البيانات.', true);
    } finally {
      setSavingAll(false);
    }
  };

  const handleAddPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameAr.trim() || !newPrice) return;
    try {
      const data = await apiClient.upsertPriceItem({
        nameAr: newNameAr.trim(),
        code: newCode.trim() || undefined,
        price: Number(newPrice),
        offerPrice: newOfferPrice ? Number(newOfferPrice) : undefined,
      });
      if (data.ok) {
        setNewNameAr('');
        setNewCode('');
        setNewPrice('');
        setNewOfferPrice('');
        setShowAddForm(false);
        setDirty(false);
        await onRefresh();
        onNotify('تمت إضافة التحليل وتثبيت سعره.');
      } else {
        onNotify(data.message || 'تعذر الإضافة.', true);
      }
    } catch {
      onNotify('تعذر الاتصال بقاعدة البيانات.', true);
    }
  };

  const handleDeletePrice = async (id: string) => {
    try {
      const ok = await apiClient.deletePriceItem(id);
      if (ok) {
        setDirty(false);
        await onRefresh();
        onNotify('تم حذف التحليل.');
      }
    } catch {
      onNotify('تعذر الحذف.', true);
    }
  };

  const handleExportFullBackup = async () => {
    setExporting(true);
    try {
      const data = await apiClient.exportFullBackup(dashboardData);
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rt-lab-happiness-box-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onNotify('تم تصدير وحفظ النسخة الاحتياطية الكاملة بنجاح.');
    } catch {
      onNotify('حدث خطأ أثناء التصدير.', true);
    } finally {
      setExporting(false);
    }
  };

  const handleExportPricesCsv = () => {
    const header = 'الكود,اسم التحليل,English Name,القسم,السعر,سعر العرض';
    const rows = activePrices.map((p) =>
      [
        `"${(p.code || '').replace(/"/g, '""')}"`,
        `"${(p.nameAr || '').replace(/"/g, '""')}"`,
        `"${(p.nameEn || '').replace(/"/g, '""')}"`,
        `"${(p.category || '').replace(/"/g, '""')}"`,
        p.price,
        p.offerPrice ?? '',
      ].join(',')
    );
    const csv = `\uFEFF${[header, ...rows].join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rt-lab-prices-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onNotify('تم تصدير قائمة الأسعار إلى ملف Excel (CSV).');
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Record<string, unknown>;
      const data = await apiClient.importFullBackup(parsed);
      if (!data.ok) {
        onNotify(data.message || 'فشل استيراد الملف.', true);
      } else {
        setDirty(false);
        await onRefresh();
        onNotify(
          `تم الاستيراد والمزامنة السحابية (${data.importedCounts?.prizes ?? 0} جائزة، ${data.importedCounts?.links ?? 0} رابط، ${data.importedCounts?.prices ?? 0} تحليل).`
        );
      }
    } catch {
      onNotify('ملف JSON غير صالح أو تعذر قراءته.', true);
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Export / Import Full Backup */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              النسخ الاحتياطي وتصدير/استيراد البيانات الكاملة
            </h2>
            <p className="text-xs text-slate-500">
              احفظ نسخة JSON شاملة (بيانات المعمل، الشعار، الجوائز، الروابط، وقائمة الأسعار) أو استعد نسخة سابقة.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={exporting}
              onClick={handleExportFullBackup}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-teal-700 px-4 py-2 text-xs font-extrabold text-white hover:bg-teal-800 cursor-pointer whitespace-nowrap"
            >
              <Download className="h-4 w-4" />
              <span>{exporting ? 'جاري التصدير...' : 'حفظ نسخة احتياطية كاملة (JSON)'}</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleImportFile}
              className="hidden"
            />
            <button
              type="button"
              disabled={importing}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
            >
              <Upload className="h-4 w-4" />
              <span>{importing ? 'جاري الاستيراد...' : 'استيراد نسخة (JSON)'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportPricesCsv}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer whitespace-nowrap"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>تصدير الأسعار CSV</span>
            </button>
          </div>
        </div>
      </section>

      {/* Price List Editor */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              قائمة أسعار التحاليل ({activePrices.length} تحليل)
            </h3>
            <p className="text-xs text-slate-500">
              عدّل أي سعر مباشرة ثم اضغط &quot;تثبيت وحفظ الأسعار&quot; لحفظ التعديلات نهائياً.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm((v) => !v)}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 cursor-pointer whitespace-nowrap"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>إضافة تحليل</span>
            </button>
            <button
              type="button"
              onClick={handleSaveAllPrices}
              disabled={savingAll}
              className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-extrabold text-white cursor-pointer whitespace-nowrap ${
                dirty ? 'bg-amber-600 hover:bg-amber-700' : 'bg-slate-900 hover:bg-slate-800'
              }`}
            >
              <Save className="h-3.5 w-3.5" />
              <span>{savingAll ? 'جاري التثبيت...' : dirty ? 'تثبيت وحفظ التعديلات الآن' : 'تثبيت وحفظ الأسعار'}</span>
            </button>
          </div>
        </div>

        {showAddForm ? (
          <form
            onSubmit={handleAddPrice}
            className="grid grid-cols-1 gap-3 rounded-xl border border-teal-200 bg-teal-50/40 p-4 sm:grid-cols-5"
          >
            <input
              type="text"
              required
              value={newNameAr}
              onChange={(e) => setNewNameAr(e.target.value)}
              placeholder="اسم التحليل *"
              className="sm:col-span-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-teal-700 focus:outline-none"
            />
            <input
              type="text"
              dir="ltr"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="الكود (اختياري)"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs focus:border-teal-700 focus:outline-none"
            />
            <input
              type="number"
              required
              min={0}
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="السعر (ج.م) *"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-center font-mono text-xs focus:border-teal-700 focus:outline-none"
            />
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                value={newOfferPrice}
                onChange={(e) => setNewOfferPrice(e.target.value)}
                placeholder="سعر العرض"
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-center font-mono text-xs focus:border-teal-700 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-teal-700 px-3 py-2 text-xs font-bold text-white hover:bg-teal-800 cursor-pointer"
              >
                إضافة
              </button>
            </div>
          </form>
        ) : null}

        <div className="relative">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث باسم التحليل بالعربي أو الإنجليزي أو الكود..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-10 pl-4 text-xs text-slate-900 focus:border-teal-700 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2.5 pl-3 font-bold">الكود</th>
                <th className="py-2.5 px-3 font-bold">اسم التحليل</th>
                <th className="py-2.5 px-3 font-bold">السعر الأساسي (ج.م)</th>
                <th className="py-2.5 px-3 font-bold">سعر العرض (اختياري)</th>
                <th className="py-2.5 pr-3 font-bold">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPrices.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td dir="ltr" className="py-2.5 pl-3 font-mono text-slate-500 tabular-nums whitespace-nowrap">
                    {item.code}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900">{item.nameAr}</div>
                    {item.nameEn ? (
                      <div className="text-[11px] text-slate-400">{item.nameEn}</div>
                    ) : null}
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      min={0}
                      value={item.price}
                      onChange={(e) => handleInlineChange(item.id, 'price', e.target.value)}
                      className="w-24 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-center font-mono font-bold text-slate-900 tabular-nums focus:border-teal-700 focus:outline-none"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      min={0}
                      value={item.offerPrice ?? ''}
                      placeholder="—"
                      onChange={(e) => handleInlineChange(item.id, 'offerPrice', e.target.value)}
                      className="w-24 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-center font-mono font-bold text-teal-800 tabular-nums focus:border-teal-700 focus:outline-none"
                    />
                  </td>
                  <td className="py-2.5 pr-3">
                    <button
                      type="button"
                      onClick={() => handleDeletePrice(item.id)}
                      title="حذف التحليل"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {activePrices.length > 80 && !search.trim() ? (
            <p className="mt-3 text-center text-[11px] text-slate-400">
              يتم عرض أول 80 تحليل — استخدم مربع البحث للوصول السريع لأي تحليل من أصل {activePrices.length} تحليل.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
