import { useTranslation } from 'react-i18next';
import not_found from '../../assets/errors/not_found.svg';
import { Link } from 'react-router-dom';

interface Props {
    className?:string;
    title?:string;
    text?:string;
    showText?:boolean;
    showHomeLink?:boolean;
}

export default function NotFoundError( { title,text,showText,className , showHomeLink } : Props ){
    const { t } = useTranslation();
    
    return (
        <div className={`flex items-center justify-center flex-col gap-2 ${className}`}>
            <img src={not_found} className='max-w-md' alt="" />
            <h1 className="text-2xl font-semibold"> {title || t("not_found_error")} </h1>
            {showText && <p> {text||t("not_found_error_text")} </p> }
            <div className="flex items-center gap-2 mt-5">
                { showHomeLink && <Link to={'/'} className='p-2 px-4 bg-emerald-500 rounded text-white' > {t('not_found_error.back_to_home')} </Link> }
            </div>
        </div>
    )
}