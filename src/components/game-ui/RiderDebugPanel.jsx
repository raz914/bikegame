import { useEffect, useMemo, useState } from 'react'
import {
    resetRiderTuningState,
    setRiderDebugPanelOpen,
    setRiderTuningState,
    useRiderDebugPanelOpen,
    useRiderTuning,
} from '../../store/useRiderTuningStore'

const CONTROL_GROUPS = [
    {
        title: 'Placement',
        controls: [
            { key: 'scale', label: 'Scale', min: 0.6, max: 1.2, step: 0.01 },
            { key: 'yaw', label: 'Yaw', min: -Math.PI, max: Math.PI, step: 0.01 },
            { key: 'seatXRatio', label: 'Seat X Ratio', min: 0, max: 1, step: 0.01 },
            { key: 'seatYRatio', label: 'Seat Y Ratio', min: -0.5, max: 1, step: 0.01 },
            { key: 'seatYOffset', label: 'Seat Y Offset', min: -1, max: 1, step: 0.01 },
            { key: 'seatZOffset', label: 'Seat Z Offset', min: -1, max: 1, step: 0.01 },
        ],
    },
    {
        title: 'Torso',
        controls: [
            { key: 'hipsOffsetY', label: 'Hips Y Offset', min: -40, max: 20, step: 0.5 },
            { key: 'hipsOffsetZ', label: 'Hips Z Offset', min: -20, max: 20, step: 0.5 },
            { key: 'hipsPitch', label: 'Hips Pitch', min: -1.5, max: 1.5, step: 0.01 },
            { key: 'spinePitch', label: 'Spine Pitch', min: -1.5, max: 1.5, step: 0.01 },
            { key: 'spine1Pitch', label: 'Spine 1 Pitch', min: -1.5, max: 1.5, step: 0.01 },
            { key: 'spine2Pitch', label: 'Spine 2 Pitch', min: -1.5, max: 1.5, step: 0.01 },
            { key: 'neckPitch', label: 'Neck Pitch', min: -1.2, max: 1.2, step: 0.01 },
            { key: 'headPitch', label: 'Head Pitch', min: -1.2, max: 1.2, step: 0.01 },
            { key: 'headYaw', label: 'Head Yaw', min: -1.2, max: 1.2, step: 0.01 },
        ],
    },
    {
        title: 'Arms',
        controls: [
            { key: 'shoulderPitch', label: 'Shoulder Pitch', min: -1.5, max: 1.5, step: 0.01 },
            { key: 'shoulderYaw', label: 'Shoulder Yaw', min: -1.5, max: 1.5, step: 0.01 },
            { key: 'shoulderRoll', label: 'Shoulder Roll', min: -1.5, max: 1.5, step: 0.01 },
            { key: 'armPitch', label: 'Arm Pitch', min: -2.5, max: 2.5, step: 0.01 },
            { key: 'armYaw', label: 'Arm Yaw', min: -1.5, max: 1.5, step: 0.01 },
            { key: 'armRoll', label: 'Arm Roll', min: -2.5, max: 2.5, step: 0.01 },
            { key: 'foreArmPitch', label: 'Forearm Pitch', min: -2.5, max: 2.5, step: 0.01 },
            { key: 'foreArmYaw', label: 'Forearm Yaw', min: -1.5, max: 1.5, step: 0.01 },
            { key: 'foreArmRoll', label: 'Forearm Roll', min: -1.5, max: 1.5, step: 0.01 },
            { key: 'handPitch', label: 'Hand Pitch', min: -1.5, max: 1.5, step: 0.01 },
            { key: 'handYaw', label: 'Hand Yaw', min: -1.5, max: 1.5, step: 0.01 },
            { key: 'handRoll', label: 'Hand Roll', min: -1.5, max: 1.5, step: 0.01 },
        ],
    },
    {
        title: 'Legs',
        controls: [
            { key: 'upLegPitch', label: 'Upper Leg Pitch', min: -2.5, max: 2.5, step: 0.01 },
            { key: 'upLegYaw', label: 'Upper Leg Yaw', min: -1.5, max: 1.5, step: 0.01 },
            { key: 'upLegRoll', label: 'Upper Leg Roll', min: -1.5, max: 1.5, step: 0.01 },
            { key: 'legPitch', label: 'Lower Leg Pitch', min: -2.5, max: 2.5, step: 0.01 },
            { key: 'footPitch', label: 'Foot Pitch', min: -1.5, max: 1.5, step: 0.01 },
            { key: 'footYaw', label: 'Foot Yaw', min: -1.5, max: 1.5, step: 0.01 },
            { key: 'footRoll', label: 'Foot Roll', min: -1.5, max: 1.5, step: 0.01 },
            { key: 'toePitch', label: 'Toe Pitch', min: -1.5, max: 1.5, step: 0.01 },
        ],
    },
]

function formatValue(value, digits = 2) {
    return Number(value).toFixed(digits)
}

function SliderField({ control, value }) {
    const { key, label, min, max, step } = control

    const handleChange = (nextValue) => {
        const parsedValue = Number(nextValue)
        if (Number.isNaN(parsedValue)) return

        setRiderTuningState({ [key]: parsedValue })
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
                    onChange={(event) => handleChange(event.target.value)}
                />
            </div>
            <input
                type="range"
                className="w-full accent-orange-300"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(event) => handleChange(event.target.value)}
            />
        </label>
    )
}

export default function RiderDebugPanel() {
    const tuning = useRiderTuning()
    const isOpen = useRiderDebugPanelOpen()
    const [copied, setCopied] = useState(false)

    const tuningJson = useMemo(() => JSON.stringify(tuning, null, 2), [tuning])

    useEffect(() => {
        if (!copied) return undefined

        const timeoutId = window.setTimeout(() => setCopied(false), 1500)
        return () => window.clearTimeout(timeoutId)
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
        <div className="pointer-events-auto absolute right-3 top-24 z-20 hidden md:block">
            {isOpen ? (
                <aside className="w-[22rem] overflow-hidden rounded-[1.75rem] border border-white/15 bg-slate-950/70 text-white shadow-[0_24px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl">
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                        <div>
                            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
                                Debug
                            </div>
                            <div className="text-sm font-semibold text-white/90">
                                Rider Tuning
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
                                className="rounded-full border border-orange-200/20 bg-orange-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-100 transition hover:border-orange-100/30 hover:bg-orange-300/20"
                                onClick={resetRiderTuningState}
                            >
                                Reset
                            </button>
                            <button
                                type="button"
                                className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 transition hover:border-white/25 hover:text-white"
                                onClick={() => setRiderDebugPanelOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>

                    <div className="max-h-[62vh] space-y-4 overflow-y-auto px-4 py-4">
                        {CONTROL_GROUPS.map((group) => (
                            <section key={group.title} className="space-y-2">
                                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
                                    {group.title}
                                </div>

                                <div className="space-y-2">
                                    {group.controls.map((control) => (
                                        <SliderField
                                            key={control.key}
                                            control={control}
                                            value={tuning[control.key]}
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
                    onClick={() => setRiderDebugPanelOpen(true)}
                >
                    Open Rider Debug
                </button>
            )}
        </div>
    )
}
