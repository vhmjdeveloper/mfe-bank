import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import RecipientForm from './app/components/forms/RecipientForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
<RecipientForm/>
    </>
  )
}

export default App
