import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Main from './Main.jsx'

const root = createRoot(document.getElementById('root'))
root.render(
    <>
        <App />
        <Main />
    </>
)
