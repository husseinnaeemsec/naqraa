import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Filter, Building, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../api/client';
import { endpoints } from '../../api/routes';
import { governorates } from '../../../constants';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { WarningAlert, SuccessAlert, ErrorAlert } from '../../components/alerts';
import { simpleDebounce } from '../../utils/functions';
import type { PublicOrganizationProfile } from '../../../types';
import { setUser } from "../../store/authSlice";

type OrganizationType = 'all' | 'college' | 'school' | 'institute';

export default function OrganizationsPage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated} = useAppSelector((state) => state.auth);
  const [organizations, setOrganizations] = useState<PublicOrganizationProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joiningOrgId, setJoiningOrgId] = useState<number | null>(null);

  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const pageSize = 12; // Default page size
  
  // Filter states - initialize from URL parameters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>(searchParams.get('governorate') || 'all');
  const [selectedType, setSelectedType] = useState<OrganizationType>((searchParams.get('type') as OrganizationType) || 'all');

  // Auth user 
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  

  // Fetch organizations from API with pagination and filters
  const fetchOrganizations = async (page: number = 1, filters: any = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('page_size', pageSize.toString());
      
      // Add filter parameters
      if (filters.search && filters.search.trim()) {
        params.append('search', filters.search.trim());
      }
      if (filters.governorate && filters.governorate !== 'all') {
        params.append('governorate', filters.governorate);
      }
      if (filters.organization_type && filters.organization_type !== 'all') {
        params.append('organization_type', filters.organization_type);
      }
      
      const response = await api.get(`${endpoints.organization.search}?${params.toString()}`);
      const orgsData = response.data;
      
      // Handle DRF paginated response
      if (orgsData.results) {
        // Transform the data to match PublicOrganizationProfile interface
        const enhancedOrgs: PublicOrganizationProfile[] = orgsData.results.map((org: any) => ({
          id: org.id,
          name: org.name,
          username: org.username,
          bio: org.bio,
          governorate: org.governorate,
          organization_type: org.organization_type || 'institute',
          students: org.students || 0
        }));
        
        setOrganizations(enhancedOrgs);
        setTotalCount(orgsData.count || 0);
        setNextUrl(orgsData.next);
        setPrevUrl(orgsData.previous);
      } else {
        // Handle non-paginated response (fallback)
        const organizationsData = Array.isArray(orgsData) ? orgsData : [];
        const enhancedOrgs: PublicOrganizationProfile[] = organizationsData.map((org: any) => ({
          id: org.id,
          name: org.name,
          username: org.username,
          bio: org.bio,
          governorate: org.governorate,
          organization_type: org.organization_type || 'institute',
          students: org.students || 0
        }));
        
        setOrganizations(enhancedOrgs);
        setTotalCount(enhancedOrgs.length);
        setNextUrl(null);
        setPrevUrl(null);
      }
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError('فشل في تحميل المنظمات. يرجى المحاولة مرة أخرى لاحقاً.');
      setOrganizations([]);
      setTotalCount(0);
      setNextUrl(null);
      setPrevUrl(null);
    } finally {
      setLoading(false);
    }
  };

  // Initialize current page from URL
  useEffect(() => {
    const urlPage = parseInt(searchParams.get('page') || '1');
    setCurrentPage(urlPage);
  }, []);

  // Initial load
  useEffect(() => {
    const urlPage = parseInt(searchParams.get('page') || '1');
    const filters = {
      search: searchTerm,
      governorate: selectedGovernorate,
      organization_type: selectedType
    };
    fetchOrganizations(urlPage, filters);
  }, []);

  // Function to update URL parameters
  const updateUrlParams = useCallback((filters: any, page: number = 1) => {
    const newParams = new URLSearchParams();
    
    if (filters.search && filters.search.trim()) {
      newParams.set('search', filters.search.trim());
    }
    if (filters.governorate && filters.governorate !== 'all') {
      newParams.set('governorate', filters.governorate);
    }
    if (filters.organization_type && filters.organization_type !== 'all') {
      newParams.set('type', filters.organization_type);
    }
    if (page > 1) {
      newParams.set('page', page.toString());
    }
    
    setSearchParams(newParams, { replace: true });
  }, [setSearchParams]);

  // Create debounced search function
  const debouncedFetchOrganizations = useCallback(
    simpleDebounce((filters: any) => {
      setCurrentPage(1); // Reset to first page when filters change
      updateUrlParams(filters, 1);
      fetchOrganizations(1, filters);
    }, 500),
    [updateUrlParams]
  );

  // Handle filter changes with debouncing
  useEffect(() => {
    const filters = {
      search: searchTerm,
      governorate: selectedGovernorate,
      organization_type: selectedType
    };
    debouncedFetchOrganizations(filters);
  }, [searchTerm, selectedGovernorate, selectedType, debouncedFetchOrganizations]);

  // Pagination handlers
  const handleNextPage = () => {
    if (nextUrl) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      const filters = {
        search: searchTerm,
        governorate: selectedGovernorate,
        organization_type: selectedType
      };
      updateUrlParams(filters, newPage);
      fetchOrganizations(newPage, filters);
    }
  };

  const handlePrevPage = () => {
    if (prevUrl && currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      const filters = {
        search: searchTerm,
        governorate: selectedGovernorate,
        organization_type: selectedType
      };
      updateUrlParams(filters, newPage);
      fetchOrganizations(newPage, filters);
    }
  };

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  // Handle join organization click
  const handleJoinClick = (org: PublicOrganizationProfile) => {
    if (!isAuthenticated) {
      // Show warning and redirect to login with current URL (including all filters) as next parameter
      const currentUrl = `${location.pathname}${location.search}`;
      const loginUrl = `/login?next=${currentUrl}`;
      
      WarningAlert({
        title: 'تسجيل الدخول مطلوب',
        text: `يرجى تسجيل الدخول أولاً للانضمام إلى ${org.name}`,
        confirmText: 'تسجيل الدخول',
        cancelText: 'إلغاء',
        onConfirm: () => {
          navigate(loginUrl);
        }
      });
    } else if (user?.profile?.organization_request_sent) {
      // Show info that request is already sent
      WarningAlert({
        title: 'طلب انضمام معلق',
        text: 'لديك طلب انضمام معلق بالفعل. يرجى انتظار موافقة المؤسسة على طلبك الحالي.',
        confirmText: 'موافق'
      });
    } else {
      // Show confirmation dialog before sending join request
      WarningAlert({
        title: 'تأكيد طلب الانضمام',
        text: `هل أنت متأكد من أنك تريد إرسال طلب انضمام إلى ${org.name}؟\n\nتنبيه مهم: بمجرد إرسال طلب الانضمام، لن تتمكن من إرسال طلبات انضمام أخرى لمؤسسات أخرى حتى يتم معالجة  طلبك الحالي.`,
        confirmText: 'نعم، إرسال الطلب',
        cancelText: 'إلغاء',
        onConfirm: () => {
          handleJoinRequest(org);
        }
      });
    }
  };

  // Handle organization join request
  const handleJoinRequest = async (org: PublicOrganizationProfile) => {
    try {
      setJoiningOrgId(org.id);
      
      const response = await api.post(endpoints.organization.join, {
        org_id: org.id
      });
      
      if (response.data?.success) {
        SuccessAlert({
          title: 'تم إرسال طلب الانضمام',
          text: `تم إرسال طلب الانضمام إلى ${org.name} بنجاح. سيتم مراجعة طلبك من قبل إدارة المؤسسة.`,
          confirmText: 'موافق'
        });
        // Update user profile to mark request as sent
        if (user && user.profile) {
          dispatch(setUser({
            ...user,
            profile: {
              ...user.profile,
              organization_request_sent: true
            }
          }));
        }
      } else {
        throw new Error(response.data?.error || 'فشل في إرسال طلب الانضمام');
      }
    } catch (error: any) {
      console.error('Error joining organization:', error);
      
      let errorMessage = 'حدث خطأ أثناء إرسال طلب الانضمام. يرجى المحاولة مرة أخرى.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.status === 400) {
        errorMessage = 'طلب غير صحيح. تأكد من صحة البيانات المرسلة.';
      } else if (error.response?.status === 403) {
        errorMessage = 'ليس لديك صلاحية للانضمام إلى هذه المؤسسة.';
      } else if (error.response?.status === 409) {
        errorMessage = 'لديك طلب انضمام مُعلق بالفعل أو أنك عضو في هذه المؤسسة.';
      } else if (error.response?.status === 404) {
        errorMessage = 'المؤسسة المطلوبة غير موجودة.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'خطأ في الخادم. يرجى المحاولة لاحقاً.';
      }
      
      ErrorAlert({
        title: 'فشل في إرسال طلب الانضمام',
        text: errorMessage,
        confirmText: 'موافق'
      });
    } finally {
      setJoiningOrgId(null);
    }
  };

  // Get governorate name based on current language
  const getGovernorateName = (governorateCode: string) => {
    const gov = governorates.find(g => g.code === governorateCode);
    if (!gov) return governorateCode;
    
    switch (i18n.language) {
      case 'en': return gov.name_en;
      case 'ku': return gov.name_ku;
      default: return gov.name_ar;
    }
  };

  // Get type name based on current language
  const getTypeName = (type: string) => {
    const typeNames = {
      college: { ar: 'جامعة', en: 'College', ku: 'زانکۆ' },
      school: { ar: 'مدرسة', en: 'School', ku: 'قوتابخانە' },
      institute: { ar: 'معهد', en: 'Institute', ku: 'پەیمانگا' }
    };
    
    const typeName = typeNames[type as keyof typeof typeNames];
    if (!typeName) return type;
    
    switch (i18n.language) {
      case 'en': return typeName.en;
      case 'ku': return typeName.ku;
      default: return typeName.ar;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-slate-900 pt-24 pb-20 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-slate-600">جاري تحميل المنظمات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-24 pb-20 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-100 rounded-full opacity-20 -z-10"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-200 rounded-full opacity-15 -z-10"></div>

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900">
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              المنظمات التعليمية على منصة نقرأ
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            قائمة المؤسسات المسجلة على نظام نقرأ لإدارة الطلاب، الحضور، الباصات، الإشعارات والتعليم الذكي.
          </p>
          
          {/* Search */}
          <div className="flex items-center justify-center gap-2 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="search" 
                placeholder="ابحث عن مؤسستك التعليمية" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-3 pl-10 border border-slate-300 rounded-xl w-full text-center focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
              />
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Type Filters */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => setSelectedType('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-md ${
                selectedType === 'all' 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Filter className="inline w-4 h-4 mr-2" />
              الجميع
            </button>
            <button 
              onClick={() => setSelectedType('college')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                selectedType === 'college' 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Building className="inline w-4 h-4 mr-2" />
              جامعات
            </button>
            <button 
              onClick={() => setSelectedType('school')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                selectedType === 'school' 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Building className="inline w-4 h-4 mr-2" />
              مدارس
            </button>
            <button 
              onClick={() => setSelectedType('institute')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                selectedType === 'institute' 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Building className="inline w-4 h-4 mr-2" />
              معاهد
            </button>
          </div>

          {/* Governorate Filter */}
          <div className="flex justify-center">
            <select
              value={selectedGovernorate}
              onChange={(e) => setSelectedGovernorate(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-w-[200px]"
            >
              <option value="all">جميع المحافظات</option>
              {governorates.map((gov) => (
                <option key={gov.code} value={gov.code}>
                  {getGovernorateName(gov.code)}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
              <p className="text-red-600">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Results Summary */}
        <div className="text-center text-slate-600">
          {totalCount > 0 && (
            <p>عرض {startItem} - {endItem} من أصل {totalCount.toLocaleString()} مؤسسة</p>
          ) }
        </div>

        {/* Organizations list */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {organizations.map((org, index) => (
            <motion.div
              key={org.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index % 6) }}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group"
            >
              <img 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(org.name)}`} 
                alt={org.name} 
                className="w-full h-40 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300"
              />
              <h2 className="text-xl font-bold text-slate-900 mb-3">{org.name}</h2>
              <div className="space-y-2 mb-4">
                <p className="text-slate-700 font-medium flex items-center">
                  <Building className="w-4 h-4 text-emerald-500 ml-2" />
                  نوع المؤسسة: {getTypeName(org.organization_type || 'school')}
                </p>
                <p className="text-slate-700 font-medium flex items-center">
                  <MapPin className="w-4 h-4 text-emerald-500 ml-2" />
                  الموقع: {org.governorate ? getGovernorateName(org.governorate) : 'غير محدد'}
                </p>
                {org.students !== undefined && (
                  <p className="text-slate-700 font-medium flex items-center">
                    <Building className="w-4 h-4 text-emerald-500 ml-2" />
                    عدد الطلاب: {org.students.toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <button 
                  disabled={user?.organization === org.id || joiningOrgId === org.id || user?.profile?.organization_request_sent}
                  onClick={() => handleJoinClick(org)}
                  title="يمكنك ارسال طلب انضمام اذا كانت هذه هي المؤسسة التي انت مسجل فيها" 
                  className={`w-full py-3 disabled:bg-slate-500 disabled:cursor-not-allowed ${ user?.organization !== org.id && joiningOrgId !== org.id && !user?.profile?.organization_request_sent && 'bg-gradient-to-r from-emerald-600 to-teal-600' } text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-center gap-2`}
                >
                  {joiningOrgId === org.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      جاري الإرسال...
                    </>
                  ) : user?.organization === org.id ? (
                    'مؤسستك التعليمية'
                  ) : user?.profile?.organization_request_sent ? (
                    'تم إرسال الطلب'
                  ) : (
                    'الانضمام'
                  )}
                </button>
                <button className="w-full py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-200 transform hover:scale-105 shadow-md">
                  عرض التفاصيل
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination Controls */}
        {totalCount > pageSize && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-4 py-8"
          >
            <button
              onClick={handlePrevPage}
              disabled={!prevUrl || currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                prevUrl && currentPage > 1
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 transform hover:scale-105'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
              السابق
            </button>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
              <span className="text-slate-700">صفحة {currentPage.toLocaleString()} من {totalPages.toLocaleString()}</span>
            </div>
            
            <button
              onClick={handleNextPage}
              disabled={!nextUrl}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                nextUrl
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 transform hover:scale-105'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              التالي
              <ChevronLeft className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {organizations.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Building className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">لا توجد مؤسسات</h3>
            <p className="text-slate-500">لم نجد أي مؤسسات تطابق معايير البحث المحددة</p>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white"
        >
          <h3 className="text-3xl font-bold mb-4">هل ترغب في إضافة مؤسستك؟</h3>
          <p className="text-emerald-100 mb-8 text-lg max-w-2xl mx-auto">
            انضم إلى آلاف المؤسسات التعليمية التي تستخدم منصة نقرأ لتحسين تجربة التعليم.
          </p>
          <button className="px-8 py-4 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition duration-200 transform hover:scale-105 shadow-lg">
            تواصل معنا الآن
          </button>
        </motion.div>
      </div>
    </div>
  );
}
