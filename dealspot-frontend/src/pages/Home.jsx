import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllOffres, getOffresByCategorie, getOffresByLocalisation, addFavori, removeFavori, getFavoris } from '../services/api';
import { Heart, MapPin, Calendar, Tag, Cpu, Shirt, Home as HomeIcon, Dumbbell, UtensilsCrossed, MoreHorizontal, Search, Clock, AlertTriangle, X } from 'lucide-react';
import { usePopup } from '../components/Popup';
import axios from 'axios';

// Catégories avec icônes correspondant à celles du site
const categories = [
  { id: 'Électronique', label: 'Électronique', icon: Cpu },
  { id: 'Mode', label: 'Mode', icon: Shirt },
  { id: 'Maison', label: 'Maison', icon: HomeIcon },
  { id: 'Sport', label: 'Sport', icon: Dumbbell },
  { id: 'Alimentation', label: 'Alimentation', icon: UtensilsCrossed },
  { id: 'Autre', label: 'Autre', icon: MoreHorizontal },
];

// Composant Timer pour le compte à rebours
function CountdownTimer({ expirationDate }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const expiration = new Date(expirationDate).getTime();
    const difference = expiration - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000)
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expirationDate]);

  return (
    <div className="flex items-center gap-1 text-xs">
      <div className="bg-red-600 text-white px-1.5 py-0.5 rounded font-mono">
        {String(timeLeft.days).padStart(2, '0')}j
      </div>
      <span className="text-red-500">:</span>
      <div className="bg-red-600 text-white px-1.5 py-0.5 rounded font-mono">
        {String(timeLeft.hours).padStart(2, '0')}h
      </div>
      <span className="text-red-500">:</span>
      <div className="bg-red-600 text-white px-1.5 py-0.5 rounded font-mono">
        {String(timeLeft.minutes).padStart(2, '0')}m
      </div>
      <span className="text-red-500">:</span>
      <div className="bg-red-600 text-white px-1.5 py-0.5 rounded font-mono">
        {String(timeLeft.seconds).padStart(2, '0')}s
      </div>
    </div>
  );
}

function Home() {
  const [offres, setOffres] = useState([]);
  const [coupsDeCoeur, setCoupsDeCoeur] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categorie, setCategorie] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [favorisIds, setFavorisIds] = useState([]);
  const [showAllExpiring, setShowAllExpiring] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { showNotification, PopupComponents } = usePopup();

  useEffect(() => {
    fetchOffres();
    fetchCoupsDeCoeur();
    if (user.id) {
      fetchFavoris();
    }
  }, []);

  const fetchCoupsDeCoeur = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/offres/coups-de-coeur');
      setCoupsDeCoeur(response.data);
    } catch (error) {
      console.error('Erreur coups de cœur:', error);
    }
  };

  const fetchFavoris = async () => {
    try {
      const response = await getFavoris(user.id);
      const ids = response.data.map(fav => fav.offre.id);
      setFavorisIds(ids);
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    }
  };

  const fetchOffres = async () => {
    try {
      setLoading(true);
      const response = await getAllOffres();
      setOffres(response.data);
      setIsSearching(false);
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('Erreur lors du chargement des offres', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (searchKeyword.trim() === '') {
      fetchOffres();
      return;
    }

    try {
      setLoading(true);
      setIsSearching(true);
      const response = await axios.get(`http://localhost:8081/api/offres/search?keyword=${searchKeyword}`);
      setOffres(response.data);
      setCategorie('');
      setLocalisation('');
    } catch (error) {
      console.error('Erreur recherche:', error);
      showNotification('Erreur lors de la recherche', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setSearchKeyword('');
    setIsSearching(false);
    fetchOffres();
  };

  const handleFilter = async (selectedCategorie = categorie) => {
    try {
      setLoading(true);
      setIsSearching(false);
      setSearchKeyword('');
      let response;
      if (selectedCategorie) {
        response = await getOffresByCategorie(selectedCategorie);
      } else if (localisation) {
        response = await getOffresByLocalisation(localisation);
      } else {
        response = await getAllOffres();
      }
      setOffres(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    if (categorie === categoryId) {
      setCategorie('');
      fetchOffres();
    } else {
      setCategorie(categoryId);
      handleFilter(categoryId);
    }
  };

  const resetFilters = () => {
    setCategorie('');
    setLocalisation('');
    setSearchKeyword('');
    setIsSearching(false);
    fetchOffres();
  };

  const handleToggleFavori = async (offreId) => {
    if (!user.id) {
      showNotification('Vous devez être connecté pour ajouter aux favoris', 'warning');
      navigate('/login');
      return;
    }

    try {
      if (favorisIds.includes(offreId)) {
        await removeFavori(offreId, user.id);
        setFavorisIds(favorisIds.filter(id => id !== offreId));
        showNotification('Offre retirée des favoris', 'success');
      } else {
        await addFavori(offreId, user.id);
        setFavorisIds([...favorisIds, offreId]);
        showNotification('Offre ajoutée aux favoris !', 'success');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('Erreur lors de la modification des favoris', 'error');
    }
  };

  const handleViewDetails = async (offreId) => {
    // Incrémenter le compteur de vues
    try {
      await axios.post(`http://localhost:8081/api/offres/${offreId}/vue`);
    } catch (error) {
      console.error('Erreur incrémentation vue:', error);
    }
    navigate(`/offre/${offreId}`);
  };

  // Filtrer les offres qui expirent dans 2 jours ou moins
  const getExpiringOffers = () => {
    const now = new Date();
    const twoDaysFromNow = new Date(now.getTime() + (2 * 24 * 60 * 60 * 1000));
    
    return offres.filter(offre => {
      const expirationDate = new Date(offre.dateExpiration);
      return expirationDate > now && expirationDate <= twoDaysFromNow;
    });
  };

  const expiringOffers = getExpiringOffers();
  const displayedExpiringOffers = showAllExpiring ? expiringOffers : expiringOffers.slice(0, 4);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold text-blue-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PopupComponents />
      {/* Header */}
      <header className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-6 overflow-hidden">
        {/* Cercles décoratifs */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-52 h-52 bg-white/5 rounded-full translate-x-1/3 translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-white/20 p-2 rounded-lg"><HomeIcon className="w-6 h-6" /></span>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Accueil</h1>
                <p className="text-blue-200 text-sm">Les meilleures offres près de chez vous</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
              <div className="text-xl font-bold">{offres.length}</div>
              <div className="text-blue-200 text-xs">Offres</div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Barre de recherche par mots-clés */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 p-6">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-3 max-w-3xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Rechercher une offre par mot-clé (ex: smartphone, laptop, vêtements...)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Search className="w-5 h-5" />
                Rechercher
              </button>
              {(isSearching || categorie || localisation) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="bg-gray-100 text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium"
                >
                  <X className="w-5 h-5" />
                  Réinitialiser
                </button>
              )}
            </div>
          </form>

          {/* Message de résultats de recherche */}
          {isSearching && (
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                <Search className="w-4 h-4" />
                {offres.length} résultat{offres.length > 1 ? 's' : ''} trouvé{offres.length > 1 ? 's' : ''} pour "{searchKeyword}"
              </span>
            </div>
          )}

          {/* Barre de catégories avec icônes */}
          {!isSearching && (
            <>
              <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-6">
                {categories.map((cat) => {
                  const IconComponent = cat.icon;
                  const isActive = categorie === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`flex flex-col items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 min-w-[80px] ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                      <span className={`text-xs font-medium text-center ${isActive ? 'text-blue-600 border-b border-blue-600' : ''}`}>
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Barre de recherche par localisation */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={localisation}
                    onChange={(e) => setLocalisation(e.target.value)}
                    placeholder="Rechercher par localisation..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => handleFilter()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Search className="w-5 h-5" />
                  Rechercher
                </button>
              </div>

              {/* Filtre actif */}
              {categorie && (
                <div className="mt-4 flex justify-center">
                  <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                    <Tag className="w-4 h-4" />
                    Catégorie : {categorie}
                    <button
                      onClick={() => { setCategorie(''); fetchOffres(); }}
                      className="ml-1 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Section Coups de Cœur */}
        {!isSearching && coupsDeCoeur.length > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl p-1">
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Heart className="w-6 h-6 text-purple-600 fill-current" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      💖 Coups de Cœur de la Semaine
                    </h2>
                    <p className="text-sm text-gray-500">Les offres les plus populaires</p>
                  </div>
                  <div className="ml-auto bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-bold">
                    {coupsDeCoeur.length} offre{coupsDeCoeur.length > 1 ? 's' : ''}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {coupsDeCoeur.map((offre) => (
                    <div 
                      key={offre.id} 
                      className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
                      onClick={() => handleViewDetails(offre.id)}
                    >
                      {/* Badge coup de cœur */}
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold py-1 px-3 flex items-center justify-center gap-2">
                        <Heart className="w-3 h-3 fill-current" />
                        Coup de Cœur
                      </div>
                      
                      {/* Image */}
                      <div className="h-32 bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                        {offre.imageUrl ? (
                          <img src={offre.imageUrl} alt={offre.titre} className="w-full h-full object-cover" />
                        ) : (
                          <Tag className="w-12 h-12 text-white" />
                        )}
                      </div>

                      {/* Contenu */}
                      <div className="p-3">
                        <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1">{offre.titre}</h3>
                        
                        {/* Prix */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold text-green-600">{offre.prixPromo} DT</span>
                          <span className="text-xs text-gray-400 line-through">{offre.prixOriginal} DT</span>
                          <span className="ml-auto bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                            -{Math.round(((offre.prixOriginal - offre.prixPromo) / offre.prixOriginal) * 100)}%
                          </span>
                        </div>

                        {/* Localisation */}
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>{offre.localisation}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Bientôt Expiré */}
        {!isSearching && expiringOffers.length > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-xl p-1">
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red-100 p-2 rounded-lg animate-pulse">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      Bientôt Expiré! ⏳
                    </h2>
                    <p className="text-sm text-gray-500">Ces offres expirent dans moins de 48 heures</p>
                  </div>
                  <div className="ml-auto bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                    {expiringOffers.length} offre{expiringOffers.length > 1 ? 's' : ''}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {displayedExpiringOffers.map((offre) => (
                    <div 
                      key={offre.id} 
                      className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
                      onClick={() => handleViewDetails(offre.id)}
                    >
                      {/* Badge urgent */}
                      <div className="bg-red-600 text-white text-xs font-bold py-1 px-3 flex items-center justify-center gap-2">
                        <Clock className="w-3 h-3" />
                        <CountdownTimer expirationDate={offre.dateExpiration} />
                      </div>
                      
                      {/* Image */}
                      <div className="h-32 bg-gradient-to-r from-red-400 to-orange-400 flex items-center justify-center">
                        {offre.imageUrl ? (
                          <img src={offre.imageUrl} alt={offre.titre} className="w-full h-full object-cover" />
                        ) : (
                          <Tag className="w-12 h-12 text-white" />
                        )}
                      </div>

                      {/* Contenu */}
                      <div className="p-3">
                        <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1">{offre.titre}</h3>
                        
                        {/* Prix */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold text-green-600">{offre.prixPromo} DT</span>
                          <span className="text-xs text-gray-400 line-through">{offre.prixOriginal} DT</span>
                          <span className="ml-auto bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                            -{Math.round(((offre.prixOriginal - offre.prixPromo) / offre.prixOriginal) * 100)}%
                          </span>
                        </div>

                        {/* Localisation */}
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>{offre.localisation}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bouton Voir plus / Voir moins */}
                {expiringOffers.length > 4 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setShowAllExpiring(!showAllExpiring)}
                      className="text-red-600 italic underline underline-offset-2 decoration-1 hover:text-red-700 transition-colors"
                    >
                      {showAllExpiring ? 'Voir moins' : `Voir plus (${expiringOffers.length - 4} autres)`}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Liste des offres */}
        <h2 className="text-2xl font-bold mb-6">📋 Offres actives ({offres.length})</h2>
        
        {offres.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Search className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-2">
              {isSearching ? 'Aucun résultat trouvé' : 'Aucune offre disponible pour le moment'}
            </p>
            {isSearching && (
              <p className="text-gray-400 mb-4">Essayez avec d'autres mots-clés</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offres.map((offre) => (
              <div key={offre.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                {/* Image */}
                <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                  {offre.imageUrl ? (
                    <img src={offre.imageUrl} alt={offre.titre} className="w-full h-full object-cover" />
                  ) : (
                    <Tag className="w-20 h-20 text-white" />
                  )}
                </div>

                {/* Contenu */}
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-2">{offre.titre}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{offre.description}</p>

                  {/* Prix */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-green-600">{offre.prixPromo} DT</span>
                    <span className="text-sm text-gray-400 line-through">{offre.prixOriginal} DT</span>
                    <span className="ml-auto bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                      -{Math.round(((offre.prixOriginal - offre.prixPromo) / offre.prixOriginal) * 100)}%
                    </span>
                  </div>

                  {/* Infos */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <span>{offre.categorie}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{offre.localisation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Expire le {new Date(offre.dateExpiration).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => handleViewDetails(offre.id)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                      Voir détails
                    </button>
                    <button 
                      onClick={() => handleToggleFavori(offre.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        favorisIds.includes(offre.id)
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-red-50 text-red-600 hover:bg-red-100'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${favorisIds.includes(offre.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;