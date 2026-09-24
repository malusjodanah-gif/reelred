import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MovieDetails from "./pages/MovieDetails";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Collections from "./pages/Collections";
import Recommendations from "./pages/Recommendations";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CollectionDetails from "./pages/CollectionDetails";

function MainLayout() {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">

      <Navbar />

      <main className="min-h-screen px-4 py-10 md:px-8 md:py-14">
        <Routes>
          <Route path="/movie/:id" element={<MovieDetails />}/>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route
            path="/collections"
            element={<Collections />}
          />
          <Route
            path="/recommendations"
            element={<Recommendations />}
          />
          <Route
            path="/profile"
            element={<Profile />}
          />
          <Route
            path="/collections/:id"
            element={<CollectionDetails />}
          />
        </Routes>
      </main>

      <Footer />

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="*"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;