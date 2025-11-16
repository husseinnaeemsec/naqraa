import { useTranslation } from "react-i18next";
import NotFoundError from "../../components/errors/NotFoundError";

export default function PageNotFound(){
    const { t } = useTranslation();
    
    return (
        <div className="w-dvw h-dvh flex items-center justify-center">
            <NotFoundError showText showHomeLink text={t('not_found.message')} title={t('not_found.title')} />
        </div>
    )
}
