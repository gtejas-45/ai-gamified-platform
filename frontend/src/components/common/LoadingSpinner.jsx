// Animated loading spinner used when fetching data or processing AI tasks

export default function LoadingSpinner({ size = 'md', label = '' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-10 h-10', lg: 'w-16 h-16' }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} relative`}>
        {/* Outer ring – slow, subtle */}
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent opacity-20"
          style={{ borderTopColor: '#6366f1' }}
        />
        {/* Main spinning ring */}
        <div
          className={`${sizes[size]} rounded-full border-2 border-transparent animate-spin`}
          style={{ borderTopColor: '#6366f1', borderRightColor: '#8b5cf6' }}
        />
        {/* Pulsing centre dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
        </div>
      </div>
      {label && <p className="text-sm text-slate-400 animate-pulse">{label}</p>}
    </div>
  )
}

// Full-page loading overlay
export function PageLoader({ label = 'Loading...' }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50"
         style={{ background: 'rgba(10,15,30,0.95)' }}>
      <LoadingSpinner size="lg" label={label} />
    </div>
  )
}
