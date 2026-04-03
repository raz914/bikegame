import { useSyncExternalStore } from 'react'

const SCREENS = {
    LOADING: 'loading',
    WELCOME: 'welcome',
    MENU: 'menu',
    SETTINGS: 'settings',
    MODE_SELECT: 'modeSelect',
    STAGE_SELECT: 'stageSelect',
    RIDER_SELECT: 'riderSelect',
    BIKE_SELECT: 'bikeSelect',
    GAMEPLAY: 'gameplay',
}

const GAME_MODES = {
    CLASSIC: 'classic',
    ARCADE: 'arcade',
}

const GRAPHICS_QUALITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
}

const listeners = new Set()

let uiState = {
    currentScreen: SCREENS.LOADING,
    selectedGameMode: GAME_MODES.CLASSIC,
    selectedStage: 0,
    selectedRider: 0,
    selectedBike: 0,
    showGameOver: false,
    gameOverData: null,
    // Settings
    sfxEnabled: true,
    musicEnabled: true,
    graphicsQuality: GRAPHICS_QUALITY.HIGH,
}

function emitChange() {
    listeners.forEach((listener) => listener())
}

function subscribe(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
}

export function useUIState(selector = (state) => state) {
    return useSyncExternalStore(
        subscribe,
        () => selector(uiState),
        () => selector(uiState),
    )
}

export function goToScreen(screen) {
    uiState = { ...uiState, currentScreen: screen }
    emitChange()
}

export function setSelectedGameMode(mode) {
    uiState = { ...uiState, selectedGameMode: mode }
    emitChange()
}

export function setSelectedStage(index) {
    uiState = { ...uiState, selectedStage: index }
    emitChange()
}

export function setSelectedRider(index) {
    uiState = { ...uiState, selectedRider: index }
    emitChange()
}

export function setSelectedBike(index) {
    uiState = { ...uiState, selectedBike: index }
    emitChange()
}

export function showGameOver(data) {
    uiState = { ...uiState, showGameOver: true, gameOverData: data }
    emitChange()
}

export function hideGameOver() {
    uiState = { ...uiState, showGameOver: false, gameOverData: null }
    emitChange()
}

export function returnToMenu() {
    uiState = {
        ...uiState,
        currentScreen: SCREENS.MENU,
        showGameOver: false,
        gameOverData: null,
    }
    emitChange()
}

export function toggleSfx() {
    uiState = { ...uiState, sfxEnabled: !uiState.sfxEnabled }
    emitChange()
}

export function toggleMusic() {
    uiState = { ...uiState, musicEnabled: !uiState.musicEnabled }
    emitChange()
}

export function setGraphicsQuality(quality) {
    uiState = { ...uiState, graphicsQuality: quality }
    emitChange()
}

export { SCREENS, GAME_MODES, GRAPHICS_QUALITY }

