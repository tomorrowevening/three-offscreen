import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Wrapper from './Wrapper'

export const IS_DEV = import.meta.env.MODE === 'development'

createRoot(document.getElementById('root')!).render(
  <>
    {IS_DEV ? (
      <>
        <Wrapper />
      </>
    ) : (
      <StrictMode>
        <Wrapper />
      </StrictMode>
    )}
  </>
)
