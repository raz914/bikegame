import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sky, Stars } from '@react-three/drei'
import { ACESFilmicToneMapping, SRGBColorSpace, Vector3 } from 'three'
import { useGameStore, MAX_SPEED, ROAD_LENGTH } from '../store/useGameStore'
import { useUIState } from '../store/useUIStore'
import { STAGES } from '../data/gameData'
import { getStageEnvironment } from '../data/stageEnvironments'
import Road from './Road'
import Bike from './Bike'

function CameraRig() {
    const store = useGameStore()
    const cameraBlendRef = useRef(0)
    const speedRatioRef = useRef(0)
    const previousSpeedRef = useRef(0)
    const lookTargetRef = useRef(new Vector3(0, 1, 0))

    useFrame((state, delta) => {
        const { position, speed, throttle, brake, wheelieAngle, paused } = store.getState()
        if (paused) return

        const speedRatio = Math.max(0, Math.min(1, speed / MAX_SPEED))
        const throttleRatio = Math.max(0, Math.min(1, throttle))
        const brakeRatio = Math.max(0, Math.min(1, brake))
        const dt = Math.min(delta, 0.05)
        const speedLerp = 1 - Math.exp(-dt * 1.9)
        speedRatioRef.current += (speedRatio - speedRatioRef.current) * speedLerp
        const speedDelta = speed - previousSpeedRef.current
        previousSpeedRef.current = speed
        const accelerationRatio = Math.max(0, Math.min(1, speedDelta / Math.max(dt * MAX_SPEED * 0.55, 0.0001)))
        const targetRearBias = Math.max(
            0,
            Math.min(1, speedRatioRef.current * 0.9 + throttleRatio * 0.08 + accelerationRatio * 0.12 - brakeRatio * 0.08),
        )
        const blendLerp = 1 - Math.exp(-dt * (targetRearBias > cameraBlendRef.current ? 1.7 : 2.5))
        cameraBlendRef.current += (targetRearBias - cameraBlendRef.current) * blendLerp
        const blendProgress = cameraBlendRef.current
        const momentumBlend = blendProgress * blendProgress * (3 - 2 * blendProgress)
        const aspect = state.camera.aspect
        const portraitFactor = Math.max(0, Math.min(1, (1.15 - aspect) / 0.55))
        const portraitRearBias = portraitFactor * 0.34
        const portraitFocusTightness = portraitFactor * 0.22
        const sideFollowDistance = 4.7 - portraitFactor * 0.7
        const rearFollowDistance = 8.9 + portraitFactor * 0.75 + speedRatio * 1
        const followDistance = sideFollowDistance + (rearFollowDistance - sideFollowDistance) * Math.min(1, momentumBlend + portraitRearBias * 0.55)
        const sideDepth = 9.2 - portraitFactor * 0.45 - speedRatio * 0.45
        const rearDepth = 2.35 + portraitFactor * 0.55 - speedRatio * 0.04
        const cameraDepth = sideDepth + (rearDepth - sideDepth) * Math.min(1, momentumBlend + portraitRearBias)
        const sideLookAhead = 6 - portraitFactor * 4.9
        const rearLookAhead = 3.25 - portraitFactor * 1.25
        const lookAhead = sideLookAhead + (rearLookAhead - sideLookAhead) * Math.min(1, momentumBlend + portraitFocusTightness)
        const baseHeight = 3.2 + portraitFactor * 1 + speedRatio * 0.2
        const targetX = position - followDistance + portraitFactor * 0.2
        const positionLerp = 1 - Math.exp(-dt * (3.6 - portraitFactor * 0.6))
        const lookLerp = 1 - Math.exp(-dt * (4.4 - portraitFactor * 0.75))
        const camX = state.camera.position.x + (targetX - state.camera.position.x) * positionLerp
        const camY = state.camera.position.y + ((baseHeight + speedRatio * 1.1 + wheelieAngle * 0.015) - state.camera.position.y) * positionLerp
        const camZ = state.camera.position.z + (cameraDepth - state.camera.position.z) * positionLerp

        state.camera.position.set(camX, camY, camZ)
        lookTargetRef.current.lerp(
            new Vector3(position + lookAhead - portraitFactor * 0.18, 1.02 + wheelieAngle * 0.018 + portraitFactor * 0.05, 0),
            lookLerp,
        )
        state.camera.lookAt(lookTargetRef.current)
    })

    return null
}

function SkySet({ environment, graphicsQuality }) {
    const showStars = environment.atmosphere.stars && graphicsQuality !== 'low'
    const showMoon = environment.atmosphere.moon
    const showHorizonGlow = environment.atmosphere.horizonGlow
    const skyTint = environment.skyMode === 'night'
        ? '#08111f'
        : environment.skyMode === 'jungle'
            ? '#b6e49d'
            : environment.skyMode === 'cityDusk'
                ? '#7889d8'
                : '#ffd6a8'

    return (
        <>
            <Sky {...environment.sky} />

            {showStars && (
                <Stars
                    radius={160}
                    depth={70}
                    count={graphicsQuality === 'high' ? 2600 : 1400}
                    factor={3.4}
                    fade
                    saturation={0}
                    speed={0.12}
                />
            )}

            {showMoon && (
                <mesh position={[140, 64, -110]}>
                    <sphereGeometry args={[9, 28, 28]} />
                    <meshBasicMaterial color="#dbe7ff" />
                </mesh>
            )}

            {showMoon && (
                <mesh position={[140, 64, -111]}>
                    <sphereGeometry args={[9.5, 28, 28]} />
                    <meshBasicMaterial color="#8db3ff" transparent opacity={0.08} depthWrite={false} />
                </mesh>
            )}

            {showHorizonGlow && (
                <mesh position={[ROAD_LENGTH * 0.5, 14, -48]}>
                    <planeGeometry args={[220, 46]} />
                    <meshBasicMaterial color="#2d6dff" transparent opacity={0.12} depthWrite={false} />
                </mesh>
            )}

            {environment.skyMode === 'jungle' && (
                <mesh position={[ROAD_LENGTH * 0.5, 28, -68]}>
                    <planeGeometry args={[220, 70]} />
                    <meshBasicMaterial color={skyTint} transparent opacity={0.16} depthWrite={false} />
                </mesh>
            )}
        </>
    )
}

export default function GameScene() {
    const selectedStageIndex = useUIState((state) => state.selectedStage)
    const graphicsQuality = useUIState((state) => state.graphicsQuality)
    const stageId = STAGES[selectedStageIndex]?.id ?? STAGES[0].id
    const environment = useMemo(
        () => getStageEnvironment(stageId, graphicsQuality),
        [graphicsQuality, stageId],
    )
    const dpr = graphicsQuality === 'low' ? [1, 1.2] : graphicsQuality === 'medium' ? [1, 1.5] : [1, 2]

    return (
        <Canvas
            shadows
            dpr={dpr}
            camera={{ position: [0, 3.2, 8.8], fov: 45, near: 0.1, far: 500 }}
            gl={{
                antialias: graphicsQuality !== 'low',
                alpha: false,
                powerPreference: 'high-performance',
                toneMapping: ACESFilmicToneMapping,
                outputColorSpace: SRGBColorSpace,
            }}
            style={{ width: '100%', height: '100%' }}
        >
            <color attach="background" args={[environment.background]} />
            <fog attach="fog" args={[environment.fog.color, environment.fog.near, environment.fog.far]} />
            <SkySet environment={environment} graphicsQuality={graphicsQuality} />

            <ambientLight
                intensity={environment.lights.ambient.intensity}
                color={environment.lights.ambient.color}
            />
            <directionalLight
                position={environment.lights.sun.position}
                color={environment.lights.sun.color}
                intensity={environment.lights.sun.intensity}
                castShadow
                shadow-mapSize={[environment.shadowMapSize, environment.shadowMapSize]}
                shadow-camera-far={140}
                shadow-camera-left={-40}
                shadow-camera-right={40}
                shadow-camera-top={40}
                shadow-camera-bottom={-40}
                shadow-bias={-0.0002}
            />
            <hemisphereLight
                skyColor={environment.lights.hemisphere.skyColor}
                groundColor={environment.lights.hemisphere.groundColor}
                intensity={environment.lights.hemisphere.intensity}
            />
            <directionalLight
                position={environment.lights.rim.position}
                color={environment.lights.rim.color}
                intensity={environment.lights.rim.intensity}
            />

            <CameraRig />
            <Road environment={environment} />
            <Bike />
        </Canvas>
    )
}
