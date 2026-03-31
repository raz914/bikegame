export default function ProgressTrack({ progressPct, compact = false, className = '' }) {
    return (
        <div
            className={className}
            style={{
                width: '100%',
                height: compact ? '4px' : '6px',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.04)',
            }}
        >
            <div
                style={{
                    width: `${progressPct}%`,
                    height: '100%',
                    borderRadius: '10px',
                    background: 'linear-gradient(90deg, #FF6B00, #FF8C33, #ef4444)',
                    boxShadow: '0 0 10px rgba(255,107,0,0.4)',
                    transition: 'width 0.1s linear',
                }}
            />
        </div>
    )
}
