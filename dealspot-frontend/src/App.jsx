import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Heart, PlusCircle, Package, LogIn, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateOffre from './pages/CreateOffre';
import MesOffres from './pages/MesOffres';
import Favoris from './pages/Favoris';
import OffreDetails from './pages/OffreDetails';
import EditOffre from './pages/EditOffre';
import { ConfirmPopup } from './components/Popup';

function Navigation() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('user');
    setShowLogoutConfirm(false);
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      {showLogoutConfirm && (
        <ConfirmPopup
          message="Voulez-vous vraiment vous déconnecter ?"
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
      <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
            🎯 DealSpot
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <HomeIcon className="w-5 h-5" />
              <span className="hidden md:inline">Accueil</span>
            </Link>

            {user.id ? (
              <>
                <Link
                  to="/favoris"
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  <span className="hidden md:inline">Favoris</span>
                </Link>

                {user.role === 'VENDEUR' && (
                  <>
                    <Link
                      to="/mes-offres"
                      className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
                    >
                      <Package className="w-5 h-5" />
                      <span className="hidden md:inline">Mes Offres</span>
                    </Link>
                    <Link
                      to="/create-offre"
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <PlusCircle className="w-5 h-5" />
                      <span className="hidden md:inline">Créer</span>
                    </Link>
                  </>
                )}

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="w-5 h-5" />
                    <span className="hidden md:inline font-semibold">{user.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden md:inline">Déconnexion</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="hidden md:inline">Connexion</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-offre" element={<CreateOffre />} />
          <Route path="/mes-offres" element={<MesOffres />} />
          <Route path="/favoris" element={<Favoris />} />
          <Route path="/offre/:id" element={<OffreDetails />} />
          <Route path="/edit-offre/:id" element={<EditOffre />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;