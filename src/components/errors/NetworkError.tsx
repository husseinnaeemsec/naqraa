import { t } from 'i18next';
import server_error from '../../assets/errors/server_error.svg';

interface Props {
    className?:string;
    title?:string;
    text?:string;
    showText?:boolean;
}

export default function NetworkError( { title,text,showText,className } : Props ){
    return (
        <div className={`flex items-center justify-center flex-col gap-2 ${className}`}>
            <img src={server_error} className='max-w-md' alt="" />
            <h1 className="text-2xl font-semibold"> {title || t("server_error")} </h1>
            {showText && <p> {text||t("server_error_text")} </p> }
        </div>
    )
}