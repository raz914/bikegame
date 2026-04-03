function seededRandom(seed) {
    const v = Math.sin(seed * 127.1 + 311.7) * 43758.5453123
    return v - Math.floor(v)
}

export default function generateArcadeSpawns(roadLength, arcade) {
    const { laneCount, coinSpacing, obstacleSpacing, startGap } = arcade
    const coins = []
    const obstacles = []

    let coinId = 0
    let obstacleId = 0

    const coinCount = Math.floor((roadLength - startGap) / coinSpacing)
    for (let i = 0; i < coinCount; i++) {
        const x = startGap + i * coinSpacing + seededRandom(i * 3 + 1) * coinSpacing * 0.4
        const lane = Math.floor(seededRandom(i * 7 + 5) * laneCount)
        coins.push({ id: coinId++, x, lane })
    }

    const obstacleCount = Math.floor((roadLength - startGap * 2) / obstacleSpacing)
    for (let i = 0; i < obstacleCount; i++) {
        const x = startGap * 2 + i * obstacleSpacing + seededRandom(i * 11 + 3) * obstacleSpacing * 0.3
        const lane = Math.floor(seededRandom(i * 13 + 7) * laneCount)

        const tooCloseToAnyCoin = coins.some(
            (c) => Math.abs(c.x - x) < coinSpacing * 0.4 && c.lane === lane,
        )
        if (!tooCloseToAnyCoin) {
            obstacles.push({ id: obstacleId++, x, lane })
        }
    }

    return { coins, obstacles }
}
