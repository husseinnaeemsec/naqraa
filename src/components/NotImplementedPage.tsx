import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export default function NotImplementedPage( {page} : { page : string | ReactNode }  ){
    const { t } = useTranslation();

    return (
        <div className="h-[70dvh] bg-white p-10 mx-auto flex items-center justify-center">
            <div className="bg-emerald-50 p-10 max-w-5xl w-full rounded-md flex flex-col gap-3 items-center justify-center">
                <h1 className="text-5xl flex gap-1"> {t('not_implemented.page_title')} <strong className="flex"> {page} </strong> </h1>
                <p> <span className="text-amber-500"> {t('not_implemented.note')} </span> {t('not_implemented.page_incomplete')}  </p>
            </div>
        </div>
    )

}