import { useState } from 'react'
import { BIKES } from '../../data/gameData'
import { goToScreen, setSelectedBike, SCREENS, useUIState } from '../../store/useUIStore'

const LockIcon = ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }}>
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" />
    </svg>
)
const ChevronLeft = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
)
const ChevronRight = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
)

export default function BikeSelectScreen() {
    const selectedBike = useUIState((s) => s.selectedBike)
    const [currentIndex, setCurrentIndex] = useState(selectedBike)
    const bike = BIKES[currentIndex]

    function handlePrev() {
        setCurrentIndex((i) => (i > 0 ? i - 1 : BIKES.length - 1))
    }

    function handleNext() {
        setCurrentIndex((i) => (i < BIKES.length - 1 ? i + 1 : 0))
    }

    function handleRide() {
        if (bike.locked) return
        setSelectedBike(currentIndex)
        goToScreen(SCREENS.GAMEPLAY)
    }

    return (
        <div className="game-screen" style={{ padding: '0 1rem 1rem' }}>
            {/* Header */}
            <div className="game-header">
                <button
                    className="game-back-btn"
                    onClick={() => goToScreen(SCREENS.RIDER_SELECT)}
                >
                    ← Back
                </button>
                <div
                    style={{
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '50px',
                        padding: '0.4rem 1.25rem',
                    }}
                >
                    <span
                        className="game-title"
                        style={{ fontSize: '0.75rem', letterSpacing: '0.2em' }}
                    >
                        Select Bike
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div
                className="animate-fade-in"
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    maxWidth: '500px',
                    margin: '0 auto',
                    gap: '1.5rem',
                    position: 'relative',
                }}
            >
                {/* Bike Preview Area */}
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {/* Left Arrow */}
                    <button
                        onClick={handlePrev}
                        style={{
                            position: 'absolute',
                            left: 0,
                            zIndex: 2,
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '2.5rem',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                            transition: 'transform 0.15s',
                        }}
                        onPointerDown={(e) => { e.currentTarget.style.transform = 'scale(0.85)' }}
                        onPointerUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                    >
                        <ChevronLeft />
                    </button>

                    {/* Bike Image */}
                    <div
                        style={{
                            width: '100%',
                            maxWidth: '360px',
                            aspectRatio: '4 / 3',
                            position: 'relative',
                        }}
                    >
                        {/* Glow behind bike */}
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '10%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '80%',
                                height: '40%',
                                borderRadius: '50%',
                                background: bike.locked
                                    ? 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)'
                                    : 'radial-gradient(circle, rgba(255,107,0,0.15) 0%, transparent 70%)',
                                pointerEvents: 'none',
                            }}
                        />

                        <img
                            key={bike.id}
                            src={bike.thumbnail}
                            alt={bike.name}
                            className="animate-fade-in-scale"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                filter: bike.locked
                                    ? 'grayscale(0.7) brightness(0.5)'
                                    : 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))',
                            }}
                        />

                        {/* Lock overlay */}
                        {bike.locked && (
                            <div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <LockIcon size={40} />
                            </div>
                        )}
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={handleNext}
                        style={{
                            position: 'absolute',
                            right: 0,
                            zIndex: 2,
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '2.5rem',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                            transition: 'transform 0.15s',
                        }}
                        onPointerDown={(e) => { e.currentTarget.style.transform = 'scale(0.85)' }}
                        onPointerUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                    >
                        <ChevronRight />
                    </button>
                </div>

                {/* Bike Info */}
                <div style={{ textAlign: 'center' }}>
                    <h2
                        className="game-title"
                        style={{
                            fontSize: 'clamp(1.3rem, 5vw, 1.8rem)',
                            margin: 0,
                            textShadow: '0 2px 12px rgba(255,107,0,0.25)',
                        }}
                    >
                        {bike.name}
                    </h2>
                    <p
                        style={{
                            fontSize: '0.8rem',
                            color: 'rgba(255,255,255,0.5)',
                            margin: '0.4rem 0 0',
                            fontFamily: 'var(--font-ui)',
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                        }}
                    >
                        {bike.specs}
                    </p>
                </div>

                {/* Dot indicators */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {BIKES.map((_, i) => (
                        <div
                            key={i}
                            style={{
                                width: i === currentIndex ? '24px' : '8px',
                                height: '8px',
                                borderRadius: '4px',
                                background: i === currentIndex
                                    ? 'linear-gradient(90deg, #FF6B00, #FF8C33)'
                                    : 'rgba(255,255,255,0.15)',
                                transition: 'all 0.3s ease',
                                boxShadow: i === currentIndex ? '0 0 8px rgba(255,107,0,0.4)' : 'none',
                            }}
                        />
                    ))}
                </div>

                {/* RIDE Button */}
                <button
                    className={`game-btn ${bike.locked ? 'game-btn-dark' : 'game-btn-green'}`}
                    onClick={handleRide}
                    disabled={bike.locked}
                    style={{
                        fontSize: '1.2rem',
                        padding: '1rem 3rem',
                        minWidth: '200px',
                        opacity: bike.locked ? 0.4 : 1,
                        cursor: bike.locked ? 'not-allowed' : 'pointer',
                    }}
                >
                    {bike.locked ? 'Locked' : 'Ride'}
                </button>
            </div>

            {/* Ad banner */}
            <div className="ad-banner-slot">Ad Space</div>
        </div>
    )
}
