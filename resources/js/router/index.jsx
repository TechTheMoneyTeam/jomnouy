import { Routes, Route } from 'react-router-dom'
import Home from '../components/Homepage/Homepage'
import Projectlist from '../components/Projectlist/Projectlist'

const Index = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projectlist" element={<Projectlist />} />
            </Routes>
        </div>
    )
}

export default Index;
