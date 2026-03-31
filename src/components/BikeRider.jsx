import { useGLTF } from '@react-three/drei'
import { useLayoutEffect, useMemo } from 'react'
import { FrontSide } from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { useRiderTuning } from '../store/useRiderTuningStore'

const MODEL_URL = '/models/human.glb'

function buildRiderPose(tuning) {
    return [
        {
            bone: 'mixamorigHips',
            position: [0, tuning.hipsOffsetY, tuning.hipsOffsetZ],
            rotation: [tuning.hipsPitch, 0, 0],
        },
        { bone: 'mixamorigSpine', rotation: [tuning.spinePitch, 0, 0] },
        { bone: 'mixamorigSpine1', rotation: [tuning.spine1Pitch, 0, 0] },
        { bone: 'mixamorigSpine2', rotation: [tuning.spine2Pitch, 0, 0] },
        { bone: 'mixamorigNeck', rotation: [tuning.neckPitch, 0, 0] },
        { bone: 'mixamorigHead', rotation: [tuning.headPitch, tuning.headYaw, 0] },
        {
            bone: 'mixamorigLeftShoulder',
            rotation: [tuning.shoulderPitch, tuning.shoulderYaw, tuning.shoulderRoll],
        },
        {
            bone: 'mixamorigRightShoulder',
            rotation: [tuning.shoulderPitch, -tuning.shoulderYaw, -tuning.shoulderRoll],
        },
        {
            bone: 'mixamorigLeftArm',
            rotation: [tuning.armPitch, tuning.armYaw, -tuning.armRoll],
        },
        {
            bone: 'mixamorigRightArm',
            rotation: [tuning.armPitch, -tuning.armYaw, tuning.armRoll],
        },
        {
            bone: 'mixamorigLeftForeArm',
            rotation: [tuning.foreArmPitch, tuning.foreArmYaw, tuning.foreArmRoll],
        },
        {
            bone: 'mixamorigRightForeArm',
            rotation: [tuning.foreArmPitch, -tuning.foreArmYaw, -tuning.foreArmRoll],
        },
        {
            bone: 'mixamorigLeftHand',
            rotation: [tuning.handPitch, -tuning.handYaw, -tuning.handRoll],
        },
        {
            bone: 'mixamorigRightHand',
            rotation: [tuning.handPitch, tuning.handYaw, tuning.handRoll],
        },
        {
            bone: 'mixamorigLeftUpLeg',
            rotation: [tuning.upLegPitch, -tuning.upLegYaw, tuning.upLegRoll],
        },
        {
            bone: 'mixamorigRightUpLeg',
            rotation: [tuning.upLegPitch, tuning.upLegYaw, -tuning.upLegRoll],
        },
        { bone: 'mixamorigLeftLeg', rotation: [tuning.legPitch, 0, 0] },
        { bone: 'mixamorigRightLeg', rotation: [tuning.legPitch, 0, 0] },
        {
            bone: 'mixamorigLeftFoot',
            rotation: [tuning.footPitch, tuning.footYaw, tuning.footRoll],
        },
        {
            bone: 'mixamorigRightFoot',
            rotation: [tuning.footPitch, -tuning.footYaw, -tuning.footRoll],
        },
        { bone: 'mixamorigLeftToeBase', rotation: [tuning.toePitch, 0, 0] },
        { bone: 'mixamorigRightToeBase', rotation: [tuning.toePitch, 0, 0] },
    ]
}

function findObjectByPrefix(root, prefix) {
    let match = null

    root.traverse((child) => {
        if (!match && child.name?.startsWith(prefix)) {
            match = child
        }
    })

    return match
}

function applyOffsetTransform(node, rotationOffset = [0, 0, 0], positionOffset = null) {
    if (!node) return

    if (!node.userData.baseRotation) {
        node.userData.baseRotation = [
            node.rotation.x,
            node.rotation.y,
            node.rotation.z,
        ]
    }

    const baseRotation = node.userData.baseRotation

    node.rotation.set(
        baseRotation[0] + rotationOffset[0],
        baseRotation[1] + rotationOffset[1],
        baseRotation[2] + rotationOffset[2],
    )

    if (!positionOffset) return

    if (!node.userData.basePosition) {
        node.userData.basePosition = [
            node.position.x,
            node.position.y,
            node.position.z,
        ]
    }

    const basePosition = node.userData.basePosition

    node.position.set(
        basePosition[0] + positionOffset[0],
        basePosition[1] + positionOffset[1],
        basePosition[2] + positionOffset[2],
    )
}

function getRiderPosition(gameplayBike, tuning) {
    const wheelbase = gameplayBike.frontWheel.center[0] - gameplayBike.rearWheel.center[0]
    const rearWheelRadius = gameplayBike.rearWheel.center[2] - gameplayBike.rearWheel.min[2]

    return [
        wheelbase * tuning.seatXRatio,
        rearWheelRadius * tuning.seatYRatio + tuning.seatYOffset,
        tuning.seatZOffset,
    ]
}

function normalizeRiderMaterial(material) {
    if (!material) return material

    const nextMaterial = material.clone()
    nextMaterial.side = FrontSide
    nextMaterial.transparent = false
    nextMaterial.depthWrite = true
    nextMaterial.alphaTest = 0.5
    nextMaterial.needsUpdate = true
    return nextMaterial
}

export default function BikeRider({ gameplayBike }) {
    const { scene } = useGLTF(MODEL_URL)
    const tuning = useRiderTuning()
    const riderScene = useMemo(() => {
        const nextScene = clone(scene)

        nextScene.traverse((child) => {
            if (child.isSkinnedMesh || child.isMesh) {
                child.material = Array.isArray(child.material)
                    ? child.material.map(normalizeRiderMaterial)
                    : normalizeRiderMaterial(child.material)
                child.castShadow = true
                child.receiveShadow = true
                child.frustumCulled = false
            }
        })

        return nextScene
    }, [scene])

    useLayoutEffect(() => {
        buildRiderPose(tuning).forEach(({ bone, rotation, position }) => {
            applyOffsetTransform(
                findObjectByPrefix(riderScene, bone),
                rotation,
                position,
            )
        })
    }, [riderScene, tuning])

    return (
        <group
            position={getRiderPosition(gameplayBike, tuning)}
            rotation={[0, tuning.yaw, 0]}
            scale={tuning.scale}
            dispose={null}
        >
            <primitive object={riderScene} />
        </group>
    )
}

useGLTF.preload(MODEL_URL)
