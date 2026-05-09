import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AppRoute from './routes/AppRoute'
import MobileOnlyGuard from './components/MobileOnlyGuard';

function App() {
  const [count, setCount] = useState(0)

  return (
    <MobileOnlyGuard>
      <div>
        <AppRoute />
      </div>
    </MobileOnlyGuard>
  )
}

export default App
