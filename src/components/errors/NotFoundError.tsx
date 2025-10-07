import { t } from 'i18next';
import not_found from '../../assets/errors/not_found.svg';

interface Props {
    className?:string;
    title?:string;
    text?:string;
    showText?:boolean;
}

export default function NotFoundError( { title,text,showText,className } : Props ){
    return (
        <div className={`flex items-center justify-center flex-col gap-2 ${className}`}>
            <img src={not_found} className='max-w-md' alt="" />
            <h1 className="text-2xl font-semibold"> {title || t("not_found_error")} </h1>
            {showText && <p> {text||t("not_found_error_text")} </p> }
        </div>
    )
}