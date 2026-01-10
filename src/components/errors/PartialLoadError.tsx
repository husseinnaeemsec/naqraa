import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, RefreshCw, ServerCrash, ShieldAlert, Clock, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';

interface PartialLoadErrorProps {
    title?: string;
    message?: string;
    errorType?: 'network' | '404' | '500' | '429' | 'timeout' | 'unknown';
    onRetry?: () => void | Promise<void>;
    maxRetries?: number;
    className?: string;
}

export default function PartialLoadError({
    title,
    message,
    errorType = 'unknown',
    onRetry,
    maxRetries = 3,
    className = ''
}: PartialLoadErrorProps) {
    const { t } = useTranslation();
    const [retryCount, setRetryCount] = useState(0);
    const [isRetrying, setIsRetrying] = useState(false);

    const getErrorConfig = () => {
        switch (errorType) {
            case 'network':
                return {
                    icon: <Wifi className="w-12 h-12" />,
                    color: 'text-blue-600 dark:text-blue-400',
                    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
                    borderColor: 'border-blue-200 dark:border-blue-800',
                    title: title || t('errors.network.title', 'Network Error'),
                    message: message || t('errors.network.message', 'Unable to connect to the server. Please check your internet connection.')
                };
            case '404':
                return {
                    icon: <AlertCircle className="w-12 h-12" />,
                    color: 'text-amber-600 dark:text-amber-400',
                    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
                    borderColor: 'border-amber-200 dark:border-amber-800',
                    title: title || t('errors.not_found.title', 'Not Found'),
                    message: message || t('errors.not_found.message', 'The requested resource could not be found.')
                };
            case '500':
                return {
                    icon: <ServerCrash className="w-12 h-12" />,
                    color: 'text-red-600 dark:text-red-400',
                    bgColor: 'bg-red-100 dark:bg-red-900/30',
                    borderColor: 'border-red-200 dark:border-red-800',
                    title: title || t('errors.server.title', 'Server Error'),
                    message: message || t('errors.server.message', 'An error occurred on the server. Please try again later.')
                };
            case '429':
                return {
                    icon: <ShieldAlert className="w-12 h-12" />,
                    color: 'text-orange-600 dark:text-orange-400',
                    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
                    borderColor: 'border-orange-200 dark:border-orange-800',
                    title: title || t('errors.rate_limit.title', 'Too Many Requests'),
                    message: message || t('errors.rate_limit.message', 'You have made too many requests. Please wait a moment and try again.')
                };
            case 'timeout':
                return {
                    icon: <Clock className="w-12 h-12" />,
                    color: 'text-purple-600 dark:text-purple-400',
                    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
                    borderColor: 'border-purple-200 dark:border-purple-800',
                    title: title || t('errors.timeout.title', 'Request Timeout'),
                    message: message || t('errors.timeout.message', 'The request took too long to complete. Please try again.')
                };
            default:
                return {
                    icon: <AlertCircle className="w-12 h-12" />,
                    color: 'text-slate-600 dark:text-slate-400',
                    bgColor: 'bg-slate-100 dark:bg-slate-900/30',
                    borderColor: 'border-slate-200 dark:border-slate-800',
                    title: title || t('errors.unknown.title', 'Something Went Wrong'),
                    message: message || t('errors.unknown.message', 'An unexpected error occurred. Please try again.')
                };
        }
    };

    const handleRetry = async () => {
        if (!onRetry || retryCount >= maxRetries || isRetrying) return;

        setIsRetrying(true);
        setRetryCount(prev => prev + 1);

        try {
            await onRetry();
        } catch (error) {
            console.error('Retry failed:', error);
        } finally {
            setIsRetrying(false);
        }
    };

    const config = getErrorConfig();
    const canRetry = onRetry && retryCount < maxRetries;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}
        >
            {/* Error Icon */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className={`${config.bgColor} ${config.color} rounded-full p-6 mb-6`}
            >
                {config.icon}
            </motion.div>

            {/* Error Title */}
            <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center"
            >
                {config.title}
            </motion.h3>

            {/* Error Message */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-slate-600 dark:text-slate-400 text-center max-w-md mb-6"
            >
                {config.message}
            </motion.p>

            {/* Retry Info */}
            {onRetry && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col items-center gap-4"
                >
                    {retryCount > 0 && (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {t('errors.retry_count', 'Retry {{current}} of {{max}}', { 
                                current: retryCount, 
                                max: maxRetries 
                            })}
                        </p>
                    )}

                    {/* Retry Button */}
                    {canRetry ? (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleRetry}
                            disabled={isRetrying}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                                isRetrying
                                    ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                                    : `${config.bgColor} ${config.color} border-2 ${config.borderColor} hover:opacity-80`
                            }`}
                        >
                            <RefreshCw className={`w-5 h-5 ${isRetrying ? 'animate-spin' : ''}`} />
                            {isRetrying 
                                ? t('errors.retrying', 'Retrying...') 
                                : t('errors.retry_button', 'Try Again')
                            }
                        </motion.button>
                    ) : retryCount >= maxRetries ? (
                        <div className="text-center">
                            <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-2">
                                {t('errors.max_retries', 'Maximum retry attempts reached')}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {t('errors.contact_support', 'Please contact support if the problem persists')}
                            </p>
                        </div>
                    ) : null}
                </motion.div>
            )}
        </motion.div>
    );
}
