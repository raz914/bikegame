import { RIDERS } from '../../data/gameData'
import { goToScreen, setSelectedRider, SCREENS } from '../../store/useUIStore'

const LockIcon = ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }}>
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" />
    </svg>
)

export default function RiderSelectScreen() {
    function handleSelect(index) {
        if (RIDERS[index].locked) return
        setSelectedRider(index)
        goToScreen(SCREENS.BIKE_SELECT)
    }

    return (
        <div className="game-screen" style={{ padding: '0 1rem 1rem' }}>
            {/* Header */}
            <div className="game-header">
                <button
                    className="game-back-btn"
                    onClick={() => goToScreen(SCREENS.STAGE_SELECT)}
                >
                    ← Back
                </button>
                <h1
                    className="game-title"
                    style={{ fontSize: 'clamp(1.1rem, 4.5vw, 1.6rem)', margin: 0 }}
                >
                    Select Rider
                </h1>
            </div>

            {/* Rider Grid */}
            <div
                className="animate-slide-up"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                    gap: '1rem',
                    width: '100%',
                    maxWidth: '500px',
                    margin: '1.5rem auto',
                    flex: 1,
                    alignContent: 'start',
                }}
            >
                {RIDERS.map((rider, index) => (
                    <div
                        key={rider.id}
                        className={`game-card ${rider.locked ? 'locked' : ''}`}
                        onClick={() => handleSelect(index)}
                        style={{ animationDelay: `${index * 0.12}s` }}
                    >
                        {/* Portrait */}
                        <div
                            style={{
                                width: '100%',
                                aspectRatio: '3 / 4',
                                backgroundImage: `url(${rider.thumbnail})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center top',
                                position: 'relative',
                            }}
                        >
                            {/* Bottom gradient */}
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '50%',
                                    background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                                }}
                            />

                            {/* Lock overlay */}
                            {rider.locked && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'rgba(0,0,0,0.45)',
                                    }}
                                >
                                    <LockIcon size={28} />
                                </div>
                            )}

                            {/* Name + style */}
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '0.75rem',
                                    left: '0.75rem',
                                    right: '0.75rem',
                                    textAlign: 'center',
                                }}
                            >
                                <h2
                                    className="game-title"
                                    style={{
                                        fontSize: '1rem',
                                        margin: 0,
                                    }}
                                >
                                    {rider.name}
                                </h2>
                                <p
                                    style={{
                                        fontSize: '0.65rem',
                                        color: 'rgba(255,255,255,0.5)',
                                        margin: '0.2rem 0 0',
                                        fontFamily: 'var(--font-ui)',
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    {rider.style}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ad banner */}
            <div className="ad-banner-slot" style={{ marginTop: 'auto' }}>Ad Space</div>
        </div>
    )
}
