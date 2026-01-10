import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../store/store';
import { removeToast, type Toast } from '../store/uiSlice';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastItem = ({ toast }: { toast: Toast }) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const duration = toast.duration || 3000;
        const timer = setTimeout(() => {
            dispatch(removeToast(toast.id));
        }, duration);

        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, dispatch]);

    const getToastStyles = (type: Toast['type']) => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800',
                    icon: <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
                    text: 'text-emerald-800 dark:text-emerald-200',
                };
            case 'error':
                return {
                    bg: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
                    icon: <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
                    text: 'text-red-800 dark:text-red-200',
                };
            case 'warning':
                return {
                    bg: 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800',
                    icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
                    text: 'text-amber-800 dark:text-amber-200',
                };
            case 'info':
            default:
                return {
                    bg: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
                    icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
                    text: 'text-blue-800 dark:text-blue-200',
                };
        }
    };

    const styles = getToastStyles(toast.type);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg ${styles.bg} min-w-[300px] max-w-md`}
        >
            <div className="flex-shrink-0">{styles.icon}</div>
            <p className={`flex-1 text-sm font-medium ${styles.text}`}>{toast.message}</p>
            <button
                onClick={() => dispatch(removeToast(toast.id))}
                className={`flex-shrink-0 ${styles.text} hover:opacity-70 transition-opacity`}
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

export const ToastContainer = () => {
    const toasts = useAppSelector((state) => state.ui.toasts);

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <ToastItem toast={toast} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
};
