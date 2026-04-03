import { useEffect, useMemo, useState } from 'react'
import {
    resetGameplayTuningState,
    setGameplayDebugPanelOpen,
    setGameplayTuningState,
    useGameplayDebugPanelOpen,
    useGameplayTuning,
} from '../../store/useGameplayTuningStore'
import { useGameState } from '../../store/useGameStore'

const CONTROL_GROUPS = [
    {
        title: 'Drive',
        group: 'drive',
        controls: [
            { key: 'maxSpeed', label: 'Max Speed', min: 5, max: 80, step: 1 },
            { key: 'acceleration', label: 'Acceleration', min: 1, max: 40, step: 0.5 },
            { key: 'friction', label: 'Friction', min: 0.5, max: 15, step: 0.25 },
            { key: 'brakeStrength', label: 'Brake Strength', min: 1, max: 25, step: 0.5 },
            { key: 'throttleDragReduction', label: 'Throttle Drag Reduction', min: 0, max: 1, step: 0.05 },
            { key: 'overRotationSpeedPenalty', label: 'Over-Rotation Penalty', min: 0, max: 20, step: 0.5 },
            { key: 'overRotationAngleOffset', label: 'Penalty Angle Offset', min: 0, max: 20, step: 1 },
        ],
    },
    {
        title: 'Pitch',
        group: 'pitch',
        controls: [
            { key: 'liftTorque', label: 'Lift Torque', min: 20, max: 400, step: 5 },
            { key: 'forwardLiftTorque', label: 'Forward Lift Torque', min: 20, max: 400, step: 5 },
            { key: 'settleTorque', label: 'Settle Torque', min: 20, max: 500, step: 5 },
            { key: 'forwardSettleTorque', label: 'Forward Settle Torque', min: 20, max: 500, step: 5 },
            { key: 'gravityTorque', label: 'Gravity Torque', min: 5, max: 300, step: 5 },
            { key: 'angularDamping', label: 'Angular Damping', min: 0.5, max: 12, step: 0.25 },
            { key: 'maxAngle', label: 'Max Angle', min: 30, max: 90, step: 1 },
            { key: 'forwardMaxAngle', label: 'Forward Max Angle', min: 15, max: 60, step: 1 },
            { key: 'validMinAngle', label: 'Valid Min Angle', min: 1, max: 30, step: 1 },
            { key: 'stoppieMinAngle', label: 'Stoppie Min Angle', min: 1, max: 30, step: 1 },
            { key: 'validMaxMargin', label: 'Valid Max Margin', min: 0, max: 15, step: 1 },
        ],
    },
    {
        title: 'Rider Control',
        group: 'riderControl',
        controls: [
            { key: 'throttleLiftBase', label: 'Throttle Lift Base', min: 0, max: 2, step: 0.05 },
            { key: 'leanBackLiftBonus', label: 'Lean Back Lift Bonus', min: 0, max: 2, step: 0.05 },
            { key: 'speedLiftFactor', label: 'Speed Lift Factor', min: 0, max: 30, step: 1 },
            { key: 'leanBackDirectLift', label: 'Lean Back Direct Lift', min: 0, max: 30, step: 1 },
            { key: 'launchAssistTorque', label: 'Launch Assist Torque', min: 0, max: 400, step: 5 },
            { key: 'launchAssistMaxAngle', label: 'Launch Assist Angle', min: 0, max: 30, step: 1 },
            { key: 'brakeLiftBase', label: 'Brake Lift Base', min: 0, max: 2, step: 0.05 },
            { key: 'forwardWeightLiftBonus', label: 'Forward Weight Lift Bonus', min: 0, max: 2, step: 0.05 },
            { key: 'brakeLiftMinSpeedRatio', label: 'Brake Lift Min Speed', min: 0, max: 0.5, step: 0.01 },
            { key: 'brakeSpeedLiftFactor', label: 'Brake Speed Lift Factor', min: 0, max: 40, step: 1 },
            { key: 'forwardWeightDirectLift', label: 'Forward Weight Direct Lift', min: 0, max: 40, step: 1 },
            { key: 'brakeLaunchAssistTorque', label: 'Brake Launch Assist', min: 0, max: 300, step: 5 },
            { key: 'brakeLaunchAssistMaxAngle', label: 'Brake Launch Angle', min: 0, max: 20, step: 1 },
            { key: 'brakeSettleBase', label: 'Brake Settle Base', min: 0, max: 2, step: 0.05 },
            { key: 'leanForwardSettleFactor', label: 'Lean Forward Settle', min: 0, max: 2, step: 0.05 },
            { key: 'settleBaseRate', label: 'Settle Base Rate', min: 0, max: 2, step: 0.05 },
            { key: 'settleControlScale', label: 'Settle Control Scale', min: 0, max: 2, step: 0.05 },
            { key: 'settleAngleRecovery', label: 'Settle Angle Recovery', min: 0, max: 2, step: 0.05 },
            { key: 'throttleStoppieRecoveryBase', label: 'Throttle Stoppie Recovery', min: 0, max: 2, step: 0.05 },
            { key: 'backWeightStoppieRecoveryBonus', label: 'Back Weight Recovery', min: 0, max: 2, step: 0.05 },
            { key: 'stoppieRecoveryBaseRate', label: 'Stoppie Recovery Base', min: 0, max: 2, step: 0.05 },
            { key: 'stoppieRecoveryControlScale', label: 'Stoppie Recovery Control', min: 0, max: 2, step: 0.05 },
            { key: 'stoppieRecoveryAngleScale', label: 'Stoppie Recovery Angle', min: 0, max: 2, step: 0.05 },
            { key: 'passiveDropSpeedFactor', label: 'Passive Drop Speed', min: 0, max: 30, step: 1 },
            { key: 'passiveDropAngleRecovery', label: 'Passive Drop Angle', min: 0, max: 50, step: 1 },
            { key: 'releaseDropBoost', label: 'Release Drop Boost', min: 0, max: 300, step: 5 },
            { key: 'forwardReleaseRecoveryBoost', label: 'Forward Release Recovery', min: 0, max: 300, step: 5 },
        ],
    },
    {
        title: 'Balance',
        group: 'balance',
        controls: [
            { key: 'driftBase', label: 'Drift Base', min: 0, max: 30, step: 1 },
            { key: 'driftSpeedFactor', label: 'Drift Speed Factor', min: 0, max: 40, step: 1 },
            { key: 'driftWaveFreq1', label: 'Wave Freq 1', min: 0.1, max: 3, step: 0.05 },
            { key: 'driftWaveFreq2', label: 'Wave Freq 2', min: 0.5, max: 6, step: 0.1 },
            { key: 'driftWaveAmp2', label: 'Wave 2 Amplitude', min: 0, max: 1, step: 0.05 },
            { key: 'driftInfluence', label: 'Drift Influence', min: 0, max: 1, step: 0.02 },
            { key: 'roadKickFreq', label: 'Road Kick Freq', min: 0.5, max: 8, step: 0.1 },
            { key: 'roadKickInfluence', label: 'Road Kick Influence', min: 0, max: 1, step: 0.02 },
            { key: 'minSpeedForDrift', label: 'Min Speed for Drift', min: 0, max: 10, step: 0.5 },
            { key: 'wheelieChaosBase', label: 'Wheelie Chaos Base', min: 0, max: 30, step: 1 },
            { key: 'wheelieChaosBuildRate', label: 'Chaos Build Rate', min: 0, max: 40, step: 1 },
            { key: 'wheelieChaosCap', label: 'Chaos Cap', min: 0, max: 60, step: 1 },
            { key: 'perfectChaosBonus', label: 'Perfect Chaos Bonus', min: 0, max: 30, step: 1 },
            { key: 'wheelieChaosFreq1', label: 'Chaos Freq 1', min: 1, max: 20, step: 0.5 },
            { key: 'wheelieChaosFreq2', label: 'Chaos Freq 2', min: 1, max: 24, step: 0.5 },
            { key: 'wheelieChaosMix', label: 'Chaos Wave Mix', min: 0, max: 1, step: 0.05 },
            { key: 'backFallStartAngle', label: 'Back Fall Start', min: 20, max: 55, step: 1 },
            { key: 'backFallTorque', label: 'Back Fall Torque', min: 0, max: 100, step: 1 },
            { key: 'backFallSpeedFactor', label: 'Back Fall Speed Factor', min: 0, max: 60, step: 1 },
            { key: 'backFallChaos', label: 'Back Fall Chaos', min: 0, max: 40, step: 1 },
            { key: 'frontDriftBase', label: 'Front Drift Base', min: 0, max: 30, step: 1 },
            { key: 'frontDriftSpeedFactor', label: 'Front Drift Speed', min: 0, max: 40, step: 1 },
            { key: 'frontDriftWaveFreq1', label: 'Front Wave Freq 1', min: 0.5, max: 8, step: 0.1 },
            { key: 'frontDriftWaveFreq2', label: 'Front Wave Freq 2', min: 0.5, max: 10, step: 0.1 },
            { key: 'frontDriftWaveMix', label: 'Front Wave Mix', min: 0, max: 1, step: 0.05 },
            { key: 'frontDriftInfluence', label: 'Front Drift Influence', min: 0, max: 1, step: 0.02 },
            { key: 'frontFallStartAngle', label: 'Front Fall Start', min: 8, max: 35, step: 1 },
            { key: 'frontFallTorque', label: 'Front Fall Torque', min: 0, max: 100, step: 1 },
            { key: 'frontFallSpeedFactor', label: 'Front Fall Speed Factor', min: 0, max: 60, step: 1 },
            { key: 'frontFallChaos', label: 'Front Fall Chaos', min: 0, max: 40, step: 1 },
        ],
    },
    {
        title: 'Scoring',
        group: 'scoring',
        controls: [
            { key: 'perfectAngle', label: 'Perfect Angle', min: 10, max: 80, step: 1 },
            { key: 'perfectWindow', label: 'Perfect Window', min: 1, max: 20, step: 1 },
            { key: 'perfectMultiplier', label: 'Perfect Multiplier', min: 1, max: 6, step: 0.1 },
            { key: 'baseScoreRate', label: 'Base Score Rate', min: 0.1, max: 2, step: 0.05 },
            { key: 'angleScoreDivisor', label: 'Angle Score Divisor', min: 10, max: 80, step: 1 },
            { key: 'minSpeedForValid', label: 'Min Speed for Valid', min: 0, max: 10, step: 0.5 },
        ],
    },
    {
        title: 'Visuals',
        group: 'visuals',
        controls: [
            { key: 'bobFrequency', label: 'Bob Frequency', min: 1, max: 20, step: 1 },
            { key: 'bobAmplitude', label: 'Bob Amplitude', min: 0, max: 0.1, step: 0.005 },
            { key: 'wheelSpinRate', label: 'Wheel Spin Rate', min: 0.5, max: 8, step: 0.1 },
        ],
    },
]

function formatValue(value, digits = 2) {
    return Number(value).toFixed(digits)
}

function SliderField({ group, control, value }) {
    const { key, label, min, max, step } = control

    const handleChange = (nextValue) => {
        const parsed = Number(nextValue)
        if (Number.isNaN(parsed)) return
        setGameplayTuningState({ [group]: { [key]: parsed } })
    }

    return (
        <label className="block rounded-2xl bg-white/5 px-3 py-2">
            <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                    {label}
                </span>
                <input
                    type="number"
                    className="w-20 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-right text-xs text-white outline-none"
                    min={min}
                    max={max}
                    step={step}
                    value={formatValue(value)}
                    onChange={(e) => handleChange(e.target.value)}
                />
            </div>
            <input
                type="range"
                className="w-full accent-cyan-400"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => handleChange(e.target.value)}
            />
        </label>
    )
}

function TelemetryRow({ label, value, unit }) {
    return (
        <div className="flex items-center justify-between py-0.5">
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/50">{label}</span>
            <span className="font-mono text-xs text-white/90">
                {value}
                {unit && <span className="ml-0.5 text-white/40">{unit}</span>}
            </span>
        </div>
    )
}

function Telemetry() {
    const speed = useGameState((s) => s.speed)
    const angle = useGameState((s) => s.wheelieAngle)
    const pitchVel = useGameState((s) => s.pitchVelocity)
    const throttle = useGameState((s) => s.throttle)
    const brake = useGameState((s) => s.brake)
    const riderWeight = useGameState((s) => s.riderWeight)
    const balanceMode = useGameState((s) => s.balanceMode)
    const crashKind = useGameState((s) => s.crashKind)
    const wheelieValid = useGameState((s) => s.wheelieValid)
    const stoppieValid = useGameState((s) => s.stoppieValid)
    const perfectBalance = useGameState((s) => s.perfectBalance)

    return (
        <section className="space-y-1 rounded-2xl bg-white/5 px-3 py-2">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300/60">
                Telemetry
            </div>
            <TelemetryRow label="Speed" value={speed.toFixed(1)} unit="u/s" />
            <TelemetryRow label="Pitch Angle" value={angle.toFixed(1)} unit="deg" />
            <TelemetryRow label="Pitch Velocity" value={pitchVel.toFixed(1)} unit="deg/s" />
            <TelemetryRow label="Throttle" value={(throttle * 100).toFixed(0)} unit="%" />
            <TelemetryRow label="Brake" value={(brake * 100).toFixed(0)} unit="%" />
            <TelemetryRow label="Rider Weight" value={riderWeight.toFixed(2)} />
            <TelemetryRow label="Balance Mode" value={balanceMode} />
            <TelemetryRow label="Crash Kind" value={crashKind ?? 'none'} />
            <div className="flex gap-2 pt-1">
                {wheelieValid && (
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-300">
                        Wheelie
                    </span>
                )}
                {stoppieValid && (
                    <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-sky-300">
                        Stoppie
                    </span>
                )}
                {perfectBalance && (
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-300">
                        Perfect
                    </span>
                )}
            </div>
        </section>
    )
}

export default function GameplayDebugPanel() {
    const tuning = useGameplayTuning()
    const isOpen = useGameplayDebugPanelOpen()
    const [copied, setCopied] = useState(false)

    const tuningJson = useMemo(() => JSON.stringify(tuning, null, 2), [tuning])

    useEffect(() => {
        if (!copied) return undefined
        const id = window.setTimeout(() => setCopied(false), 1500)
        return () => window.clearTimeout(id)
    }, [copied])

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(tuningJson)
            setCopied(true)
        } catch {
            setCopied(false)
        }
    }

    return (
        <div className="pointer-events-auto absolute left-3 top-24 z-20 hidden md:block">
            {isOpen ? (
                <aside className="w-[22rem] overflow-hidden rounded-[1.75rem] border border-white/15 bg-slate-950/70 text-white shadow-[0_24px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl">
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                        <div>
                            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
                                Debug
                            </div>
                            <div className="text-sm font-semibold text-white/90">
                                Gameplay Tuning
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 transition hover:border-white/25 hover:text-white"
                                onClick={handleCopy}
                            >
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                            <button
                                type="button"
                                className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100 transition hover:border-cyan-100/30 hover:bg-cyan-300/20"
                                onClick={resetGameplayTuningState}
                            >
                                Reset
                            </button>
                            <button
                                type="button"
                                className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 transition hover:border-white/25 hover:text-white"
                                onClick={() => setGameplayDebugPanelOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>

                    <div className="max-h-[62vh] space-y-4 overflow-y-auto px-4 py-4">
                        <Telemetry />

                        {CONTROL_GROUPS.map((section) => (
                            <section key={section.group} className="space-y-2">
                                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
                                    {section.title}
                                </div>

                                <div className="space-y-2">
                                    {section.controls.map((control) => (
                                        <SliderField
                                            key={control.key}
                                            group={section.group}
                                            control={control}
                                            value={tuning[section.group][control.key]}
                                        />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </aside>
            ) : (
                <button
                    type="button"
                    className="rounded-full border border-white/15 bg-slate-950/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl transition hover:border-white/25 hover:text-white"
                    onClick={() => setGameplayDebugPanelOpen(true)}
                >
                    Gameplay Tuning
                </button>
            )}
        </div>
    )
}
