import { BufferAttribute, BufferGeometry, DoubleSide } from 'three'

const POSITION_KEY_PRECISION = 5
const MODEL_ROTATION_X = -Math.PI / 2

const getVertexCount = (geometry) => geometry?.attributes?.position?.count ?? 0

function cloneBikeMaterial(material) {
    const sourceMaterial = Array.isArray(material) ? material[0] : material
    const nextMaterial = sourceMaterial.clone()
    nextMaterial.side = DoubleSide
    return nextMaterial
}

function analyzeConnectedComponents(geometry) {
    const position = geometry.getAttribute('position')
    const index = geometry.index?.array

    if (!position || !index) return null

    const parent = new Int32Array(position.count)
    for (let i = 0; i < parent.length; i += 1) parent[i] = i

    const find = (value) => {
        let current = value
        while (parent[current] !== current) {
            parent[current] = parent[parent[current]]
            current = parent[current]
        }
        return current
    }

    const union = (left, right) => {
        const leftRoot = find(left)
        const rightRoot = find(right)
        if (leftRoot !== rightRoot) parent[rightRoot] = leftRoot
    }

    const weldedVertices = new Map()
    for (let i = 0; i < position.count; i += 1) {
        const key = `${position.getX(i).toFixed(POSITION_KEY_PRECISION)}|${position.getY(i).toFixed(POSITION_KEY_PRECISION)}|${position.getZ(i).toFixed(POSITION_KEY_PRECISION)}`
        const existing = weldedVertices.get(key)
        if (existing === undefined) {
            weldedVertices.set(key, i)
        } else {
            union(existing, i)
        }
    }

    for (let i = 0; i < index.length; i += 3) {
        const a = index[i]
        const b = index[i + 1]
        const c = index[i + 2]
        union(a, b)
        union(b, c)
        union(a, c)
    }

    const rootByVertex = new Int32Array(position.count)
    const componentMap = new Map()

    for (let i = 0; i < position.count; i += 1) {
        const root = find(i)
        rootByVertex[i] = root

        let component = componentMap.get(root)
        if (!component) {
            component = {
                root,
                count: 0,
                min: [Infinity, Infinity, Infinity],
                max: [-Infinity, -Infinity, -Infinity],
            }
            componentMap.set(root, component)
        }

        const x = position.getX(i)
        const y = position.getY(i)
        const z = position.getZ(i)

        component.count += 1
        if (x < component.min[0]) component.min[0] = x
        if (y < component.min[1]) component.min[1] = y
        if (z < component.min[2]) component.min[2] = z
        if (x > component.max[0]) component.max[0] = x
        if (y > component.max[1]) component.max[1] = y
        if (z > component.max[2]) component.max[2] = z
    }

    const components = [...componentMap.values()].map((component) => ({
        root: component.root,
        count: component.count,
        min: component.min,
        max: component.max,
        size: component.min.map((value, indexValue) => component.max[indexValue] - value),
        center: component.min.map((value, indexValue) => (value + component.max[indexValue]) * 0.5),
    }))

    return { rootByVertex, components }
}

function isWheelComponent(component) {
    const [sizeX, sizeY, sizeZ] = component.size
    const roundnessDelta = Math.abs(sizeX - sizeZ)
    const radialSpan = Math.min(sizeX, sizeZ)

    return component.count > 350
        && sizeX > 0.65
        && sizeZ > 0.65
        && sizeY < radialSpan * 0.45
        && roundnessDelta < 0.12
}

function buildSubGeometry(geometry, rootByVertex, includeRoot) {
    const sourceIndex = geometry.index?.array
    if (!sourceIndex) return null

    const attributeNames = Object.keys(geometry.attributes)
    const nextAttributeValues = Object.fromEntries(attributeNames.map((name) => [name, []]))
    const vertexRemap = new Map()
    const nextIndices = []

    const copyVertex = (vertexIndex) => {
        const existingIndex = vertexRemap.get(vertexIndex)
        if (existingIndex !== undefined) return existingIndex

        const nextIndex = vertexRemap.size
        vertexRemap.set(vertexIndex, nextIndex)

        attributeNames.forEach((name) => {
            const attribute = geometry.getAttribute(name)
            const offset = vertexIndex * attribute.itemSize

            for (let i = 0; i < attribute.itemSize; i += 1) {
                nextAttributeValues[name].push(attribute.array[offset + i])
            }
        })

        return nextIndex
    }

    for (let i = 0; i < sourceIndex.length; i += 3) {
        const a = sourceIndex[i]
        const b = sourceIndex[i + 1]
        const c = sourceIndex[i + 2]
        const rootA = rootByVertex[a]
        const rootB = rootByVertex[b]
        const rootC = rootByVertex[c]

        if (rootA !== rootB || rootA !== rootC || !includeRoot(rootA)) continue

        nextIndices.push(copyVertex(a), copyVertex(b), copyVertex(c))
    }

    if (!nextIndices.length) return null

    const nextGeometry = new BufferGeometry()

    attributeNames.forEach((name) => {
        const attribute = geometry.getAttribute(name)
        const nextArray = new attribute.array.constructor(nextAttributeValues[name])
        nextGeometry.setAttribute(name, new BufferAttribute(nextArray, attribute.itemSize, attribute.normalized))
    })

    nextGeometry.setIndex(nextIndices)
    nextGeometry.computeBoundingBox()
    nextGeometry.computeBoundingSphere()

    return nextGeometry
}

function rotateModelPoint([x, y, z]) {
    const cosX = Math.cos(MODEL_ROTATION_X)
    const sinX = Math.sin(MODEL_ROTATION_X)

    return [
        x,
        y * cosX - z * sinX,
        y * sinX + z * cosX,
    ]
}

// Sketchfab merged the full bike into one mesh, so gameplay-ready wheel refs are rebuilt at load time.
export function createGameplayBike(scene) {
    const meshes = []
    scene.traverse((child) => {
        if (child.isMesh && getVertexCount(child.geometry) >= 3) {
            meshes.push(child)
        }
    })

    if (!meshes.length) return null

    const [mainMesh] = [...meshes].sort((left, right) => getVertexCount(right.geometry) - getVertexCount(left.geometry))
    const analysis = analyzeConnectedComponents(mainMesh.geometry)
    if (!analysis) return null

    const wheelComponents = analysis.components
        .filter(isWheelComponent)
        .sort((left, right) => left.center[0] - right.center[0])

    if (wheelComponents.length < 2) return null

    const [rearWheelComponent, frontWheelComponent] = wheelComponents
    const wheelRoots = new Set([rearWheelComponent.root, frontWheelComponent.root])

    const bodyGeometry = buildSubGeometry(
        mainMesh.geometry,
        analysis.rootByVertex,
        (root) => !wheelRoots.has(root),
    )
    const rearWheelGeometry = buildSubGeometry(
        mainMesh.geometry,
        analysis.rootByVertex,
        (root) => root === rearWheelComponent.root,
    )
    const frontWheelGeometry = buildSubGeometry(
        mainMesh.geometry,
        analysis.rootByVertex,
        (root) => root === frontWheelComponent.root,
    )

    if (!bodyGeometry || !rearWheelGeometry || !frontWheelGeometry) return null

    const modelOffset = [
        -rearWheelComponent.center[0],
        -rearWheelComponent.min[2],
        rearWheelComponent.center[1],
    ]
    const toGameplaySpace = (point) => {
        const rotatedPoint = rotateModelPoint(point)
        return rotatedPoint.map((value, index) => value + modelOffset[index])
    }
    const rearContactPoint = toGameplaySpace([
        rearWheelComponent.center[0],
        rearWheelComponent.center[1],
        rearWheelComponent.min[2],
    ])
    const frontContactPoint = toGameplaySpace([
        frontWheelComponent.center[0],
        frontWheelComponent.center[1],
        frontWheelComponent.min[2],
    ])

    return {
        material: cloneBikeMaterial(mainMesh.material),
        bodyGeometry,
        rearWheel: {
            geometry: rearWheelGeometry,
            center: rearWheelComponent.center,
            offset: rearWheelComponent.center.map((value) => -value),
            min: rearWheelComponent.min,
        },
        frontWheel: {
            geometry: frontWheelGeometry,
            center: frontWheelComponent.center,
            offset: frontWheelComponent.center.map((value) => -value),
            min: frontWheelComponent.min,
        },
        extraMeshes: meshes
            .filter((mesh) => mesh !== mainMesh)
            .map((mesh, index) => ({
                key: `${mesh.name || 'mesh'}-${index}`,
                geometry: mesh.geometry,
                material: cloneBikeMaterial(mesh.material),
                position: mesh.position.toArray(),
                rotation: [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z],
                scale: mesh.scale.toArray(),
            })),
        modelOffset,
        rearContactPoint,
        frontContactPoint,
    }
}
