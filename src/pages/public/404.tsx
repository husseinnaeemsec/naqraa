import NotFoundError from "../../components/errors/NotFoundError";

export default function PageNotFound(){
    return (
        <div className="w-dvw h-dvh flex items-center justify-center">
            <NotFoundError showText showHomeLink text="نعتذر منك , لم يتم العثور على الصفحة المطلوبة" title="لم يتم العثور على الصفحة " />
        </div>
    )
}
