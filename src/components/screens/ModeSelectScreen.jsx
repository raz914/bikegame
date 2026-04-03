import { goToScreen, setSelectedGameMode, SCREENS, GAME_MODES } from '../../store/useUIStore'

const WheelieIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
        <circle cx="17" cy="17" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="7" cy="14" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9.5 13L14 8l3 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="14" cy="7" r="1.5" />
    </svg>
)

const ArcadeIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
        <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.18l6 3.75v7.14l-6 3.75-6-3.75V7.93l6-3.75z" />
        <circle cx="12" cy="12" r="2.5" fill="#FFD54F" />
        <path d="M12 6v2M12 16v2M6 12h2M16 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
)

const modes = [
    {
        id: GAME_MODES.CLASSIC,
        name: 'Classic',
        description: 'Balance wheelies and stoppies for points. Master weight control to keep the front wheel up!',
        icon: WheelieIcon,
        accent: '#FF6B00',
        accentBg: 'rgba(255, 107, 0, 0.12)',
        accentBorder: 'rgba(255, 107, 0, 0.3)',
    },
    {
        id: GAME_MODES.ARCADE,
        name: 'Arcade',
        description: 'Switch lanes, collect coins, and dodge obstacles. How far can you ride?',
        icon: ArcadeIcon,
        accent: '#38bdf8',
        accentBg: 'rgba(56, 189, 248, 0.12)',
        accentBorder: 'rgba(56, 189, 248, 0.3)',
    },
]

export default function ModeSelectScreen() {
    function handleSelect(modeId) {
        setSelectedGameMode(modeId)
        goToScreen(SCREENS.STAGE_SELECT)
    }

    return (
        <div className="game-screen" style={{ padding: '0 1rem 1rem' }}>
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
                    Select Mode
                </h1>
            </div>

            <div
                className="animate-slide-up"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    width: '100%',
                    maxWidth: '420px',
                    margin: '1.5rem auto',
                    flex: 1,
                    alignContent: 'start',
                }}
            >
                {modes.map((mode, index) => {
                    const Icon = mode.icon
                    return (
                        <button
                            key={mode.id}
                            onClick={() => handleSelect(mode.id)}
                            className="game-card"
                            style={{
                                animationDelay: `${index * 0.1}s`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1.25rem',
                                textAlign: 'left',
                                cursor: 'pointer',
                                border: `1px solid ${mode.accentBorder}`,
                                background: `linear-gradient(135deg, ${mode.accentBg} 0%, rgba(15,18,25,0.95) 100%)`,
                                width: '100%',
                            }}
                        >
                            <div
                                style={{
                                    width: '3.5rem',
                                    height: '3.5rem',
                                    borderRadius: '1rem',
                                    background: mode.accentBg,
                                    border: `1px solid ${mode.accentBorder}`,
                                    display: 'grid',
                                    placeItems: 'center',
                                    color: mode.accent,
                                    flexShrink: 0,
                                }}
                            >
                                <Icon />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                    className="game-title"
                                    style={{
                                        fontSize: '1.15rem',
                                        margin: 0,
                                        color: mode.accent,
                                    }}
                                >
                                    {mode.name}
                                </div>
                                <p
                                    style={{
                                        fontSize: '0.72rem',
                                        color: 'rgba(255,255,255,0.5)',
                                        margin: '0.3rem 0 0',
                                        fontFamily: 'var(--font-ui)',
                                        lineHeight: 1.4,
                                    }}
                                >
                                    {mode.description}
                                </p>
                            </div>
                        </button>
                    )
                })}
            </div>

            <div className="ad-banner-slot" style={{ marginTop: 'auto' }}>Ad Space</div>
        </div>
    )
}
