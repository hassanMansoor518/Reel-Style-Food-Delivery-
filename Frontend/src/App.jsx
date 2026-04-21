import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AppRoute from './routes/AppRoute'
   import './styles/theme.css';
   import './styles/forms.css';
function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <AppRoute />

    </div>
  )
}

export default App
