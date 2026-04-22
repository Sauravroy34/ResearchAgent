import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import App from './App.tsx'
import './index.css'

const system = createSystem(defaultConfig, {
  globalCss: {
    body: {
      bg: '#0A0F1E',
      color: 'white',
      fontFamily: `'Inter', sans-serif`,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <App />
    </ChakraProvider>
  </StrictMode>,
)
