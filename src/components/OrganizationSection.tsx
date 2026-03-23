import { useAppSelector } from "../store";
import { SectionHeader } from "../pages/student/SettingsPage";
import { t } from "i18next";
import { Link } from "react-router-dom";
import { Building, ExternalLink } from "lucide-react";

export default function OrganizationSection() {
    const { user } = useAppSelector((state) => state.auth);

    const userOrg = user?.profile?.organization || null;
    

    return (
        <div className="bg-white dark:bg-emerald-950 border dark:border-emerald-800 border-emerald-300 rounded-lg p-6 shadow-md">
            <SectionHeader icon={<Building className="text-2xl" />} title={t("settings.organization.title")} />
            <div id="organization" className="space-y-4">
                {userOrg ? (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-700 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Building className="size-5 text-emerald-600 dark:text-emerald-400" />
                            <div>
                                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                    {t("settings.organization.you_belong_to_org")}
                                </p>
                                <p className="font-semibold text-emerald-800 dark:text-emerald-200">
                                    {userOrg.name}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <p className="text-gray-600 dark:text-gray-400">
                            {t("settings.organization.not_part_of_org")}
                        </p>
                        
                        <Link
                            to="/organizations"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                        >
                            <Building className="size-4" />
                            {t("settings.organization.browse_organizations")}
                            <ExternalLink className="size-4" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
