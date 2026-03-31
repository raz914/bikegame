import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import { useGameStore, MAX_SPEED } from '../store/useGameStore'
import Road from './Road'
import Bike from './Bike'

function CameraRig() {
    const store = useGameStore()
    const throttleBlendRef = useRef(0)

    useFrame((state, delta) => {
        const { position, speed, throttle, wheelieAngle } = store.getState()

        const speedRatio = speed / MAX_SPEED
        const throttleRatio = Math.max(0, Math.min(1, throttle))
        const dt = Math.min(delta, 0.05)
        const blendLerp = 1 - Math.exp(-dt * 3.2)
        throttleBlendRef.current += (throttleRatio - throttleBlendRef.current) * blendLerp
        const blendProgress = throttleBlendRef.current
        const throttleBlend = blendProgress * blendProgress * blendProgress * (blendProgress * (blendProgress * 6 - 15) + 10)
        const aspect = state.camera.aspect
        const portraitFactor = Math.max(0, Math.min(1, (1.15 - aspect) / 0.55))
        const sideFollowDistance = 4.5 - portraitFactor * 1.2
        const rearFollowDistance = 8 - portraitFactor * 0.7 + speedRatio * 0.8
        const followDistance = sideFollowDistance + (rearFollowDistance - sideFollowDistance) * throttleBlend
        const sideDepth = 8.8 - portraitFactor * 1.1 - speedRatio * 0.7
        const rearDepth = 1.15 + portraitFactor * 0.45
        const cameraDepth = sideDepth + (rearDepth - sideDepth) * throttleBlend
        const sideLookAhead = 6 - portraitFactor * 4.8
        const rearLookAhead = 2.4 - portraitFactor * 1.2
        const lookAhead = sideLookAhead + (rearLookAhead - sideLookAhead) * throttleBlend
        const baseHeight = 3.2 + portraitFactor * 0.55
        const targetX = position - followDistance
        const camX = state.camera.position.x + (targetX - state.camera.position.x) * 0.04
        const camY = state.camera.position.y + ((baseHeight + speedRatio * 1.1 + wheelieAngle * 0.015) - state.camera.position.y) * 0.04
        const camZ = state.camera.position.z + (cameraDepth - state.camera.position.z) * 0.04

        state.camera.position.set(camX, camY, camZ)
        state.camera.lookAt(position + lookAhead, 1 + wheelieAngle * 0.02, 0)
    })

    return null
}

export default function GameScene() {

    return (
        <Canvas
            shadows
            camera={{ position: [0, 3.2, 8.8], fov: 45, near: 0.1, far: 500 }}
            style={{ width: '100%', height: '100%' }}
        >
            <color attach="background" args={['#f3c38d']} />
            <fog attach="fog" args={['#f3c38d', 45, 180]} />
            <Sky
                distance={450000}
                sunPosition={[180, 30, -40]}
                inclination={0.58}
                azimuth={0.2}
                turbidity={8}
                rayleigh={2.5}
            />

            <ambientLight intensity={0.65} color="#fff4d6" />
            <directionalLight
                position={[40, 22, 10]}
                color="#ffd18b"
                intensity={2.1}
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-far={140}
                shadow-camera-left={-40}
                shadow-camera-right={40}
                shadow-camera-top={40}
                shadow-camera-bottom={-40}
            />
            <hemisphereLight
                skyColor="#ffe2b8"
                groundColor="#755331"
                intensity={0.8}
            />
            <directionalLight position={[-15, 10, -20]} color="#8ec5ff" intensity={0.35} />

            <CameraRig />
            <Road />
            <Bike />
        </Canvas>
    )
}
