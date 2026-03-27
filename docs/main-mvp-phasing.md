# Main MVP Phasing

Internal execution roadmap derived from `docs/main-mvp-task-map.md`.

## Guiding Principle

Do not stack polish on top of the current alpha control scheme.

The current build is a strong proof of feel, but the main MVP should be built around:

- left thumb = rider weight control
- right thumb = throttle / brake control
- wheelie outcome = result of weight + throttle + speed, not a direct "wheelie button"

That means the first major step is not visual polish. It is replacing the control and physics foundation while preserving the useful alpha scaffolding.

## Reuse First

Keep and repurpose these existing systems:

- `src/components/GameScene.jsx` for the overall scene and portrait camera baseline
- `src/components/Road.jsx` for lightweight environment baseline
- `src/components/GameUI.jsx` for HUD layering, overlays, and restart flow structure
- `src/components/Bike.jsx` for the per-frame game loop and bike visuals
- `src/store/useGameStore.jsx` for central game state and tuning constants

## Phase 1: Foundation Reset For Main MVP

Goal: preserve the alpha shell, but reshape the architecture around the real intended mechanic.

Primary tasks:

- Repolish `Set up Three.js web app project structure and deployment-ready repository`
- Build the state model for:
  - rider forward/back weight
  - throttle analog value
  - brake analog value
  - valid wheelie state
  - wheelie distance
  - best score
  - debug values
- Repolish `Set up configurable tuning variables for power, brake strength, weight effect, etc.`

Why this phase comes first:

- Every important gameplay task depends on a better state model than the current `isWheelieUp` / `isWheelieDown` booleans.
- It is cheaper to refactor the store and tuning layout now than after new gameplay features are layered on top.

Definition of done:

- Game state is centered on analog inputs and gameplay variables, not direct wheelie commands.
- Tuning values are grouped clearly enough to support rapid iteration.

## Phase 2: Dual-Thumb Input System

Goal: replace button-like touch interaction with real portrait-mobile gameplay controls.

Primary tasks:

- Repolish `Create mobile-first touch input system with two simultaneous thumb zones`
- Repolish `Build left control area for rider weight distribution`
- `Implement front/back rider weight shift as the main gameplay mechanic`
- `Map left control upward movement to weight forward`
- `Map left control downward movement to weight backward`
- Repolish `Build right control area for throttle and brake`
- `Map right control downward/back movement to throttle`
- `Map right control upward/front movement to brake`
- `Make throttle and brake continuous analog inputs, not just on/off`
- Repolish `Tune control responsiveness for portrait smartphone gameplay`

Why this phase comes before physics tuning:

- Without the real thumb input model, tuning wheelie behavior will target the wrong interaction.

Definition of done:

- Two thumbs can be used simultaneously in portrait mode.
- Left input continuously drives rider weight.
- Right input continuously drives throttle and brake.
- Controls feel stable enough for gameplay tuning on mobile.

## Phase 3: Core Wheelie Gameplay Rewrite

Goal: make wheelies emerge from rider weight, throttle, brake, and speed together.

Primary tasks:

- Repolish `Implement natural front-end lift under throttle`
- `Make wheelie behavior depend on rider weight distribution plus throttle together`
- `Tune low-speed behavior so centered weight plus full throttle lifts the bike naturally`
- Repolish `Tune higher-speed behavior so the same inputs behave differently`
- Repolish `Implement wheelie physics and pitch control`
- `Implement brake effect on pitch recovery during wheelies`
- Repolish `Create drivable bike prototype`

High-risk points:

- Over-tuning for low speed can make higher-speed play feel floaty or too easy.
- If brake recovery is too strong, the wheelie loop becomes trivial.
- If rider weight has too much influence, the mechanic stops feeling bike-driven.

Definition of done:

- A player can intentionally initiate, hold, and recover a wheelie using the real control model.
- The same inputs produce meaningfully different outcomes at low and higher speeds.

## Phase 4: Run Validation, Crash Rules, And Scoring

Goal: convert the wheelie toy into a proper score-chasing run loop.

Primary tasks:

- Repolish `Detect valid wheelie state`
- `Calculate wheelie distance only while wheelie state is valid`
- `Display live wheelie meter counter during run`
- Repolish `Implement crash detection for looping out backward`
- `Implement crash detection for failed recovery / unstable landing threshold`
- Repolish `Build HUD with live score, wheelie distance, and best score`
- `Save local best score in browser storage`
- Keep existing `Stop active run after crash`
- Keep existing `Create instant restart flow without page reload`
- Keep existing `Set spawn / reset position for each retry`

Why this phase follows the gameplay rewrite:

- Valid wheelie state should be derived from the final movement model, not from the old prototype thresholds alone.

Definition of done:

- The run has a clear success loop: launch, balance, extend distance, recover or crash, instantly retry.
- Score reporting matches the intended wheelie behavior rather than raw forward travel alone.

## Phase 5: HUD, Camera, And Presentation Polish

Goal: make the game readable and satisfying on portrait mobile screens.

Primary tasks:

- Repolish `Create mobile-readable UI layout from the provided visual direction`
- Keep `Add camera follow system tuned for vertical mobile framing`
- Repolish `Keep bike readable on small mobile screens at all times`
- `Keep left/right rider balance visible in UI but low gameplay impact for MVP`
- Repolish `Add lightweight rider lean visual feedback for wheelie posture`
- `Add simple suspension compression visual effect under throttle`

Why this phase is later:

- Camera and HUD polish should respond to the final movement and scoring loop, not the alpha prototype.

Definition of done:

- Core gameplay information is readable at a glance on a phone.
- The bike silhouette and posture remain legible during active wheelies.

## Phase 6: Environment, Rewards, And Feedback

Goal: make the run feel more like a complete game without adding heavy production scope.

Primary tasks:

- Keep `Create simple road environment and lightweight background`
- `Add banner / road sign interaction as a gameplay reward moment`
- Keep `Create rear wheel spin feedback`
- Repolish environment placement and visual reward timing

Why this phase is intentionally later:

- These features improve payoff and identity, but they are not blockers for proving the main gameplay loop.

Definition of done:

- The run has at least one memorable reward moment tied to progress or wheelie success.
- Environment feedback adds momentum without hurting performance.

## Phase 7: Debugging, Performance, And Device Validation

Goal: stabilize the MVP for real mobile use and final tuning passes.

Primary tasks:

- `Create debug mode for throttle, brake, pitch angle, speed, and wheelie-active state`
- Repolish `Optimize rendering and physics for stable mobile performance`
- `Test simultaneous thumb controls on real mobile devices`

Why this phase matters:

- The intended control scheme is mobile-specific, so emulator-only confidence is not enough.
- Debug visibility will accelerate tuning much more than guesswork once the analog model exists.

Definition of done:

- The game runs reliably on target phones in portrait mode.
- Thumb controls remain stable under real multi-touch use.
- The team can read the main gameplay values during tuning sessions.

## Recommended Immediate Build Order

If we start implementation right away, the most efficient sequence is:

1. Refactor `useGameStore.jsx` for analog control state and cleaner tuning groups.
2. Replace the current `GameUI.jsx` button input with real left/right thumb zones.
3. Rewrite the `Bike.jsx` control-to-physics mapping around weight + throttle + brake.
4. Add valid wheelie detection, wheelie distance, and best score persistence.
5. Polish HUD, camera readability, and rider/bike feedback.
6. Add debug mode and do real-device tuning and performance passes.

## Highest Priority Repolish Items

These are already useful enough to keep, but not good enough to carry forward untouched:

- `Set up Three.js web app project structure and deployment-ready repository`
- `Create mobile-first touch input system with two simultaneous thumb zones`
- `Build left control area for rider weight distribution`
- `Build right control area for throttle and brake`
- `Implement natural front-end lift under throttle`
- `Tune higher-speed behavior so the same inputs behave differently`
- `Implement wheelie physics and pitch control`
- `Detect valid wheelie state`
- `Build HUD with live score, wheelie distance, and best score`
- `Create mobile-readable UI layout from the provided visual direction`
- `Keep bike readable on small mobile screens at all times`
- `Set up configurable tuning variables for power, brake strength, weight effect, etc.`
- `Optimize rendering and physics for stable mobile performance`
- `Tune control responsiveness for portrait smartphone gameplay`

## Highest Risk Systems

- Control architecture: this is the real MVP foundation, and mistakes here will ripple into every other gameplay task.
- Wheelie feel tuning: the game lives or dies on whether weight, throttle, speed, and brake produce believable outcomes.
- Mobile readability: portrait framing and thumb ergonomics must support the mechanic, not fight it.
- Real-device multi-touch behavior: this cannot be assumed from desktop testing alone.
