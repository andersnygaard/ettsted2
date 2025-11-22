import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './features/auth/LoginPage'
import CalculatorPage from './features/calculator/CalculatorPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
