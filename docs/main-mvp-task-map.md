# Main MVP Task Map

Internal working document for reorganizing the client task list into execution-friendly categories.

## Status Legend

- `Complete`: clearly implemented in the current alpha repo and reusable as a baseline
- `Partial / Repolish`: present in some form, but not yet aligned with the intended main MVP behavior or quality bar
- `Pending`: missing, or not implemented clearly enough to count

Conservative rule: if repo evidence is unclear, treat the item as `Partial / Repolish` or `Pending`, not `Complete`.

## Snapshot

- `Complete`: 8
- `Partial / Repolish`: 18
- `Pending`: 20

## Repo Baseline

Key reusable files in the current alpha:

- `src/components/GameUI.jsx`: HUD, touch buttons, overlays, restart flow
- `src/components/Bike.jsx`: forward movement, wheelie pitch logic, crash threshold, score accumulation, wheel rotation
- `src/store/useGameStore.jsx`: central state and tuning constants
- `src/components/GameScene.jsx`: camera follow and scene setup
- `src/components/Road.jsx`: lightweight road and background dressing
- `package.json` + `vite.config.js`: working Vite/React/Three build setup

## 1. Foundation And Deployment

| Task | Status | Notes |
| --- | --- | --- |
| Set up Three.js web app project structure and deployment-ready repository | `Partial / Repolish` | Vite + React + Three structure is already working, and `dist/` exists. Still needs a real project README, deployment notes, and proper repo hygiene before this should be considered production-ready. |

## 2. Input And Control System

| Task | Status | Notes |
| --- | --- | --- |
| Create mobile-first touch input system with two simultaneous thumb zones | `Partial / Repolish` | Two large bottom touch controls exist in `src/components/GameUI.jsx`, but they behave like discrete buttons rather than full thumb zones with positional analog input. |
| Build left control area for rider weight distribution | `Partial / Repolish` | A left-side control area exists visually, but it currently maps to "settle" rather than an explicit rider weight pad. |
| Implement front/back rider weight shift as the main gameplay mechanic | `Pending` | No separate front/back rider weight state exists yet in store or gameplay logic. |
| Map left control upward movement to weight forward | `Pending` | No directional analog mapping on the left side yet. |
| Map left control downward movement to weight backward | `Pending` | No directional analog mapping on the left side yet. |
| Keep left/right rider balance visible in UI but low gameplay impact for MVP | `Pending` | Current UI shows wheelie pitch angle, not left/right rider balance. |
| Build right control area for throttle and brake | `Partial / Repolish` | A right-side control button exists, but it is still a wheelie trigger, not a throttle/brake pad. |
| Map right control downward/back movement to throttle | `Pending` | No directional analog throttle mapping yet. |
| Map right control upward/front movement to brake | `Pending` | No directional analog brake mapping yet. |
| Make throttle and brake continuous analog inputs, not just on/off | `Pending` | Current input state is boolean (`isWheelieUp`, `isWheelieDown`) rather than analog values. |

## 3. Core Bike Movement And Wheelie Gameplay

| Task | Status | Notes |
| --- | --- | --- |
| Create drivable bike prototype | `Complete` | Already playable as a simple wheelie prototype. |
| Implement base forward bike movement | `Complete` | `src/components/Bike.jsx` advances bike position and speed each frame. |
| Implement natural front-end lift under throttle | `Partial / Repolish` | Front lift behavior exists, but it is triggered by the current wheelie button rather than a real throttle + weight model. |
| Make wheelie behavior depend on rider weight distribution plus throttle together | `Pending` | Main mechanic coupling is not in place yet. |
| Tune low-speed behavior so centered weight plus full throttle lifts the bike naturally | `Pending` | Low-speed tuning cannot be validated properly until throttle and weight are separated. |
| Tune higher-speed behavior so the same inputs behave differently | `Partial / Repolish` | The current prototype already changes behavior with speed, but not through the intended input model. |
| Implement wheelie physics and pitch control | `Partial / Repolish` | Pitch logic, recovery, drift, and crash threshold exist, but still read as tuned prototype logic rather than final MVP physics. |
| Implement brake effect on pitch recovery during wheelies | `Pending` | No explicit brake system exists yet. |

## 4. Wheelie Validation, Scoring, And Run State

| Task | Status | Notes |
| --- | --- | --- |
| Detect valid wheelie state | `Partial / Repolish` | The game distinguishes flat vs wheelie-like states and also tracks a "perfect balance" window, but there is no explicit final-form valid-wheelie state model yet. |
| Calculate wheelie distance only while wheelie state is valid | `Pending` | Current `distance` is total travel distance, not wheelie-only distance. |
| Display live wheelie meter counter during run | `Pending` | No live wheelie distance counter in HUD yet. |
| Implement crash detection for looping out backward | `Partial / Repolish` | The existing max-angle crash covers loop-out behavior, but only as a simple threshold. |
| Implement crash detection for failed recovery / unstable landing threshold | `Pending` | No landing stability or recovery failure logic yet. |
| Stop active run after crash | `Complete` | Crash state halts the active run. |
| Create instant restart flow without page reload | `Complete` | Restart is already handled in-app through store reset. |
| Set spawn / reset position for each retry | `Complete` | Reset returns the run to the initial state and position. |
| Build HUD with live score, wheelie distance, and best score | `Partial / Repolish` | HUD already shows speed, score, angle, and progress, but wheelie distance and best score are still missing. |
| Save local best score in browser storage | `Pending` | No `localStorage` persistence exists yet. |

## 5. HUD, Camera, And Mobile Presentation

| Task | Status | Notes |
| --- | --- | --- |
| Create mobile-readable UI layout from the provided visual direction | `Partial / Repolish` | Current HUD is mobile-readable, but it should be treated as alpha styling until checked against the target visual direction. |
| Add camera follow system tuned for vertical mobile framing | `Complete` | `src/components/GameScene.jsx` already adjusts follow distance and framing based on portrait aspect. |
| Keep bike readable on small mobile screens at all times | `Partial / Repolish` | Camera work is a strong start, but readability still needs device validation and tuning. |
| Tune control responsiveness for portrait smartphone gameplay | `Partial / Repolish` | Current controls are responsive, but not yet based on the intended thumb-zone interaction model. |

## 6. Environment And Visual Feedback

| Task | Status | Notes |
| --- | --- | --- |
| Create simple road environment and lightweight background | `Complete` | `src/components/Road.jsx` and `src/components/GameScene.jsx` already provide a lightweight environment and background treatment. |
| Add banner / road sign interaction as a gameplay reward moment | `Pending` | No gameplay-linked road interaction exists yet. |
| Create rear wheel spin feedback | `Complete` | Wheel rotation already responds to speed. |
| Add lightweight rider lean visual feedback for wheelie posture | `Partial / Repolish` | The whole bike pivots visually, but there is no dedicated rider posture layer beyond that shared rotation. |
| Add simple suspension compression visual effect under throttle | `Pending` | No explicit suspension compression effect yet. |

## 7. Tuning, Debugging, Performance, And Validation

| Task | Status | Notes |
| --- | --- | --- |
| Set up configurable tuning variables for power, brake strength, weight effect, etc. | `Partial / Repolish` | Several core constants already exist in `src/store/useGameStore.jsx`, but they do not yet cover the full intended mechanic set and are not grouped into a more ergonomic tuning system. |
| Create debug mode for throttle, brake, pitch angle, speed, and wheelie-active state | `Pending` | No debug overlay or dedicated debug mode exists. |
| Optimize rendering and physics for stable mobile performance | `Partial / Repolish` | Current implementation is lightweight and should run reasonably, but there is no explicit mobile performance pass yet. |
| Test simultaneous thumb controls on real mobile devices | `Pending` | No repo evidence of device testing. |

## Practical Reuse Notes

- Reuse the existing `Bike.jsx` movement, wheel rotation, and run loop as the first baseline, but do not treat its current wheelie button mapping as final gameplay architecture.
- Reuse the current `GameScene.jsx` portrait camera behavior as the starting point for the main MVP camera.
- Reuse the current `GameUI.jsx` layout patterns for HUD layering and restart flow, but replace the control logic with true left/right analog thumb zones.
- Reuse `useGameStore.jsx` as the base state container, but expect to expand it for analog inputs, rider weight state, brake/throttle state, valid wheelie state, wheelie distance, best score, and debug values.


task list raw:
Set up Three.js web app project structure and deployment-ready repository — 2
Create mobile-first touch input system with two simultaneous thumb zones — 5
Build left control area for rider weight distribution — 3
Implement front/back rider weight shift as the main gameplay mechanic — 8
Map left control upward movement to weight forward — 2
Map left control downward movement to weight backward — 2
Keep left/right rider balance visible in UI but low gameplay impact for MVP — 3
Build right control area for throttle and brake — 3
Map right control downward/back movement to throttle — 2
Map right control upward/front movement to brake — 2
Make throttle and brake continuous analog inputs, not just on/off — 5
Create drivable bike prototype — 8
Implement base forward bike movement — 3
Implement natural front-end lift under throttle — 5
Make wheelie behavior depend on rider weight distribution plus throttle together — 8
Tune low-speed behavior so centered weight plus full throttle lifts the bike naturally — 8
Tune higher-speed behavior so the same inputs behave differently — 8
Implement wheelie physics and pitch control — 8
Implement brake effect on pitch recovery during wheelies — 5
Detect valid wheelie state — 5
Calculate wheelie distance only while wheelie state is valid — 5
Display live wheelie meter counter during run — 5
Implement crash detection for looping out backward — 5
Implement crash detection for failed recovery / unstable landing threshold — 5
Stop active run after crash — 3
Create instant restart flow without page reload — 3
Set spawn / reset position for each retry — 3
Build HUD with live score, wheelie distance, and best score — 5
Create mobile-readable UI layout from the provided visual direction — 3
Add camera follow system tuned for vertical mobile framing — 5
Keep bike readable on small mobile screens at all times — 3
Create simple road environment and lightweight background — 5
Add banner / road sign interaction as a gameplay reward moment — 5
Create rear wheel spin feedback — 3
Add lightweight rider lean visual feedback for wheelie posture — 8
Add simple suspension compression visual effect under throttle — 5
Set up configurable tuning variables for power, brake strength, weight effect, etc. — 8
Create debug mode for throttle, brake, pitch angle, speed, and wheelie-active state — 5
Save local best score in browser storage — 3
Optimize rendering and physics for stable mobile performance — 8
Test simultaneous thumb controls on real mobile devices — 3
Tune control responsiveness for portrait smartphone gameplay — 5