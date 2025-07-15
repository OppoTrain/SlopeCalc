import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProjectSetup from "./pages/ProjectSetup";
import Connector from "./pages/Connector";
import Review from "./pages/Review";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects/:id" element={<ProjectSetup />} />
                <Route path="/projects/:id/connector" element={<Connector />} />
                <Route path="/projects/:id/review" element={<Review />} />
            </Routes>
        </Router>
    );
};

export default App;
