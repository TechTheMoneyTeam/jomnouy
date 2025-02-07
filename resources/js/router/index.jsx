import { Routes, Route } from 'react-router-dom'
import Home from '../components/HomePage'
import About from '../components/AboutPage'

const Index = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </div>
    )
}

export default Index
