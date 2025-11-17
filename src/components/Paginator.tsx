import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface Props {
    currentPage: number;
    totalPages: number;
    onPageChange: (pageNumber: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  const { t } = useTranslation();

  // Don't render pagination if there's only one page or no pages
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7; // Maximum number of page buttons to show
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Smart pagination logic
      const leftSiblingIndex = Math.max(currentPage - 1, 1);
      const rightSiblingIndex = Math.min(currentPage + 1, totalPages);
      
      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPages - 2;
      
      const firstPageIndex = 1;
      const lastPageIndex = totalPages;
      
      if (!shouldShowLeftDots && shouldShowRightDots) {
        // No left dots, but right dots
        const leftItemCount = 3;
        const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
        pages.push(...leftRange, 'dots', lastPageIndex);
      } else if (shouldShowLeftDots && !shouldShowRightDots) {
        // Left dots, but no right dots
        const rightItemCount = 3;
        const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
        pages.push(firstPageIndex, 'dots', ...rightRange);
      } else if (shouldShowLeftDots && shouldShowRightDots) {
        // Both left and right dots
        const middleRange = Array.from({ length: 3 }, (_, i) => leftSiblingIndex + i);
        pages.push(firstPageIndex, 'dots', ...middleRange, 'dots', lastPageIndex);
      } else {
        // No dots needed
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center mt-6">
      <nav className="flex items-center gap-1" aria-label="صفحات التنقل">
        {/* Previous Button */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
          aria-label="الصفحة السابقة"
        >
          <ChevronRight className="size-4" />
          <span className="hidden sm:inline">{t('pagination.previous')}</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-2">
          {pageNumbers.map((page, index) => {
            if (page === 'dots') {
              return (
                <div
                  key={`dots-${index}`}
                  className="flex items-center justify-center w-10 h-10 text-gray-400"
                >
                  <MoreHorizontal className="size-4" />
                </div>
              );
            }

            const pageNumber = page as number;
            const isActive = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`flex items-center justify-center w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                }`}
                aria-label={`صفحة ${pageNumber}`}
                aria-current={isActive ? "page" : undefined}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
          aria-label="الصفحة التالية"
        >
          <span className="hidden sm:inline">{t('pagination.next')}</span>
          <ChevronLeft className="size-4" />
        </button>
      </nav>
    </div>
  );
}
