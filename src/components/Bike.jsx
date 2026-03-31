import { useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useGameStore } from '../store/useGameStore'
import BikeModel from './BikeModel'
import useBikeSimulation from '../hooks/useBikeSimulation'
import { createGameplayBike } from '../utils/createGameplayBike'

const MODEL_URL = '/models/bikeModel.glb'

export default function Bike() {
    const bikeGroupRef = useRef()
    const pivotRef = useRef()
    const frontWheelRef = useRef()
    const rearWheelRef = useRef()
    const store = useGameStore()
    const { scene } = useGLTF(MODEL_URL)
    const gameplayBike = useMemo(() => createGameplayBike(scene), [scene])

    useBikeSimulation({
        store,
        bikeGroupRef,
        pivotRef,
        rearWheelRef,
        frontWheelRef,
    })

    if (!gameplayBike) return null

    return (
        <BikeModel
            bikeGroupRef={bikeGroupRef}
            pivotRef={pivotRef}
            rearWheelRef={rearWheelRef}
            frontWheelRef={frontWheelRef}
            gameplayBike={gameplayBike}
        />
    )
}

useGLTF.preload(MODEL_URL)
