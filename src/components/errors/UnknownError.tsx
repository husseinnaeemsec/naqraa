import { useTranslation } from 'react-i18next';
import warning from '../../assets/errors/warning.svg';

interface Props {
    className?:string;
    title?:string;
    text?:string;
    showText?:boolean;
}

export default function UnknownError( { title,text,showText,className } : Props ){
    const { t } = useTranslation();
    
    return (
        <div className={`flex items-center justify-center flex-col gap-2 ${className}`}>
            <img src={warning} className='max-w-md' alt="" />
            <h1 className="text-2xl font-semibold"> {title || t("unknown_error")} </h1>
            {showText && <p> {text||t("unknown_error_text")} </p> }
        </div>
    )
}