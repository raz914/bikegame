import './index.css'
import { GameStoreProvider } from './store/useGameStore'
import GameScene from './components/GameScene'
import GameUI from './components/GameUI'

export default function App() {
  return (
    <GameStoreProvider>
      <div className="w-screen h-screen bg-black relative overflow-hidden">
        <GameScene />
        <GameUI />
      </div>
    </GameStoreProvider>
  )
}
