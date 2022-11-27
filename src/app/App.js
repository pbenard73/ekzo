import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

import Home from './pages/Home'
import Times from './pages/Times'

const CHRONO_DEFAULT = 30;

// Available Pages
export const PAGES = {
  HOME: 'home',
  TIMES: 'times'
}

// Page Components
const COMPO = {
  [PAGES.HOME]: Home,
  [PAGES.TIMES]: Times
}

const App = () => {
  // Chosen tables
  const [timesTables, setTimesTable] = useState([])

  // Actual Page
  const [page, setPage] = useState(PAGES.HOME)

  // Actual Component
  const Page = COMPO[page]

  // Actual Chrono
  const [chrono, setChrono] = useState(CHRONO_DEFAULT)

  // Render Chosen Page
  return (
    <Page 
      timesTables={timesTables} 
      setTimesTable={setTimesTable} 
      setPage={setPage} 
      chrono={chrono}
      setChrono={setChrono}
    />
  )
}

export default App;
