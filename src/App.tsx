import { useState } from 'react'
import SetupPage from './components/SetupPage'
import ChatPage from './components/ChatPage'

function App() {
  const [initialized, setInitialized] = useState(false)

  if (!initialized) {
    return <SetupPage onInitialized={() => setInitialized(true)} />
  }

  return <ChatPage onLogout={() => setInitialized(false)} />
}

export default App
