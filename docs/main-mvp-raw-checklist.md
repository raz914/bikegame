# Main MVP Raw Checklist

Monday.com task list preserved in original order, with current repo status overlaid.

## Status Legend

- `Complete`: clearly implemented in the current alpha repo and reusable as a baseline
- `Partial / Repolish`: present in some form, but not yet aligned with the intended main MVP behavior or quality bar
- `Pending`: missing, or not implemented clearly enough to count

For the categorized view and fuller notes, see `docs/main-mvp-task-map.md`.

| Raw (Monday) | Estimate | Status | Notes |
| --- | --- | --- | --- |
| Set up Three.js web app project structure and deployment-ready repository — 2 | 2 | `Partial / Repolish` | Working Vite/Three app, but not fully production-ready repo packaging. |
| Create mobile-first touch input system with two simultaneous thumb zones — 5 | 5 | `Partial / Repolish` | Large touch controls exist, but not real analog thumb zones yet. |
| Build left control area for rider weight distribution — 3 | 3 | `Partial / Repolish` | Left control exists visually, but not as a true rider-weight pad. |
| Implement front/back rider weight shift as the main gameplay mechanic — 8 | 8 | `Pending` | Phase 1 state is ready, but the full mechanic is not implemented yet. |
| Map left control upward movement to weight forward — 2 | 2 | `Pending` | No directional left-thumb mapping yet. |
| Map left control downward movement to weight backward — 2 | 2 | `Pending` | No directional left-thumb mapping yet. |
| Keep left/right rider balance visible in UI but low gameplay impact for MVP — 3 | 3 | `Pending` | Current UI shows pitch angle, not rider side-balance. |
| Build right control area for throttle and brake — 3 | 3 | `Partial / Repolish` | Right control exists, but Phase 2 still needs the real pad behavior. |
| Map right control downward/back movement to throttle — 2 | 2 | `Pending` | No directional right-thumb mapping yet. |
| Map right control upward/front movement to brake — 2 | 2 | `Pending` | No directional right-thumb mapping yet. |
| Make throttle and brake continuous analog inputs, not just on/off — 5 | 5 | `Partial / Repolish` | Phase 1 added analog state, but touch UI still uses a temporary bridge. |
| Create drivable bike prototype — 8 | 8 | `Complete` | Playable alpha bike prototype already exists. |
| Implement base forward bike movement — 3 | 3 | `Complete` | Forward movement is already in the runtime loop. |
| Implement natural front-end lift under throttle — 5 | 5 | `Partial / Repolish` | Lift now reads throttle state, but still needs Phase 3 tuning. |
| Make wheelie behavior depend on rider weight distribution plus throttle together — 8 | 8 | `Partial / Repolish` | Phase 1 bridges toward this, but not final gameplay quality yet. |
| Tune low-speed behavior so centered weight plus full throttle lifts the bike naturally — 8 | 8 | `Pending` | Needs dedicated tuning after Phase 2 controls land. |
| Tune higher-speed behavior so the same inputs behave differently — 8 | 8 | `Partial / Repolish` | Speed already affects behavior, but not in final tuned form. |
| Implement wheelie physics and pitch control — 8 | 8 | `Partial / Repolish` | Existing prototype plus Phase 1 bridge, but not the final MVP model. |
| Implement brake effect on pitch recovery during wheelies — 5 | 5 | `Partial / Repolish` | Phase 1 introduces brake influence, but it still needs tuning and validation. |
| Detect valid wheelie state — 5 | 5 | `Partial / Repolish` | Phase 1 now tracks an interim valid-wheelie state. |
| Calculate wheelie distance only while wheelie state is valid — 5 | 5 | `Partial / Repolish` | Phase 1 now tracks wheelie-only distance, pending final rules. |
| Display live wheelie meter counter during run — 5 | 5 | `Partial / Repolish` | Wheelie distance is visible in the HUD, but not yet final-form presentation. |
| Implement crash detection for looping out backward — 5 | 5 | `Partial / Repolish` | Existing loop-out threshold exists, but still simplistic. |
| Implement crash detection for failed recovery / unstable landing threshold — 5 | 5 | `Pending` | No explicit landing stability logic yet. |
| Stop active run after crash — 3 | 3 | `Complete` | Crash stops the run already. |
| Create instant restart flow without page reload — 3 | 3 | `Complete` | Restart already happens in-app. |
| Set spawn / reset position for each retry — 3 | 3 | `Complete` | Reset already returns the run to start state. |
| Build HUD with live score, wheelie distance, and best score — 5 | 5 | `Partial / Repolish` | HUD now exposes score, wheelie distance, and best score, but still needs final MVP polish. |
| Create mobile-readable UI layout from the provided visual direction — 3 | 3 | `Partial / Repolish` | Readable now, but not final against the target visual direction. |
| Add camera follow system tuned for vertical mobile framing — 5 | 5 | `Complete` | Portrait-aware camera follow already exists. |
| Keep bike readable on small mobile screens at all times — 3 | 3 | `Partial / Repolish` | Strong baseline, still needs device tuning. |
| Create simple road environment and lightweight background — 5 | 5 | `Complete` | Lightweight road and background already exist. |
| Add banner / road sign interaction as a gameplay reward moment — 5 | 5 | `Pending` | No gameplay reward interaction yet. |
| Create rear wheel spin feedback — 3 | 3 | `Complete` | Wheel spin feedback already exists. |
| Add lightweight rider lean visual feedback for wheelie posture — 8 | 8 | `Partial / Repolish` | Bike pitch sells some of this, but rider-specific feedback is still limited. |
| Add simple suspension compression visual effect under throttle — 5 | 5 | `Pending` | Not implemented yet. |
| Set up configurable tuning variables for power, brake strength, weight effect, etc. — 8 | 8 | `Partial / Repolish` | Phase 1 grouped the tuning base, but it still needs expansion and iteration support. |
| Create debug mode for throttle, brake, pitch angle, speed, and wheelie-active state — 5 | 5 | `Partial / Repolish` | Phase 1 stores debug values, but there is no dedicated debug UI yet. |
| Save local best score in browser storage — 3 | 3 | `Pending` | Best score exists in runtime state, not browser storage yet. |
| Optimize rendering and physics for stable mobile performance — 8 | 8 | `Partial / Repolish` | Lightweight baseline exists, but no dedicated mobile performance pass yet. |
| Test simultaneous thumb controls on real mobile devices — 3 | 3 | `Pending` | No real-device validation recorded yet. |
| Tune control responsiveness for portrait smartphone gameplay — 5 | 5 | `Partial / Repolish` | Temporary bridge works, but final thumb-zone responsiveness belongs to Phase 2. |
