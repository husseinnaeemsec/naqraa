import todoImage from '../../assets/todo.svg';
import { useTranslation } from 'react-i18next';

export default function TodoBanner() {
    const { t } = useTranslation();

    return (
            <div className=" w-full space-y-2 mx-auto p-4">
                    <h1 className="text-xl font-semibold">{t('todo_banner.title')}</h1>
                    <p className="text-slate-500">{t('todo_banner.description')}</p>
            </div>
    )
}