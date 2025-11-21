import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, FileText, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from './ui/CustomButton';

interface RequestDayOffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: {
    start_date: string;
    end_date: string;
    reason: string;
    days_count: number;
  }) => void;
  organizationWorkEndTime: string;
  academicYearEnd: string;
}

const RequestDayOffModal = ({
  isOpen,
  onClose,
  onSubmit,
  organizationWorkEndTime,
  academicYearEnd
}: RequestDayOffModalProps) => {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [daysCount, setDaysCount] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Calculate days count when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end >= start) {
        // Calculate business days (excluding weekends)
        let count = 0;
        const current = new Date(start);
        
        while (current <= end) {
          const dayOfWeek = current.getDay();
          // Count only weekdays (Saturday = 6, Sunday = 0 in some calendars)
          // Adjust based on your organization's working days
          if (dayOfWeek !== 5 && dayOfWeek !== 6) { // Excluding Friday and Saturday
            count++;
          }
          current.setDate(current.getDate() + 1);
        }
        
        setDaysCount(count);
      } else {
        setDaysCount(0);
      }
    } else {
      setDaysCount(0);
    }
  }, [startDate, endDate]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Parse organization work end time (e.g., "15:00")
    const [workEndHour, workEndMinute] = organizationWorkEndTime.split(':').map(Number);
    const workEndToday = new Date();
    workEndToday.setHours(workEndHour, workEndMinute, 0, 0);
    
    // Calculate if there's at least 1 hour before work time ends
    const oneHourBeforeWorkEnd = new Date(workEndToday);
    oneHourBeforeWorkEnd.setHours(oneHourBeforeWorkEnd.getHours() - 1);
    const canSubmitToday = now < oneHourBeforeWorkEnd;

    if (!startDate) {
      newErrors.startDate = t('attendance.error_start_date_required');
    } else {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      // Check if start date is in the past
      if (start < today) {
        newErrors.startDate = t('attendance.error_past_date');
      }
      
      // If start date is today, check if we can still submit (1 hour before work end)
      if (start.getTime() === today.getTime() && !canSubmitToday) {
        newErrors.startDate = t('attendance.error_too_late_for_today');
      }
      
      // Check if start date is after academic year end
      const academicEnd = new Date(academicYearEnd);
      if (start > academicEnd) {
        newErrors.startDate = t('attendance.error_after_academic_year');
      }
    }

    if (!endDate) {
      newErrors.endDate = t('attendance.error_end_date_required');
    } else {
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      // Check if end date is in the past
      if (end < today) {
        newErrors.endDate = t('attendance.error_past_date');
      }
      
      // Check if end date is before start date
      if (end < start) {
        newErrors.endDate = t('attendance.error_end_before_start');
      }
      
      // If end date is today, check if we can still submit (1 hour before work end)
      if (end.getTime() === today.getTime() && !canSubmitToday) {
        newErrors.endDate = t('attendance.error_too_late_for_today');
      }
      
      // Check if end date is after academic year end
      const academicEnd = new Date(academicYearEnd);
      if (end > academicEnd) {
        newErrors.endDate = t('attendance.error_after_academic_year');
      }
    }

    if (!reason || reason.trim().length < 10) {
      newErrors.reason = t('attendance.error_reason_too_short');
    }

    if (daysCount === 0) {
      newErrors.dates = t('attendance.error_no_working_days');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        start_date: startDate,
        end_date: endDate,
        reason: reason.trim(),
        days_count: daysCount
      });
      
      // Reset form
      setStartDate('');
      setEndDate('');
      setReason('');
      setDaysCount(0);
      setErrors({});
    }
  };

  const handleClose = () => {
    setStartDate('');
    setEndDate('');
    setReason('');
    setDaysCount(0);
    setErrors({});
    onClose();
  };

  // Get max date (academic year end)
  const maxDate = academicYearEnd;
  
  // Get min date - check if we can submit for today
  const now = new Date();
  const [workEndHour, workEndMinute] = organizationWorkEndTime.split(':').map(Number);
  const workEndToday = new Date();
  workEndToday.setHours(workEndHour, workEndMinute, 0, 0);
  const oneHourBeforeWorkEnd = new Date(workEndToday);
  oneHourBeforeWorkEnd.setHours(oneHourBeforeWorkEnd.getHours() - 1);
  const canSubmitToday = now < oneHourBeforeWorkEnd;
  
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  const minDate = canSubmitToday ? today : tomorrowStr;

  useEffect(()=>{
    console.log("Min Date ", minDate)
    console.log("Max Date",maxDate)
    console.log("Can Submit Today ", canSubmitToday)

  })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={handleClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg mx-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                      <Calendar className="size-5 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">
                      {t('attendance.request_day_off')}
                    </h2>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <X className="size-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Date Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-emerald-300 mb-2">
                      {t('attendance.start_date')}
                    </label>
                    <div className="relative">
                      <input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        // min={minDate}
                        // max={maxDate}
                        className={`w-full px-4 py-2.5 rounded-lg border ${
                          errors.startDate
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-emerald-500'
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-emerald-50 focus:ring-2 focus:border-transparent transition-colors outline-none`}
                      />
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.startDate && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="size-3" />
                        {errors.startDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 dark:text-emerald-300 mb-2">
                      {t('attendance.end_date')}
                    </label>
                    <div className="relative">
                      <input
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || minDate}
                        max={maxDate}
                        className={`w-full px-4 py-2.5 rounded-lg border ${
                          errors.endDate
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-emerald-500'
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-emerald-50 focus:ring-2 focus:border-transparent transition-colors outline-none`}
                      />
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.endDate && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="size-3" />
                        {errors.endDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Days Count Display */}
                {daysCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <Calendar className="size-4" />
                        <span className="text-sm font-medium">
                          {t('attendance.working_days_selected')}
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        {daysCount}
                      </span>
                    </div>
                  </motion.div>
                )}

                {errors.dates && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                      <AlertCircle className="size-4" />
                      {errors.dates}
                    </p>
                  </div>
                )}

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-emerald-300 mb-2">
                    {t('attendance.reason')}
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                    placeholder={t('attendance.reason_placeholder')}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.reason
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-emerald-500'
                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-emerald-50 focus:ring-2 focus:border-transparent transition-colors resize-none`}
                  />
                  <div className="flex items-center justify-between mt-1">
                    <div>
                      {errors.reason && (
                        <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="size-3" />
                          {errors.reason}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {reason.length} / 500
                    </p>
                  </div>
                </div>

                {/* Info Note */}
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <FileText className="size-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      {t('attendance.request_info')}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={handleClose}
                    className="flex-1"
                  >
                    {t('ui.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    icon={<Calendar className="size-4" />}
                    className="flex-1"
                  >
                    {t('attendance.submit_request')}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RequestDayOffModal;
