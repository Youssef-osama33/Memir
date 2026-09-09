"use client";

import React, { useState } from "react";
import { User as UserType, WriterProfile, Role, Category } from "@prisma/client";
import { updateStaffMember, demoteToUser } from "../../app/admin/team/actions";
import { Search, ShieldCheck, BookOpen, MoreVertical, Edit, UserMinus } from "lucide-react";
import { CATEGORIES } from "../../lib/categories";

type StaffWithProfile = UserType & {
  writerProfile: WriterProfile | null;
};

export default function TeamManagement({ initialStaff }: { initialStaff: StaffWithProfile[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffWithProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openNewModal = () => {
    setEditingStaff(null);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (staff: StaffWithProfile) => {
    setEditingStaff(staff);
    setError(null);
    setIsModalOpen(true);
  };

  const handleDemote = async (userId: string) => {
    if (confirm("هل أنت متأكد من سحب صلاحيات هذا العضو وتحويله إلى مشترك عادي؟")) {
      await demoteToUser(userId);
      // Wait for revalidation
      window.location.reload();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      await updateStaffMember(formData);
      setIsModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء حفظ البيانات");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-md border border-neutral-200 shadow-sm">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="البحث عن كاتب (الاسم أو البريد)..."
            className="w-full text-xs py-2 pr-9 pl-3 border border-neutral-300 rounded-sm focus:outline-none focus:border-neutral-900"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-2.5" />
        </div>
        <button
          onClick={openNewModal}
          className="w-full sm:w-auto px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-sm hover:bg-black transition-colors shadow-sm"
        >
          + إضافة عضو / ترقية لكاتب
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialStaff.map((staff) => (
          <div key={staff.id} className="bg-white border border-neutral-200 rounded-md p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="absolute top-4 left-4">
              <div className="relative inline-block text-left">
                <button className="text-neutral-400 hover:text-neutral-900">
                  <MoreVertical className="w-4 h-4" />
                </button>
                {/* Dropdown - simple CSS hover for now */}
                <div className="hidden group-hover:block absolute left-0 mt-1 w-32 bg-white border border-neutral-200 shadow-lg rounded-sm z-10">
                  <button onClick={() => openEditModal(staff)} className="w-full text-right px-3 py-2 text-xs hover:bg-neutral-50 flex items-center gap-2">
                    <Edit className="w-3 h-3" /> تعديل الصلاحيات
                  </button>
                  <button onClick={() => handleDemote(staff.id)} className="w-full text-right px-3 py-2 text-xs text-red-600 hover:bg-red-50 border-t border-neutral-100 flex items-center gap-2">
                    <UserMinus className="w-3 h-3" /> سحب الصلاحيات
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-lg font-bold text-neutral-500 shrink-0">
                  {staff.name ? staff.name[0] : staff.email[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">{staff.name || "مستخدم بدون اسم"}</h3>
                  <p className="text-[10px] text-neutral-500 font-mono">{staff.email}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-sm ${staff.role === 'ADMIN' ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-neutral-100 text-neutral-700 border border-neutral-200'}`}>
                    {staff.role === 'ADMIN' ? <ShieldCheck className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                    {staff.role === 'ADMIN' ? 'مشرف عام' : 'كاتب'}
                  </span>
                  {staff.writerProfile?.title && (
                    <span className="text-[10px] text-neutral-600 font-medium">
                      • {staff.writerProfile.title}
                    </span>
                  )}
                </div>
                
                {staff.writerProfile?.assignedCategories && staff.writerProfile.assignedCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {staff.writerProfile.assignedCategories.map(cat => {
                      const categoryObj = CATEGORIES.find(c => c.id === cat);
                      return categoryObj ? (
                        <span key={cat} className="text-[9px] bg-neutral-50 border border-neutral-200 text-neutral-600 px-1.5 py-0.5 rounded-sm">
                          {categoryObj.title}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 text-[10px] text-neutral-400 flex justify-between">
              <span>انضم في: {new Date(staff.createdAt).toLocaleDateString('ar-EG')}</span>
              {staff.writerProfile?.authorSlug && (
                <span className="font-mono text-neutral-500">@{staff.writerProfile.authorSlug}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Edit / Add */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-md shadow-2xl w-full max-w-lg border border-neutral-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
              <h2 className="font-bold text-neutral-900">
                {editingStaff ? "تعديل بيانات الكاتب" : "ترقية مشترك إلى كاتب"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-black">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm mb-4">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">البريد الإلكتروني للمشترك</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editingStaff?.email || ""}
                  readOnly={!!editingStaff}
                  required
                  className={`w-full text-sm py-2 px-3 border border-neutral-300 rounded-sm focus:outline-none focus:border-neutral-900 ${editingStaff ? 'bg-neutral-100 text-neutral-500' : ''}`}
                  placeholder="user@example.com"
                />
                {!editingStaff && <p className="text-[10px] text-neutral-500 mt-1">يجب أن يكون المشترك مسجلاً في المنصة أولاً ليتم ترقيته.</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">الصلاحية</label>
                  <select name="role" defaultValue={editingStaff?.role || "WRITER"} className="w-full text-sm py-2 px-3 border border-neutral-300 rounded-sm focus:outline-none focus:border-neutral-900">
                    <option value="WRITER">كاتب (WRITER)</option>
                    <option value="ADMIN">مشرف عام (ADMIN)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">المسمى التحريري</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingStaff?.writerProfile?.title || ""}
                    className="w-full text-sm py-2 px-3 border border-neutral-300 rounded-sm focus:outline-none focus:border-neutral-900"
                    placeholder="مثال: باحث استراتيجي"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">رابط الملف التحريري العام (اختياري)</label>
                <input
                  type="text"
                  name="authorSlug"
                  defaultValue={editingStaff?.writerProfile?.authorSlug || ""}
                  className="w-full text-sm py-2 px-3 border border-neutral-300 rounded-sm focus:outline-none focus:border-neutral-900 font-mono text-left"
                  placeholder="john-doe"
                  dir="ltr"
                />
                <p className="text-[10px] text-neutral-500 mt-1">إذا تركته فارغاً، سيظل الكاتب يملك وصولاً إدارياً للمسودات دون ملف عام.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-2">التصنيفات المخصصة</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-neutral-200 rounded-sm bg-neutral-50">
                  {CATEGORIES.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="assignedCategories" 
                        value={cat.id} 
                        defaultChecked={editingStaff?.writerProfile?.assignedCategories.includes(cat.id as Category)}
                        className="rounded border-neutral-300 text-amber-600 focus:ring-amber-500 w-3 h-3"
                      />
                      <span className="text-xs text-neutral-700">{cat.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">نبذة عن الكاتب (تظهر في المقالات)</label>
                <textarea
                  name="bio"
                  rows={3}
                  defaultValue={editingStaff?.writerProfile?.bio || ""}
                  className="w-full text-sm py-2 px-3 border border-neutral-300 rounded-sm focus:outline-none focus:border-neutral-900 resize-none"
                  placeholder="نبذة مختصرة تظهر في ذيل مقالات الكاتب..."
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold text-neutral-600 hover:text-black">
                  إلغاء
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-neutral-900 text-white text-xs font-bold rounded-sm hover:bg-black transition-colors shadow-sm disabled:opacity-50">
                  {isSubmitting ? "جاري الحفظ..." : "حفظ الصلاحيات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
