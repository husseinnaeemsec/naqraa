import { t } from "i18next";
import Spinner from "./Spinner";

interface Props {
    title?:string;
    text?:string;
    className?:string;
}
export default function ResourceLoader( { title,text,className } : Props ){


    return (
        <div className={`flex items-center justify-center flex-col gap-2 ${className}`}>
            <Spinner />
            <h1 className="text-2xl font-semibold"> {title || t("loading_resources")} </h1>
            <p> {text || t("loading_resources_text")} </p>
        </div>
    )

}