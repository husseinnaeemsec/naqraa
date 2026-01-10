export default function Spinner({ className }: { className?: string }) {

    return (
        <div className="flex justify-center items-center py-8">
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${className || 'border-slate-500'} `}></div>
        </div>
    )
}