import {
    goToScreen,
    SCREENS,
    GRAPHICS_QUALITY,
    useUIState,
    toggleSfx,
    toggleMusic,
    setGraphicsQuality,
} from '../../store/useUIStore'

/* ─── SVG Icons ─────────────────────────────────── */
const SpeakerOnIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8.77v6.46A4.48 4.48 0 0 0 16.5 12zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
)
const SpeakerOffIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.5 12A4.5 4.5 0 0 0 14 8.77v2.06l2.45 2.45c.03-.1.05-.2.05-.28zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.89 8.89 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
    </svg>
)
const MusicOnIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
    </svg>
)
const MusicOffIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" opacity="0.3" />
        <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
)

/* ─── Toggle Switch ─────────────────────────────── */
function ToggleSwitch({ enabled, onToggle, label, icon, iconOff }) {
    return (
        <button
            onClick={onToggle}
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '1rem',
                color: 'var(--color-text)',
                cursor: 'pointer',
                transition: 'background 0.2s',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ color: enabled ? 'var(--color-accent)' : 'rgba(255,255,255,0.25)' }}>
                    {enabled ? icon : (iconOff || icon)}
                </div>
                <span
                    style={{
                        fontFamily: 'var(--font-game)',
                        fontSize: '0.85rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                    }}
                >
                    {label}
                </span>
            </div>

            {/* Toggle track */}
            <div
                style={{
                    width: '52px',
                    height: '28px',
                    borderRadius: '14px',
                    background: enabled
                        ? 'linear-gradient(135deg, #FF6B00, #FF8C33)'
                        : 'rgba(255,255,255,0.1)',
                    padding: '3px',
                    transition: 'background 0.25s ease',
                    flexShrink: 0,
                    boxShadow: enabled ? '0 0 12px rgba(255,107,0,0.3)' : 'none',
                }}
            >
                <div
                    style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: enabled ? '#fff' : 'rgba(255,255,255,0.35)',
                        transition: 'transform 0.25s ease, background 0.25s ease',
                        transform: enabled ? 'translateX(24px)' : 'translateX(0)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    }}
                />
            </div>
        </button>
    )
}

/* ─── Quality Selector ──────────────────────────── */
function QualitySelector({ current, onChange }) {
    const options = [
        { value: GRAPHICS_QUALITY.LOW, label: 'Low' },
        { value: GRAPHICS_QUALITY.MEDIUM, label: 'Med' },
        { value: GRAPHICS_QUALITY.HIGH, label: 'High' },
    ]

    return (
        <div
            style={{
                width: '100%',
                padding: '1rem 1.25rem',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '1rem',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--color-accent)">
                    <path d="M15 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9l-6-6zM5 19V5h9v5h5v9H5zm4-5h2v3h2v-3h2l-3-3-3 3z" />
                </svg>
                <span
                    style={{
                        fontFamily: 'var(--font-game)',
                        fontSize: '0.85rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--color-text)',
                    }}
                >
                    Graphics
                </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
                {options.map((opt) => {
                    const isActive = current === opt.value
                    return (
                        <button
                            key={opt.value}
                            onClick={() => onChange(opt.value)}
                            style={{
                                flex: 1,
                                padding: '0.625rem 0.5rem',
                                borderRadius: '0.625rem',
                                border: isActive
                                    ? '1px solid var(--color-accent)'
                                    : '1px solid rgba(255,255,255,0.1)',
                                background: isActive
                                    ? 'rgba(255,107,0,0.15)'
                                    : 'rgba(255,255,255,0.04)',
                                color: isActive ? 'var(--color-accent)' : 'rgba(255,255,255,0.5)',
                                fontFamily: 'var(--font-game)',
                                fontSize: '0.75rem',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: isActive ? '0 0 12px rgba(255,107,0,0.2)' : 'none',
                            }}
                        >
                            {opt.label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

/* ─── Settings Screen ───────────────────────────── */
export default function SettingsScreen() {
    const sfxEnabled = useUIState((s) => s.sfxEnabled)
    const musicEnabled = useUIState((s) => s.musicEnabled)
    const graphicsQuality = useUIState((s) => s.graphicsQuality)

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
                    Settings
                </h1>
            </div>

            {/* Settings Content */}
            <div
                className="animate-slide-up"
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    margin: '1.5rem auto 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    flex: 1,
                }}
            >
                {/* Section label */}
                <p
                    style={{
                        fontSize: '0.6rem',
                        fontFamily: 'var(--font-game)',
                        letterSpacing: '0.25em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.3)',
                        marginBottom: '0.25rem',
                        paddingLeft: '0.25rem',
                    }}
                >
                    Audio
                </p>

                <ToggleSwitch
                    enabled={sfxEnabled}
                    onToggle={toggleSfx}
                    label="Sound FX"
                    icon={<SpeakerOnIcon />}
                    iconOff={<SpeakerOffIcon />}
                />

                <ToggleSwitch
                    enabled={musicEnabled}
                    onToggle={toggleMusic}
                    label="Music"
                    icon={<MusicOnIcon />}
                    iconOff={<MusicOffIcon />}
                />

                {/* Divider */}
                <div
                    style={{
                        height: '1px',
                        background: 'rgba(255,255,255,0.06)',
                        margin: '0.5rem 0',
                    }}
                />

                {/* Graphics section label */}
                <p
                    style={{
                        fontSize: '0.6rem',
                        fontFamily: 'var(--font-game)',
                        letterSpacing: '0.25em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.3)',
                        marginBottom: '0.25rem',
                        paddingLeft: '0.25rem',
                    }}
                >
                    Performance
                </p>

                <QualitySelector
                    current={graphicsQuality}
                    onChange={setGraphicsQuality}
                />

                {/* Quality description */}
                <p
                    style={{
                        fontSize: '0.7rem',
                        color: 'rgba(255,255,255,0.25)',
                        fontFamily: 'var(--font-ui)',
                        textAlign: 'center',
                        lineHeight: 1.5,
                        padding: '0 0.5rem',
                    }}
                >
                    {graphicsQuality === GRAPHICS_QUALITY.HIGH && 'Best visuals. May affect performance on older devices.'}
                    {graphicsQuality === GRAPHICS_QUALITY.MEDIUM && 'Balanced visuals and performance.'}
                    {graphicsQuality === GRAPHICS_QUALITY.LOW && 'Optimized for smooth gameplay on all devices.'}
                </p>
            </div>

            {/* Ad banner */}
            <div className="ad-banner-slot" style={{ marginTop: 'auto' }}>Ad Space</div>
        </div>
    )
}
