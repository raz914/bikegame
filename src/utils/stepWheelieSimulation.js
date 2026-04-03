const clamp01 = (v) => Math.max(0, Math.min(1, v))

export default function stepWheelieSimulation(simState, inputs, tuning, dt) {
    const { drive, pitch, riderControl, balance, scoring, world } = tuning

    let {
        pitchAngle,
        pitchVelocity,
        speed,
        position,
        rawScore,
        wheelieTime,
        wheelieDistance,
        currentWheelieDistance,
        rawCurrentWheelieScore,
    } = simState

    const throttle = clamp01(inputs.throttle)
    const brake = clamp01(inputs.brake)
    const riderWeight = Math.max(-1, Math.min(1, inputs.riderWeight))
    const speedRatio = drive.maxSpeed > 0 ? speed / drive.maxSpeed : 0

    // ── Pitch torques ──────────────────────────────────────
    let netTorque = 0

    const backwardWeight = Math.max(-riderWeight, 0)
    const forwardWeight = Math.max(riderWeight, 0)
    const liftControl = throttle * (riderControl.throttleLiftBase + backwardWeight * riderControl.leanBackLiftBonus)
    const settleControl = brake * riderControl.brakeSettleBase + forwardWeight * riderControl.leanForwardSettleFactor

    if (liftControl > riderControl.controlDeadZone) {
        netTorque += pitch.liftTorque * liftControl
        netTorque += speedRatio * riderControl.speedLiftFactor * throttle
        netTorque += backwardWeight * riderControl.leanBackDirectLift

        // Extra launch assist makes the front wheel pop up early,
        // then hands control back to the player once the wheelie starts.
        if (pitchAngle < riderControl.launchAssistMaxAngle) {
            const launchRatio = 1 - pitchAngle / riderControl.launchAssistMaxAngle
            netTorque += riderControl.launchAssistTorque * throttle * launchRatio
        }
    }

    if (settleControl > riderControl.controlDeadZone && pitchAngle > 0) {
        const angleRecovery = Math.min(pitchAngle / pitch.maxAngle, 1)
        netTorque -= pitch.settleTorque * (
            riderControl.settleBaseRate
            + settleControl * riderControl.settleControlScale
            + angleRecovery * riderControl.settleAngleRecovery
        )
    }

    // Gravity restoring torque
    if (pitchAngle > 0) {
        const angleRatio = pitchAngle / pitch.maxAngle
        netTorque -= pitch.gravityTorque
            + riderControl.passiveDropSpeedFactor * speedRatio
            + riderControl.passiveDropAngleRecovery * angleRatio

        if (liftControl <= riderControl.controlDeadZone) {
            netTorque -= riderControl.releaseDropBoost
        }
    }

    const perfectBalance = Math.abs(pitchAngle - scoring.perfectAngle) <= scoring.perfectWindow
    const wheelieValid =
        speed > scoring.minSpeedForValid
        && pitchAngle >= pitch.validMinAngle
        && pitchAngle < pitch.maxAngle - pitch.validMaxMargin

    // Balance disturbances
    if (speed > balance.minSpeedForDrift && pitchAngle > 0) {
        const driftWave =
            Math.sin(position * balance.driftWaveFreq1)
            + Math.sin(position * balance.driftWaveFreq2) * balance.driftWaveAmp2
        const roadKick = Math.max(0, Math.sin(position * balance.roadKickFreq)) * speedRatio
        const driftForce = balance.driftBase + speedRatio * balance.driftSpeedFactor
        netTorque += driftWave * driftForce * balance.driftInfluence
        netTorque += roadKick * driftForce * balance.roadKickInfluence

        if (wheelieValid) {
            const builtChaos = Math.min(
                balance.wheelieChaosCap,
                balance.wheelieChaosBase + wheelieTime * balance.wheelieChaosBuildRate,
            ) + (perfectBalance ? balance.perfectChaosBonus : 0)
            const chaosWave =
                Math.sin(wheelieTime * balance.wheelieChaosFreq1)
                + Math.sin(wheelieTime * balance.wheelieChaosFreq2) * balance.wheelieChaosMix

            netTorque += chaosWave * builtChaos * (0.55 + speedRatio * 0.45)
        }

        if (pitchAngle > balance.backFallStartAngle) {
            const overAngleRatio = Math.min(
                (pitchAngle - balance.backFallStartAngle) / Math.max(pitch.maxAngle - balance.backFallStartAngle, 0.001),
                1,
            )
            const backFallWave = Math.max(0, Math.sin(position * 5.8) + Math.sin(wheelieTime * 9.5) * 0.35)

            netTorque += overAngleRatio * balance.backFallTorque
            netTorque += overAngleRatio * speedRatio * balance.backFallSpeedFactor
            netTorque += backFallWave * overAngleRatio * balance.backFallChaos
        }
    }

    // ── Integrate angular velocity ─────────────────────────
    pitchVelocity += netTorque * dt
    pitchVelocity *= Math.exp(-pitch.angularDamping * dt)

    pitchAngle += pitchVelocity * dt

    if (pitchAngle <= 0) {
        pitchAngle = 0
        pitchVelocity = Math.max(pitchVelocity, 0)
    }

    // ── Crash check ────────────────────────────────────────
    const crashed = pitchAngle > pitch.maxAngle
    if (crashed) {
        pitchAngle = pitch.maxAngle
        pitchVelocity = 0
    }

    // ── Drive physics ──────────────────────────────────────
    speed += drive.acceleration * throttle * dt
    speed = Math.min(speed, drive.maxSpeed)

    const coastingDrag = drive.friction * (throttle > 0 ? drive.throttleDragReduction : 1)
    speed -= (coastingDrag + drive.brakeStrength * brake) * dt
    speed = Math.max(speed, 0)

    if (pitchAngle > scoring.perfectAngle + scoring.perfectWindow + drive.overRotationAngleOffset) {
        speed = Math.max(speed - drive.overRotationSpeedPenalty * dt, 0)
    }

    // ── Position ───────────────────────────────────────────
    const positionDelta = speed * dt
    position += positionDelta

    const finished = position >= world.roadLength
    if (finished) {
        position = world.roadLength
        speed = 0
    }

    // ── Scoring ────────────────────────────────────────────
    let points = 0

    if (wheelieValid) {
        wheelieTime += dt
        wheelieDistance += positionDelta
        currentWheelieDistance += positionDelta
        points = speed * dt * (scoring.baseScoreRate + pitchAngle / scoring.angleScoreDivisor)
        if (perfectBalance) {
            points *= scoring.perfectMultiplier
        }
        rawCurrentWheelieScore += points
    } else {
        currentWheelieDistance = 0
        rawCurrentWheelieScore = 0
    }

    rawScore += points

    return {
        pitchAngle,
        pitchVelocity,
        speed,
        position,
        positionDelta,
        rawScore,
        wheelieTime,
        wheelieDistance,
        currentWheelieDistance,
        rawCurrentWheelieScore,
        crashed,
        finished,
        perfectBalance,
        wheelieValid,
    }
}
