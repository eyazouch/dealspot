import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOffreById, addFavori, removeFavori, getFavoris } from '../services/api';
import { Heart, MapPin, Calendar, Tag, ArrowLeft, User, Eye } from 'lucide-react';
import { usePopup } from '../components/Popup';
import axios from 'axios';

function OffreDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offre, setOffre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavori, setIsFavori] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { showNotification, PopupComponents } = usePopup();

  useEffect(() => {
    fetchOffre();
    if (user.id) {
      checkIfFavori();
    }
    // Incrémenter le compteur de vues
    incrementerVue();
  }, [id]);

  const incrementerVue = async () => {
    try {
      await axios.post(`http://localhost:8081/api/offres/${id}/vue`);
    } catch (error) {
      console.error('Erreur incrémentation vue:', error);
    }
  };

  const fetchOffre = async () => {
    try {
      setLoading(true);
      const response = await getOffreById(id);
      setOffre(response.data);
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('Erreur lors du chargement de l\'offre', 'error');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavori = async () => {
    try {
      const response = await getFavoris(user.id);
      const favorisList = response.data;
      const found = favorisList.some(fav => fav.offre.id === parseInt(id));
      setIsFavori(found);
    } catch (error) {
      console.error('Erreur lors de la vérification des favoris:', error);
    }
  };

  const handleToggleFavori = async () => {
    if (!user.id) {
      showNotification('Vous devez être connecté pour ajouter aux favoris', 'warning');
      navigate('/login');
      return;
    }

    try {
      if (isFavori) {
        await removeFavori(offre.id, user.id);
        setIsFavori(false);
        showNotification('Offre retirée des favoris', 'success');
      } else {
        await addFavori(offre.id, user.id);
        setIsFavori(true);
        showNotification('Offre ajoutée aux favoris !', 'success');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('Erreur lors de la modification des favoris', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold text-blue-600">Chargement...</div>
      </div>
    );
  }

  if (!offre) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold text-red-600">Offre non trouvée</div>
      </div>
    );
  }

  const reduction = Math.round(((offre.prixOriginal - offre.prixPromo) / offre.prixOriginal) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <PopupComponents />
      {/* Header */}
      <header className="relative bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 text-white py-5 overflow-hidden">
        {/* Cercles décoratifs */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/3 translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>
            <div className="flex items-center gap-2">
              <span className="bg-white/20 p-1.5 rounded-lg">📦</span>
              <h1 className="text-xl md:text-2xl font-bold">Détails de l'offre</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image */}
            <div className="h-64 lg:h-auto bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              {offre.imageUrl ? (
                <img 
                  src={offre.imageUrl} 
                  alt={offre.titre} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Tag className="w-32 h-32 text-white" />
              )}
            </div>

            {/* Contenu */}
            <div className="p-8">
              {/* Badges */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                  -{reduction}%
                </span>
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                  {offre.categorie}
                </span>
                {offre.estCoupDeCoeur && (
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-current" />
                    Coup de Cœur
                  </span>
                )}
                {offre.nombreVues > 0 && (
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {offre.nombreVues} vue{offre.nombreVues > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Titre */}
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{offre.titre}</h2>

              {/* Description */}
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                {offre.description || 'Aucune description disponible.'}
              </p>

              {/* Prix */}
              <div className="bg-green-50 p-4 rounded-xl mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-green-600">{offre.prixPromo} DT</span>
                  <span className="text-xl text-gray-400 line-through">{offre.prixOriginal} DT</span>
                </div>
                <p className="text-green-600 text-sm mt-1">
                  Économisez {(offre.prixOriginal - offre.prixPromo).toFixed(2)} DT
                </p>
              </div>

              {/* Informations */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <span className="text-lg">{offre.localisation}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <span>
                    Du {new Date(offre.dateDebut).toLocaleDateString('fr-FR')} au{' '}
                    {new Date(offre.dateExpiration).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                {offre.user && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <User className="w-5 h-5 text-purple-500" />
                    <span>Vendeur : {offre.user.username}</span>
                    {offre.user.badges && offre.user.badges.length > 0 && (
                      <span className="text-sm font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                        {offre.user.badges[0]}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Bouton Favori */}
              <button
                onClick={handleToggleFavori}
                className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-colors ${
                  isFavori
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-200'
                }`}
              >
                <Heart className={`w-6 h-6 ${isFavori ? 'fill-current' : ''}`} />
                {isFavori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OffreDetails;