const VARIANT_STYLES = {
    weight: {
        outerBg: 'rgba(56, 189, 248, 0.12)',
        outerBorder: 'rgba(56, 189, 248, 0.25)',
        outerShadow: '0 10px 30px rgba(14, 116, 144, 0.2)',
        thumbBg: 'rgba(56, 189, 248, 0.18)',
        glowColor: 'rgba(56, 189, 248, 0.3)',
    },
    drive: {
        outerBg: 'rgba(255, 107, 0, 0.12)',
        outerBorder: 'rgba(255, 107, 0, 0.25)',
        outerShadow: '0 10px 30px rgba(194, 65, 12, 0.2)',
        thumbBg: 'rgba(255, 107, 0, 0.18)',
        glowColor: 'rgba(255, 107, 0, 0.3)',
    },
}

export default function ControlPad({
    variant,
    alignClassName,
    mobileLabel,
    zoneLabel,
    label,
    readout,
    topLabel,
    topValue,
    bottomLabel,
    bottomValue,
    thumbOffset,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onLostPointerCapture,
}) {
    const styles = VARIANT_STYLES[variant]

    return (
        <div
            className={alignClassName}
            style={{
                position: 'relative',
                height: '8.75rem',
                width: '5.25rem',
                borderRadius: '1.45rem',
                border: `1px solid ${styles.outerBorder}`,
                background: styles.outerBg,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                padding: '0.625rem',
                color: 'white',
                boxShadow: styles.outerShadow,
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onLostPointerCapture={onLostPointerCapture}
            onContextMenu={(event) => event.preventDefault()}
        >
            {/* Mobile label */}
            <div
                style={{
                    fontSize: '0.55rem',
                    fontFamily: 'var(--font-game)',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.45)',
                }}
            >
                {mobileLabel}
            </div>

            {/* Track area */}
            <div
                style={{
                    position: 'absolute',
                    left: '0.625rem',
                    right: '0.625rem',
                    top: '2rem',
                    bottom: '0.75rem',
                    borderRadius: '1rem',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(0,0,0,0.2)',
                }}
            >
                {/* Center line */}
                <div
                    style={{
                        position: 'absolute',
                        top: '0.625rem',
                        bottom: '0.625rem',
                        left: '50%',
                        width: '1px',
                        transform: 'translateX(-50%)',
                        background: 'rgba(255,255,255,0.1)',
                    }}
                />

                {/* Thumb */}
                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        width: '2.25rem',
                        height: '2.25rem',
                        transform: 'translateX(-50%)',
                        borderRadius: '50%',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.12)',
                        boxShadow: `0 4px 16px rgba(0,0,0,0.2), 0 0 12px ${styles.glowColor}`,
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                        transition: 'top 75ms ease-out',
                        top: thumbOffset,
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            inset: '0.2rem',
                            borderRadius: '50%',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: styles.thumbBg,
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
