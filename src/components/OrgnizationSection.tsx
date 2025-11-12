import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import api from "../api/client";
import { SectionHeader, Success, ErrorNote } from "../pages/student/SettingsPage";
import type { Organization } from "../../types";
import { t } from "i18next";



export default function OrganizationSection() {
    const { user } = useAppSelector((state) => state.auth);

    const [orgList, setOrgList] = useState<Organization[]>([]);
    const [orgSearch, setOrgSearch] = useState("");
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const userOrg = user?.profile?.organization || null;

    // Fetch organizations for search
    useEffect(() => {
        if (orgSearch.length < 1) { setSelectedOrg(null); return };

        api.get('/organizations/?search=' + orgSearch)
            .then((res) => {
                setOrgList(res.data)
            })
            .catch((e) => {
                console.log(e)
            })

    }, [orgSearch]);

    const sendJoinRequest = async () => {

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const form = new FormData();
            form.append("organization_id", String(selectedOrg?.id));
            await api.post("/organizations/join/", form, { headers: { 'Content-Type': "multipart/form-data" } });
            setSuccess(true);
        } catch (err:any) {
            setError(err?.response?.data?.error || "فشل إرسال الطلب، حاول مرة أخرى");
        } finally {
            setLoading(false);
        }
    };

    const renderForm = !user?.profile?.organization && !user?.profile?.organization_request_sent;
    const requestSent = !user?.profile?.organization && user?.profile?.organization_request_sent;
    

    return (
        <div className="bg-white dark:bg-emerald-950 border dark:border-emerald-800 border-emerald-300 rounded-lg p-6 shadow-md">
            <SectionHeader icon={<i className="fi fi-rr-building text-2xl"></i>} title={t("settings.organization.title")} />
            <div id="organization" className="space-y-4">
                {
                    renderForm && (
                        <div className="space-y-4">
                            {success && <Success> {t("settings.organization.join_request_sent")} </Success>}
                            {error && <ErrorNote>{error}</ErrorNote>}

                            {/* 🔹 Organization Search (shadcn Command) */}
                            <div>
                                <input className="p-2 rounded-md border w-full" placeholder={t("settings.organization.search_for_org")} type="text" onChange={(e) => { setOrgSearch(e.currentTarget.value) }} />
                                <div className="mt-5 space-y-2">
                                    <p className="text-slate-400 text-sm"> {orgList.length > 0 ? t("settings.organization.plural") : t("settings.organization.no_org_found")} </p>
                                    {
                                        orgList.map((org) => {
                                            return (
                                                <li onClick={() => { if (selectedOrg?.id === org.id) { setSelectedOrg(null) } else { setSelectedOrg(org) } }} key={org.id}
                                                    className={` ${selectedOrg?.id === org.id ? 'bg-emerald-50 outline-2  outline-emerald-300 text-emerald-950' : ''} list-none c p-2 cursor-pointer flex items-center gap-2 border rounded-md px-3`}
                                                >
                                                    {org.name}
                                                </li>)
                                        })
                                    }
                                </div>
                            </div>

                            {/* 🔹 Send Request Button */}
                            <button
                                onClick={sendJoinRequest}
                                disabled={loading || !selectedOrg}
                                className="px-5 py-3 border text-white disabled:bg-transparent cursor-pointer bg-emerald-500 dark:text-emerald-200 rounded-md disabled:text-slate-500 disabled:cursor-not-allowed"
                            >
                                {loading ? t("settings.organization.sending") : t("settings.organization.send_join_request")}
                            </button>
                        </div>
                    )
                }
                {
                    requestSent && (
                        <div className="p-2 flex items-center gap-2 px-4 dark:bg-emerald-800 dark:text-emerald-50 dark:border-emerald-300/50 bg-emerald-50 rounded-md border-2 border-emerald-500 text-emerald-700">
                            <i className="fi fi-rr-check-double"></i>
                            <p> {t("settings.organization.join_request_sent")} </p>
                        </div>
                    )
                }
                {userOrg && (
                    <div>
                        <p>
                            {t("settings.organization.you_belong_to_org")} <strong>{userOrg.name}</strong>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
