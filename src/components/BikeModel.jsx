import BikeRider from './BikeRider'

const MODEL_ROTATION = [-Math.PI / 2, 0, 0]

export default function BikeModel({
    bikeGroupRef,
    pivotRef,
    rearWheelRef,
    frontWheelRef,
    gameplayBike,
}) {
    return (
        <group ref={bikeGroupRef} position={[0, 0, 0]} dispose={null}>
            <group ref={pivotRef}>
                <BikeRider gameplayBike={gameplayBike} />
                <group rotation={MODEL_ROTATION} position={gameplayBike.modelOffset}>
                    <mesh
                        geometry={gameplayBike.bodyGeometry}
                        material={gameplayBike.material}
                        castShadow
                        receiveShadow
                    />

                    {gameplayBike.extraMeshes.map((mesh) => (
                        <mesh
                            key={mesh.key}
                            geometry={mesh.geometry}
                            material={mesh.material}
                            position={mesh.position}
                            rotation={mesh.rotation}
                            scale={mesh.scale}
                            castShadow
                            receiveShadow
                        />
                    ))}

                    <group ref={rearWheelRef} position={gameplayBike.rearWheel.center}>
                        <mesh
                            geometry={gameplayBike.rearWheel.geometry}
                            material={gameplayBike.material}
                            position={gameplayBike.rearWheel.offset}
                            castShadow
                            receiveShadow
                        />
                    </group>

                    <group ref={frontWheelRef} position={gameplayBike.frontWheel.center}>
                        <mesh
                            geometry={gameplayBike.frontWheel.geometry}
                            material={gameplayBike.material}
                            position={gameplayBike.frontWheel.offset}
                            castShadow
                            receiveShadow
                        />
                    </group>
                </group>
            </group>
        </group>
    )
}
