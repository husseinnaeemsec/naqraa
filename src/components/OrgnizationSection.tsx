import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store"
import api from "../api/client";
import { endpoints } from "../api/routes";
import { setUser } from "../store/authSlice";
import { ErrorNote, SectionHeader, Success } from "../pages/student/SettingsPage";

export default function OrganizationSection() {

    const dispatch = useAppDispatch();
    const {user} = useAppSelector((state)=>state.auth)


    // ----- Organization Settings -----
    // For Naqraa organizations (schools/colleges). If the user is an owner/admin, allow updating.
    const org = (user as any)?.organization || (user as any)?.profile?.organization || null;
    const [orgSaved, setOrgSaved] = useState(false);
    const [orgErr, setOrgErr] = useState<string | null>(null);
    const [orgLoading, setOrgLoading] = useState(false);
    const [orgName, setOrgName] = useState<string>(org?.name || "");
    const [orgAbout, setOrgAbout] = useState<string>(org?.about || "");
    const [orgWebsite, setOrgWebsite] = useState<string>(org?.website || "");
    const [orgLogo, setOrgLogo] = useState<File | null>(null);
    const orgLogoRef = useRef<HTMLInputElement>(null);

    const saveOrganization = async () => {
        setOrgSaved(false);
        setOrgErr(null);
        setOrgLoading(true);
        try {
            const form = new FormData();
            if (orgName) form.append("name", orgName);
            if (orgAbout) form.append("about", orgAbout);
            if (orgWebsite) form.append("website", orgWebsite);
            if (orgLogo) form.append("logo", orgLogo);

            // Adjust this endpoint to your API (e.g., endpoints.organization.update(org.id))
            const res = await api.post(endpoints.organization.settings, form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res?.data) {
                // If API returns updated user/org, refresh store
                dispatch(setUser(res.data.user || res.data));
            }
            setOrgSaved(true);
        } catch (err: any) {
            console.error(err);
            setOrgErr("تعذر حفظ إعدادات المؤسسة");
        } finally {
            setOrgLoading(false);
        }
    };

    return (
        <div id="orgnization" className="bg-white dark:bg-emerald-950 border dark:border-emerald-800 border-emerald-300 rounded-lg p-6 shadow-md">
            <SectionHeader icon={<i className="fi fi-rr-building text-2xl"></i>} title="إعدادات المؤسسة" />
            <div className="space-y-4">
                {orgSaved && <Success>تم حفظ إعدادات المؤسسة</Success>}
                {orgErr && <ErrorNote>{orgErr}</ErrorNote>}

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-100/70 mb-2">اسم المؤسسة</label>
                        <input
                            type="text"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            className="w-full px-4 py-2 border border-emerald-300 dark:border-emerald-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-100/70 mb-2">الموقع الإلكتروني</label>
                        <input
                            type="url"
                            value={orgWebsite}
                            onChange={(e) => setOrgWebsite(e.target.value)}
                            className="w-full px-4 py-2 border border-emerald-300 dark:border-emerald-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-100/70 mb-2">نبذة عن المؤسسة</label>
                        <textarea
                            rows={4}
                            value={orgAbout}
                            onChange={(e) => setOrgAbout(e.target.value)}
                            className="w-full px-4 py-2 border border-emerald-300 dark:border-emerald-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-100/70 mb-2">شعار المؤسسة</label>
                        <div className="flex items-center gap-4">
                            {orgLogo ? (
                                <img src={URL.createObjectURL(orgLogo)} className="w-16 h-16 rounded-xl object-cover" />
                            ) : (
                                <div className="w-16 h-16 rounded-xl bg-emerald-100 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-200">
                                    Logo
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => orgLogoRef.current?.click()}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                رفع الشعار
                            </button>
                            <input ref={orgLogoRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && setOrgLogo(e.target.files[0])} />
                        </div>
                    </div>
                </div>

                <button
                    onClick={saveOrganization}
                    disabled={orgLoading}
                    className="p-3 disabled:text-slate-500 disabled:cursor-not-allowed px-5 border text-emerald-500 dark:text-emerald-200 dark:hover:text-emerald-300 cursor-pointer rounded-md"
                >
                    {orgLoading ? "جارٍ الحفظ..." : "حفظ إعدادات المؤسسة"}
                </button>
            </div>
        </div>
    )
}