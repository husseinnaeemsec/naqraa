import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, XCircle, X, ChevronDown } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { removeAsyncOperation, clearAsyncOperations } from "../store/uiSlice";
import { useState } from "react";

export default function AsyncOperationsWidget() {
    const dispatch = useAppDispatch();
    const operations = useAppSelector(state => state.ui.asyncOperations);
    const [isCollapsed, setIsCollapsed] = useState(false);



    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'loading':
                return <Loader2 className="size-4 animate-spin text-blue-500" />;
            case 'success':
                return <CheckCircle2 className="size-4 text-green-500" />;
            case 'error':
                return <XCircle className="size-4 text-red-500" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'loading':
                return 'border-blue-500';
            case 'success':
                return 'border-green-500';
            case 'error':
                return 'border-red-500';
            default:
                return 'border-gray-500';
        }
    };

    const formatOperationName = (name: string) => {
        // Convert "student/getEnrollments" to "Get Enrollments"
        const parts = name.split('/');
        const actionName = parts[parts.length - 1];
        return actionName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            className="fixed bottom-4 right-4 z-[9999] w-80 max-w-[calc(100vw-2rem)]"
        >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Header */}
                <div
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all cursor-pointer"
                >
                    <div className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        <span className="font-semibold text-sm">
                            Async Operations ({operations.length})
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {operations.length > 0 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(clearAsyncOperations());
                                }}
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                                title="Clear All"
                            >
                                <X className="size-3" />
                            </button>
                        )}
                        <motion.div
                            animate={{ rotate: isCollapsed ? -90 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDown className="size-4" />
                        </motion.div>
                    </div>
                </div>

                {/* Operations List */}
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="max-h-96 overflow-y-auto p-2">
                                {operations.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                        <Loader2 className="size-8 mx-auto mb-2 opacity-30" />
                                        <p className="text-sm">No active operations</p>
                                        <p className="text-xs mt-1 opacity-70">
                                            Async operations will appear here
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <AnimatePresence mode="popLayout">
                                            {operations.map((operation) => (
                                                <motion.div
                                                    key={operation.id}
                                                    initial={{ opacity: 0, height: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                                    exit={{ opacity: 0, height: 0, scale: 0.8 }}
                                                    transition={{ duration: 0.2 }}
                                                    className={`p-3 rounded-lg border-l-4 ${getStatusColor(
                                                        operation.status
                                                    )} bg-gray-50 dark:bg-gray-900/50`}
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex items-start gap-2 flex-1 min-w-0">
                                                            <div className="mt-0.5 flex-shrink-0">
                                                                {getStatusIcon(operation.status)}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                                                                    {formatOperationName(operation.name)}
                                                                </div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                                    {operation.status === 'loading' && 'Loading...'}
                                                                    {operation.status === 'success' && 'Completed'}
                                                                    {operation.status === 'error' && (
                                                                        <span className="text-red-600 dark:text-red-400">
                                                                            {operation.error || 'Failed'}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {operation.status !== 'loading' && (
                                                            <button
                                                                onClick={() =>
                                                                    dispatch(removeAsyncOperation(operation.id))
                                                                }
                                                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-colors flex-shrink-0"
                                                            >
                                                                <X className="size-3 text-gray-500" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}