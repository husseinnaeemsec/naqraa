import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, BookOpen, Clock, Target, Users, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '../api/client';
import { endpoints } from '../api/routes';
import { useAppDispatch } from '../store/store';
import { updateUser } from '../store/authSlice';
import { Button } from './ui/button';
import { SuccessAlert } from './alerts';

interface Subject {
    id: number;
    name: string;
    description?: string;
}

interface UserPreferenceData {
    subjects_to_improve_ids: number[];
    preferred_study_type: string;
    preferred_study_time: string;
    preferred_difficulty: string;
    max_video_duration: number;
    max_reading_time: number;
    interested_in_communities: boolean;
    interested_in_study_groups: boolean;
    study_goal: string;
    weekly_study_hours_goal: number;
    receive_course_recommendations: boolean;
    receive_quiz_recommendations: boolean;
    receive_resource_recommendations: boolean;
    receive_community_recommendations: boolean;
}

interface UserPreferencePopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const UserPreferencePopup: React.FC<UserPreferencePopupProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [currentStep, setCurrentStep] = useState(1);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [submitting, setSubmitting] = useState(false);
    
    const [preferences, setPreferences] = useState<UserPreferenceData>({
        subjects_to_improve_ids: [],
        preferred_study_type: 'mixed',
        preferred_study_time: 'flexible',
        preferred_difficulty: 'intermediate',
        max_video_duration: 30,
        max_reading_time: 20,
        interested_in_communities: true,
        interested_in_study_groups: true,
        study_goal: '',
        weekly_study_hours_goal: 10,
        receive_course_recommendations: true,
        receive_quiz_recommendations: true,
        receive_resource_recommendations: true,
        receive_community_recommendations: true,
    });

    const studyTypes = [
        { value: 'reading', label: t('user_preferences.study_types.reading.label'), icon: <BookOpen className="w-6 h-6" />, description: t('user_preferences.study_types.reading.description') },
        { value: 'watching', label: t('user_preferences.study_types.watching.label'), icon: '🎥', description: t('user_preferences.study_types.watching.description') },
        { value: 'listening', label: t('user_preferences.study_types.listening.label'), icon: '🎧', description: t('user_preferences.study_types.listening.description') },
        { value: 'interactive', label: t('user_preferences.study_types.interactive.label'), icon: '🎮', description: t('user_preferences.study_types.interactive.description') },
        { value: 'practice', label: t('user_preferences.study_types.practice.label'), icon: '✏️', description: t('user_preferences.study_types.practice.description') },
        { value: 'mixed', label: t('user_preferences.study_types.mixed.label'), icon: '🔄', description: t('user_preferences.study_types.mixed.description') },
    ];

    const studyTimes = [
        { value: 'morning', label: t('user_preferences.study_times.morning.label'), time: t('user_preferences.study_times.morning.time'), icon: '🌅' },
        { value: 'afternoon', label: t('user_preferences.study_times.afternoon.label'), time: t('user_preferences.study_times.afternoon.time'), icon: '☀️' },
        { value: 'evening', label: t('user_preferences.study_times.evening.label'), time: t('user_preferences.study_times.evening.time'), icon: '🌆' },
        { value: 'night', label: t('user_preferences.study_times.night.label'), time: t('user_preferences.study_times.night.time'), icon: '🌙' },
        { value: 'flexible', label: t('user_preferences.study_times.flexible.label'), time: t('user_preferences.study_times.flexible.time'), icon: '🔄' },
    ];

    const studyGoals = [
        { value: 'improve_grades', label: t('user_preferences.study_goals.improve_grades.label'), icon: '📈', description: t('user_preferences.study_goals.improve_grades.description') },
        { value: 'exam_preparation', label: t('user_preferences.study_goals.exam_preparation.label'), icon: '📝', description: t('user_preferences.study_goals.exam_preparation.description') },
        { value: 'skill_development', label: t('user_preferences.study_goals.skill_development.label'), icon: '🚀', description: t('user_preferences.study_goals.skill_development.description') },
        { value: 'career_advancement', label: t('user_preferences.study_goals.career_advancement.label'), icon: '💼', description: t('user_preferences.study_goals.career_advancement.description') },
        { value: 'personal_interest', label: t('user_preferences.study_goals.personal_interest.label'), icon: '❤️', description: t('user_preferences.study_goals.personal_interest.description') },
        { value: 'certification', label: t('user_preferences.study_goals.certification.label'), icon: '🏆', description: t('user_preferences.study_goals.certification.description') },
        { value: 'catch_up', label: t('user_preferences.study_goals.catch_up.label'), icon: '⏰', description: t('user_preferences.study_goals.catch_up.description') },
        { value: 'advance_learning', label: t('user_preferences.study_goals.advance_learning.label'), icon: '🎯', description: t('user_preferences.study_goals.advance_learning.description') },
        { value: 'competition_prep', label: t('user_preferences.study_goals.competition_prep.label'), icon: '🥇', description: t('user_preferences.study_goals.competition_prep.description') },
        { value: 'general_knowledge', label: t('user_preferences.study_goals.general_knowledge.label'), icon: '🧠', description: t('user_preferences.study_goals.general_knowledge.description') },
    ];

    const difficultyLevels = [
        { value: 'beginner', label: t('user_preferences.difficulty_levels.beginner.label'), description: t('user_preferences.difficulty_levels.beginner.description'), color: 'text-green-600' },
        { value: 'intermediate', label: t('user_preferences.difficulty_levels.intermediate.label'), description: t('user_preferences.difficulty_levels.intermediate.description'), color: 'text-yellow-600' },
        { value: 'advanced', label: t('user_preferences.difficulty_levels.advanced.label'), description: t('user_preferences.difficulty_levels.advanced.description'), color: 'text-red-600' },
        { value: 'mixed', label: t('user_preferences.difficulty_levels.mixed.label'), description: t('user_preferences.difficulty_levels.mixed.description'), color: 'text-blue-600' },
    ];

    useEffect(() => {
        if (isOpen) {
            fetchSubjects();
        }
    }, [isOpen]);

    const fetchSubjects = async () => {
        try {
            const response = await api.get(endpoints.academics.subjects);
            setSubjects(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    const handleSubjectToggle = (subjectId: number) => {
        setPreferences(prev => ({
            ...prev,
            subjects_to_improve_ids: prev.subjects_to_improve_ids.includes(subjectId)
                ? prev.subjects_to_improve_ids.filter(id => id !== subjectId)
                : [...prev.subjects_to_improve_ids, subjectId]
        }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            // Save preferences
            await api.post(endpoints.user.preferences, preferences);
            
            // Complete onboarding
            await api.post(endpoints.user.completeOnboarding);
            
            // Update user state to reflect completed onboarding
            const userResponse = await api.get(endpoints.user.profile);
            dispatch(updateUser(userResponse.data));
            
            // Show success message with personalized recommendations promise
            SuccessAlert({
                title: t('user_preferences.success.title'),
                text: t('user_preferences.success.message'),
                confirmText: t('user_preferences.success.start_journey'),
                onConfirm: () => {
                    onClose();
                }
            });
        } catch (error) {
            console.error('Error saving preferences:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1: return preferences.subjects_to_improve_ids.length > 0;
            case 2: return true; // Study type is optional with default
            case 3: return true; // Study time is optional with default
            case 4: return preferences.study_goal.length > 0;
            default: return true;
        }
    };

    const renderStep1 = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center space-y-2">
                <BookOpen className="w-16 h-16 text-emerald-500 mx-auto" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-emerald-50">
                    {t('user_preferences.step1.title')}
                </h3>
                <p className="text-gray-600 dark:text-emerald-200">
                    {t('user_preferences.step1.description')}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                {subjects.map((subject) => (
                    <motion.button
                        key={subject.id}
                        onClick={() => handleSubjectToggle(subject.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-right ${
                            preferences.subjects_to_improve_ids.includes(subject.id)
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
                                : 'border-gray-200 dark:border-emerald-800 hover:border-emerald-300'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 dark:text-emerald-50">
                                {subject.name}
                            </span>
                            {preferences.subjects_to_improve_ids.includes(subject.id) && (
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                            )}
                        </div>
                        {subject.description && (
                            <p className="text-sm text-gray-500 dark:text-emerald-400 mt-1">
                                {subject.description}
                            </p>
                        )}
                    </motion.button>
                ))}
            </div>

            {preferences.subjects_to_improve_ids.length > 0 && (
                <div className="text-center">
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                        {t('user_preferences.step1.selected_count', { count: preferences.subjects_to_improve_ids.length })}
                    </p>
                </div>
            )}
        </motion.div>
    );

    const renderStep2 = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center space-y-2">
                <div className="text-4xl">📚</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-emerald-50">
                    {t('user_preferences.step2.title')}
                </h3>
                <p className="text-gray-600 dark:text-emerald-200">
                    {t('user_preferences.step2.description')}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {studyTypes.map((type) => (
                    <motion.button
                        key={type.value}
                        onClick={() => setPreferences(prev => ({ ...prev, preferred_study_type: type.value }))}
                        className={`p-4 rounded-lg border-2 transition-all text-right ${
                            preferences.preferred_study_type === type.value
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
                                : 'border-gray-200 dark:border-emerald-800 hover:border-emerald-300'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl flex items-center justify-center">{type.icon}</span>
                            <div className="flex-1 text-right">
                                <h4 className="font-medium text-gray-900 dark:text-emerald-50">
                                    {type.label}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-emerald-400">
                                    {type.description}
                                </p>
                            </div>
                            {preferences.preferred_study_type === type.value && (
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                            )}
                        </div>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );

    const renderStep3 = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center space-y-2">
                <Clock className="w-16 h-16 text-emerald-500 mx-auto" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-emerald-50">
                    {t('user_preferences.step3.title')}
                </h3>
                <p className="text-gray-600 dark:text-emerald-200">
                    {t('user_preferences.step3.description')}
                </p>
            </div>

            <div className="space-y-3">
                {studyTimes.map((time) => (
                    <motion.button
                        key={time.value}
                        onClick={() => setPreferences(prev => ({ ...prev, preferred_study_time: time.value }))}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-right ${
                            preferences.preferred_study_time === time.value
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
                                : 'border-gray-200 dark:border-emerald-800 hover:border-emerald-300'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl flex items-center justify-center">{time.icon}</span>
                                <div className="text-right">
                                    <h4 className="font-medium text-gray-900 dark:text-emerald-50">
                                        {time.label}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-emerald-400">
                                        {time.time}
                                    </p>
                                </div>
                            </div>
                            {preferences.preferred_study_time === time.value && (
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                            )}
                        </div>
                    </motion.button>
                ))}
            </div>

            <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-emerald-50">{t('user_preferences.step3.content_preferences')}</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-emerald-300 mb-2">
                            {t('user_preferences.step3.video_duration_label')}
                        </label>
                        <input
                            type="range"
                            min="5"
                            max="60"
                            value={preferences.max_video_duration}
                            onChange={(e) => setPreferences(prev => ({ 
                                ...prev, 
                                max_video_duration: parseInt(e.target.value) 
                            }))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-emerald-400">
                            <span>{t('user_preferences.step3.video_duration_min')}</span>
                            <span>{t('user_preferences.step3.video_duration_current', { duration: preferences.max_video_duration })}</span>
                            <span>{t('user_preferences.step3.video_duration_max')}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-emerald-300 mb-2">
                            {t('user_preferences.step3.reading_duration_label')}
                        </label>
                        <input
                            type="range"
                            min="5"
                            max="45"
                            value={preferences.max_reading_time}
                            onChange={(e) => setPreferences(prev => ({ 
                                ...prev, 
                                max_reading_time: parseInt(e.target.value) 
                            }))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-emerald-400">
                            <span>{t('user_preferences.step3.reading_duration_min')}</span>
                            <span>{t('user_preferences.step3.reading_duration_current', { duration: preferences.max_reading_time })}</span>
                            <span>{t('user_preferences.step3.reading_duration_max')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const renderStep4 = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center space-y-2">
                <Target className="w-16 h-16 text-emerald-500 mx-auto" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-emerald-50">
                    {t('user_preferences.step4.title')}
                </h3>
                <p className="text-gray-600 dark:text-emerald-200">
                    {t('user_preferences.step4.description')}
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-emerald-300 mb-4">
                        {t('user_preferences.step4.goal_label')}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {studyGoals.map((goal) => (
                            <motion.button
                                key={goal.value}
                                onClick={() => setPreferences(prev => ({ ...prev, study_goal: goal.value }))}
                                className={`p-4 rounded-lg border-2 transition-all text-right ${
                                    preferences.study_goal === goal.value
                                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
                                        : 'border-gray-200 dark:border-emerald-800 hover:border-emerald-300'
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl flex items-center justify-center">{goal.icon}</span>
                                    <div className="flex-1">
                                        <h3 className={`font-medium ${
                                            preferences.study_goal === goal.value
                                                ? 'text-emerald-700 dark:text-emerald-300'
                                                : 'text-gray-700 dark:text-emerald-200'
                                        }`}>
                                            {goal.label}
                                        </h3>
                                        <p className={`text-sm mt-1 ${
                                            preferences.study_goal === goal.value
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : 'text-gray-500 dark:text-emerald-300'
                                        }`}>
                                            {goal.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-emerald-300 mb-2">
                        {t('user_preferences.step4.difficulty_label')}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {difficultyLevels.map((level) => (
                            <motion.button
                                key={level.value}
                                onClick={() => setPreferences(prev => ({ ...prev, preferred_difficulty: level.value }))}
                                className={`p-3 rounded-lg border-2 transition-all text-right ${
                                    preferences.preferred_difficulty === level.value
                                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
                                        : 'border-gray-200 dark:border-emerald-800 hover:border-emerald-300'
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-right">
                                        <h4 className={`font-medium ${level.color}`}>
                                            {level.label}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-emerald-400">
                                            {level.description}
                                        </p>
                                    </div>
                                    {preferences.preferred_difficulty === level.value && (
                                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                                    )}
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-emerald-300 mb-2">
                        {t('user_preferences.step4.weekly_hours_label', { hours: preferences.weekly_study_hours_goal })}
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="50"
                        value={preferences.weekly_study_hours_goal}
                        onChange={(e) => setPreferences(prev => ({ 
                            ...prev, 
                            weekly_study_hours_goal: parseInt(e.target.value) 
                        }))}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-emerald-400">
                        <span>{t('user_preferences.step4.hours_one')}</span>
                        <span>{t('user_preferences.step4.hours_25')}</span>
                        <span>{t('user_preferences.step4.hours_50')}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-emerald-50 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {t('user_preferences.step4.social_preferences')}
                </h4>
                
                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={preferences.interested_in_communities}
                            onChange={(e) => setPreferences(prev => ({ 
                                ...prev, 
                                interested_in_communities: e.target.checked 
                            }))}
                            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        />
                        <span className="text-gray-900 dark:text-emerald-50">
                            {t('user_preferences.step4.interested_in_communities')}
                        </span>
                    </label>
                    
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={preferences.interested_in_study_groups}
                            onChange={(e) => setPreferences(prev => ({ 
                                ...prev, 
                                interested_in_study_groups: e.target.checked 
                            }))}
                            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        />
                        <span className="text-gray-900 dark:text-emerald-50">
                            {t('user_preferences.step4.interested_in_study_groups')}
                        </span>
                    </label>
                </div>
            </div>
        </motion.div>
    );

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-emerald-950 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-emerald-800 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-emerald-50">
                                {t('user_preferences.header.title')}
                            </h2>
                            <p className="text-gray-600 dark:text-emerald-200 text-sm">
                                {t('user_preferences.header.step_counter', { current: currentStep, total: 4 })}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-emerald-900 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="px-6 py-2">
                        <div className="w-full bg-gray-200 dark:bg-emerald-900 rounded-full h-2">
                            <motion.div
                                className="bg-emerald-500 h-2 rounded-full"
                                initial={{ width: '25%' }}
                                animate={{ width: `${(currentStep / 4) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 max-h-[60vh] overflow-y-auto">
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && renderStep1()}
                            {currentStep === 2 && renderStep2()}
                            {currentStep === 3 && renderStep3()}
                            {currentStep === 4 && renderStep4()}
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200 dark:border-emerald-800 flex items-center justify-between">
                        <Button
                            variant="secondary"
                            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                            disabled={currentStep === 1}
                            className="flex items-center gap-2"
                        >
                            <ArrowRight className="w-4 h-4" />
                            {t('user_preferences.navigation.previous')}
                        </Button>

                        <div className="flex items-center gap-2">
                            {currentStep < 4 ? (
                                <Button
                                    onClick={() => setCurrentStep(prev => prev + 1)}
                                    disabled={!canProceed()}
                                    className="flex items-center gap-2"
                                >
                                    {t('user_preferences.navigation.next')}
                                    <ArrowLeft className="w-4 h-4" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!canProceed() || submitting}
                                    className="flex items-center gap-2"
                                >
                                    {submitting ? t('user_preferences.navigation.saving') : t('user_preferences.navigation.finish')}
                                    <CheckCircle className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UserPreferencePopup;