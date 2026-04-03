import './index.css'
import { GameStoreProvider } from './store/useGameStore'
import { useUIState, SCREENS } from './store/useUIStore'
import GameScene from './components/GameScene'
import GameUI from './components/GameUI'
import LoadingScreen from './components/screens/LoadingScreen'
import WelcomeScreen from './components/screens/WelcomeScreen'
import MainMenuScreen from './components/screens/MainMenuScreen'
import StageSelectScreen from './components/screens/StageSelectScreen'
import RiderSelectScreen from './components/screens/RiderSelectScreen'
import BikeSelectScreen from './components/screens/BikeSelectScreen'
import SettingsScreen from './components/screens/SettingsScreen'
import ModeSelectScreen from './components/screens/ModeSelectScreen'

function ScreenRouter() {
    const currentScreen = useUIState((s) => s.currentScreen)

    switch (currentScreen) {
        case SCREENS.LOADING:
            return <LoadingScreen />
        case SCREENS.WELCOME:
            return <WelcomeScreen />
        case SCREENS.MENU:
            return <MainMenuScreen />
        case SCREENS.SETTINGS:
            return <SettingsScreen />
        case SCREENS.MODE_SELECT:
            return <ModeSelectScreen />
        case SCREENS.STAGE_SELECT:
            return <StageSelectScreen />
        case SCREENS.RIDER_SELECT:
            return <RiderSelectScreen />
        case SCREENS.BIKE_SELECT:
            return <BikeSelectScreen />
        case SCREENS.GAMEPLAY:
            return (
                <div className="w-screen h-screen bg-black relative overflow-hidden">
                    <GameScene />
                    <GameUI />
                </div>
            )
        default:
            return <LoadingScreen />
    }
}

export default function App() {
    return (
        <GameStoreProvider>
            <ScreenRouter />
        </GameStoreProvider>
    )
}
