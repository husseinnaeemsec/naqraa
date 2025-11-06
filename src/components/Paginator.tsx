interface Props {
    currentPage:number;
    totalPages:number;
    onPageChange:( pageNumber:number )=> void;
}
export default function Pagination({ currentPage, totalPages, onPageChange } : Props ) {

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center mt-6 gap-2">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 border bg-white rounded disabled:opacity-50"
      >
        السابق
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 border rounded ${
            page === currentPage ? "bg-emerald-500 text-white" : "bg-white"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 border bg-white rounded disabled:opacity-50"
      >
        التالي
      </button>
    </div>
  );
}
