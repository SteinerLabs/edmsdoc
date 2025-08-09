import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Flow } from './components/Flow'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Flow />
  </StrictMode>,
)
