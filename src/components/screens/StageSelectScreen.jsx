import { STAGES } from '../../data/gameData'
import { goToScreen, setSelectedStage, SCREENS } from '../../store/useUIStore'

const LockIcon = ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }}>
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" />
    </svg>
)

export default function StageSelectScreen() {
    function handleSelect(index) {
        if (STAGES[index].locked) return
        setSelectedStage(index)
        goToScreen(SCREENS.RIDER_SELECT)
    }

    return (
        <div className="game-screen" style={{ padding: '0 1rem 1rem' }}>
            {/* Header */}
            <div className="game-header">
                <button
                    className="game-back-btn"
                    onClick={() => goToScreen(SCREENS.MENU)}
                >
                    ← Back
                </button>
                <h1
                    className="game-title"
                    style={{ fontSize: 'clamp(1.1rem, 4.5vw, 1.6rem)', margin: 0 }}
                >
                    Select Stage
                </h1>
            </div>



            {/* Stage Grid */}
            <div
                className="animate-slide-up"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '1rem',
                    width: '100%',
                    maxWidth: '700px',
                    margin: '1rem auto',
                    flex: 1,
                    alignContent: 'start',
                }}
            >
                {STAGES.map((stage, index) => (
                    <div
                        key={stage.id}
                        className={`game-card ${stage.locked ? 'locked' : ''}`}
                        onClick={() => handleSelect(index)}
                        style={{
                            animationDelay: `${index * 0.1}s`,
                        }}
                    >
                        {/* Thumbnail */}
                        <div
                            style={{
                                width: '100%',
                                aspectRatio: '16 / 9',
                                backgroundImage: stage.thumbnail ? `url(${stage.thumbnail})` : stage.thumbnailGradient,
                                backgroundSize: 'cover, cover',
                                backgroundPosition: 'center',
                                position: 'relative',
                            }}
                        >
                            {/* Bottom gradient overlay */}
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '60%',
                                    background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                                }}
                            />

                            {/* Lock icon */}
                            {stage.locked && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'rgba(0,0,0,0.4)',
                                    }}
                                >
                                    <LockIcon size={36} />
                                </div>
                            )}

                            {/* Stage info */}
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '0.75rem',
                                    left: '1rem',
                                    right: '1rem',
                                }}
                            >
                                <h2
                                    className="game-title"
                                    style={{
                                        fontSize: '1.1rem',
                                        margin: 0,
                                        textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                                    }}
                                >
                                    {stage.name}
                                </h2>
                                <p
                                    style={{
                                        fontSize: '0.7rem',
                                        color: 'rgba(255,255,255,0.6)',
                                        margin: '0.25rem 0 0',
                                        fontFamily: 'var(--font-ui)',
                                    }}
                                >
                                    {stage.description}
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
