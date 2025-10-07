import { t } from 'i18next';
import login_failed from '../../assets/errors/login.svg';
import { Link } from 'react-router-dom';

interface Props {
    className?:string;
    title?:string;
    text?:string;
    showText?:boolean;
}

export default function UnAuthoraizedError( { title,text,showText,className } : Props ){
    return (
        <div className={`flex items-center justify-center flex-col gap-2 ${className}`}>
            <img src={login_failed} className='max-w-md' alt="" />
            <h1 className="text-2xl font-semibold"> {title || t("unauthoraized_error")} </h1>
            {showText && <p> {text||t("unauthoraized_error_text")} </p> }
            <Link to={'/login'} className="p-2 px-4 rounded-md bg-emerald-500 text-white hover:bg-emerald-600"> {t("login")} </Link>
        </div>
    )
}