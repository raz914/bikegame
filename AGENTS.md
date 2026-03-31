# Repository Guidelines

## Project Structure & Module Organization
This is a Vite + React game project. Application code lives in `src/`, with screen flows in `src/components/screens/`, gameplay UI in `src/components/game-ui/`, state stores in `src/store/`, hooks in `src/hooks/`, and static gameplay data in `src/data/`. Shared helpers belong in `src/utils/`. Public runtime assets such as models, stage art, and logos live in `public/`. Planning notes and MVP breakdowns are kept in `docs/`. Build output is generated into `dist/` and should not be edited by hand.

## Build, Test, and Development Commands
- `npm run dev`: start the local Vite dev server with hot reload.
- `npm run build`: create a production build in `dist/`.
- `npm run preview`: serve the production build locally for validation.
- `npm run lint`: run ESLint across the repository.

Run commands from the repository root: `D:\documents\fiverr stuff\tarik\bikegame`.

## Coding Style & Naming Conventions
Use ES modules and React function components. Match the existing code style: semicolon-free JavaScript/JSX, single quotes, and clear early-return logic where practical. Use `PascalCase` for components (`GameScene.jsx`), `camelCase` for hooks and utilities (`useBikeSimulation.js`, `createGameplayBike.js`), and descriptive store names with the `use...Store` pattern. Keep folder structure feature-oriented and avoid placing unrelated logic in large catch-all files.

## Testing Guidelines
There is no automated test suite configured yet. Until one is added, treat `npm run lint` and `npm run build` as required pre-PR checks. When adding tests, place them beside the feature or under a dedicated `src/tests/` directory, and use names such as `BikeSelectScreen.test.jsx`. Prioritize coverage for gameplay state transitions, UI screen routing, and input handling.

## Commit & Pull Request Guidelines
Recent history uses very short commit messages, but contributors should prefer clear imperative summaries such as `Add rider tuning defaults` or `Refine stage select layout`. Keep commits focused. Pull requests should include a short description, affected areas, validation steps, and screenshots or short clips for UI/gameplay changes.

## Assets & Configuration
Do not commit secrets. Keep large binary assets optimized before adding them to `public/`. If you change models, stage images, or UI art, verify the file paths used by the corresponding components still resolve correctly in Vite.
