import { Routes, Route } from "react-router-dom";
import IndexPage from "./pages";
import PlacePage from "./pages/place";
import UserPage from "./pages/user";

function App() {
  return (
    <div className="w-full p-6">
      <Routes>
        <Route exact path="/" element={<IndexPage />} />
        <Route path="/place/:place" element={<PlacePage />} />
        <Route path="/user/:user" element={<UserPage />} />
      </Routes>
    </div>
  );
}

export default App;
