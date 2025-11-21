import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  CalendarOff,
  FileText
} from 'lucide-react';
import Card from '../../components/ui/CustomCard';
import Button from '../../components/ui/CustomButton';
import RequestDayOffModal from '../../components/RequestDayOffModal';

// Dummy data - will be replaced with API calls later
const DUMMY_ORGANIZATION = {
  id: 1,
  name: 'مدرسة النور الثانوية',
  work_end_time: '00:00',
  academic_year_end: '2025-06-30'
};

const DUMMY_ATTENDANCE: AttendanceRecord[] = [
  { id: 1, date: '2025-11-01', status: 'present' as const, time_in: '08:00', time_out: '14:30' },
  { id: 2, date: '2025-11-02', status: 'present' as const, time_in: '08:05', time_out: '14:35' },
  { id: 3, date: '2025-11-03', status: 'absent' as const, time_in: null, time_out: null },
  { id: 4, date: '2025-11-04', status: 'present' as const, time_in: '08:00', time_out: '14:30' },
  { id: 5, date: '2025-11-05', status: 'late' as const, time_in: '08:45', time_out: '14:30' },
  { id: 6, date: '2025-11-08', status: 'present' as const, time_in: '08:00', time_out: '14:30' },
  { id: 7, date: '2025-11-09', status: 'present' as const, time_in: '08:00', time_out: '14:30' },
  { id: 8, date: '2025-11-10', status: 'excused' as const, time_in: null, time_out: null },
  { id: 9, date: '2025-11-11', status: 'present' as const, time_in: '08:00', time_out: '14:30' },
  { id: 10, date: '2025-11-12', status: 'present' as const, time_in: '08:00', time_out: '14:30' }
];

const DUMMY_DAY_OFF_REQUESTS: DayOffRequest[] = [
  {
    id: 1,
    start_date: '2025-11-20',
    end_date: '2025-11-22',
    reason: 'زيارة عائلية',
    status: 'pending' as const,
    days_count: 3,
    created_at: '2025-11-15T10:00:00Z'
  },
  {
    id: 2,
    start_date: '2025-10-15',
    end_date: '2025-10-15',
    reason: 'موعد طبي',
    status: 'approved' as const,
    days_count: 1,
    created_at: '2025-10-10T10:00:00Z'
  },
  {
    id: 3,
    start_date: '2025-09-05',
    end_date: '2025-09-06',
    reason: 'ظرف طارئ',
    status: 'rejected' as const,
    days_count: 2,
    created_at: '2025-09-01T10:00:00Z',
    rejection_reason: 'فترة الامتحانات'
  }
];

interface AttendanceRecord {
  id: number;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  time_in: string | null;
  time_out: string | null;
}

interface DayOffRequest {
  id: number;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  days_count: number;
  created_at: string;
  rejection_reason?: string;
}

const AttendancePage = () => {
  const { t } = useTranslation();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [attendanceRecords] = useState<AttendanceRecord[]>(DUMMY_ATTENDANCE);
  const [dayOffRequests, setDayOffRequests] = useState<DayOffRequest[]>(DUMMY_DAY_OFF_REQUESTS);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-800 dark:text-green-300',
          icon: CheckCircle
        };
      case 'absent':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-800 dark:text-red-300',
          icon: XCircle
        };
      case 'late':
        return {
          bg: 'bg-orange-100 dark:bg-orange-900/30',
          text: 'text-orange-800 dark:text-orange-300',
          icon: AlertCircle
        };
      case 'excused':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-800 dark:text-blue-300',
          icon: CalendarOff
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-900/30',
          text: 'text-gray-800 dark:text-gray-300',
          icon: AlertCircle
        };
    }
  };

  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'approved':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  // Calculate statistics
  const totalDays = attendanceRecords.length;
  const presentDays = attendanceRecords.filter(r => r.status === 'present').length;
  const absentDays = attendanceRecords.filter(r => r.status === 'absent').length;
  const lateDays = attendanceRecords.filter(r => r.status === 'late').length;
  const attendanceRate = totalDays > 0 ? ((presentDays + lateDays) / totalDays * 100).toFixed(1) : 0;

  const handleRequestSubmit = (request: Omit<DayOffRequest, 'id' | 'status' | 'created_at'>) => {
    const newRequest: DayOffRequest = {
      ...request,
      id: dayOffRequests.length + 1,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    setDayOffRequests([newRequest, ...dayOffRequests]);
    setShowRequestModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white dark:from-emerald-950/20 dark:to-emerald-950 p-6">
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-emerald-50 mb-2">
              {t('attendance.page_title')}
            </h1>
            <p className="text-gray-600 dark:text-emerald-200">
              {t('attendance.page_description')}
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="size-4" />}
            onClick={() => setShowRequestModal(true)}
          >
            {t('attendance.request_day_off')}
          </Button>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card variant="dashboard" className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
              <Calendar className="size-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-emerald-400">
                {t('attendance.total_days')}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-emerald-50">
                {totalDays}
              </div>
            </div>
          </div>
        </Card>

        <Card variant="dashboard" className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
              <CheckCircle className="size-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-emerald-400">
                {t('attendance.present_days')}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-emerald-50">
                {presentDays}
              </div>
            </div>
          </div>
        </Card>

        <Card variant="dashboard" className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
              <XCircle className="size-5 text-red-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-emerald-400">
                {t('attendance.absent_days')}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-emerald-50">
                {absentDays}
              </div>
            </div>
          </div>
        </Card>

        <Card variant="dashboard" className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
              <Clock className="size-5 text-orange-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-emerald-400">
                {t('attendance.late_days')}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-emerald-50">
                {lateDays}
              </div>
            </div>
          </div>
        </Card>

        <Card variant="dashboard" className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <CalendarOff className="size-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-emerald-400">
                {t('attendance.attendance_rate')}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-emerald-50">
                {attendanceRate}%
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Records */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card variant="dashboard" className="overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-b border-emerald-200 dark:border-emerald-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">
                {t('attendance.attendance_records')}
              </h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-emerald-300">
                        {t('attendance.date')}
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-emerald-300">
                        {t('attendance.status')}
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-emerald-300">
                        {t('attendance.time_in')}
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-emerald-300">
                        {t('attendance.time_out')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map((record) => {
                      const statusConfig = getStatusColor(record.status);
                      const StatusIcon = statusConfig.icon;
                      return (
                        <tr
                          key={record.id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="py-3 px-4 text-sm text-gray-900 dark:text-emerald-50">
                            {new Date(record.date).toLocaleDateString('ar-SA')}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                              <StatusIcon className="size-3" />
                              {t(`attendance.status_${record.status}`)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700 dark:text-emerald-200">
                            {record.time_in || '-'}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700 dark:text-emerald-200">
                            {record.time_out || '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Day Off Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card variant="dashboard" className="overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-b border-blue-200 dark:border-blue-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-blue-50">
                {t('attendance.day_off_requests')}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {dayOffRequests.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="size-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('attendance.no_requests')}
                  </p>
                </div>
              ) : (
                dayOffRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getRequestStatusColor(request.status)}`}>
                        {t(`attendance.request_status_${request.status}`)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(request.created_at).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-900 dark:text-emerald-50 font-medium">
                        {request.reason}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-emerald-300">
                        <Calendar className="size-3" />
                        <span>
                          {new Date(request.start_date).toLocaleDateString('ar-SA')} -{' '}
                          {new Date(request.end_date).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        {t('attendance.days_count', { count: request.days_count })}
                      </div>
                      {request.status === 'rejected' && request.rejection_reason && (
                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <div className="text-xs text-red-600 dark:text-red-400">
                            {t('attendance.rejection_reason')}: {request.rejection_reason}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Request Day Off Modal */}
      <RequestDayOffModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSubmit={handleRequestSubmit}
        organizationWorkEndTime={DUMMY_ORGANIZATION.work_end_time}
        academicYearEnd={DUMMY_ORGANIZATION.academic_year_end}
      />
    </div>
  );
};

export default AttendancePage;
