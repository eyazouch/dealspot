import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavoris, removeFavori } from '../services/api';
import { Heart, MapPin, Calendar, Tag, Trash2 } from 'lucide-react';
import { usePopup } from '../components/Popup';

function Favoris() {
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { showNotification, showConfirm, PopupComponents } = usePopup();

  useEffect(() => {
    if (!user.id) {
      showNotification('Vous devez être connecté pour voir vos favoris', 'warning');
      navigate('/login');
      return;
    }
    fetchFavoris();
  }, []);

  const fetchFavoris = async () => {
    try {
      setLoading(true);
      const response = await getFavoris(user.id);
      setFavoris(response.data);
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('Erreur lors du chargement des favoris', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavori = async (offreId) => {
    const confirmed = await showConfirm('Retirer cette offre de vos favoris ?');
    if (!confirmed) return;

    try {
      await removeFavori(offreId, user.id);
      showNotification('Offre retirée des favoris', 'success');
      fetchFavoris();
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('Erreur lors de la suppression', 'error');
    }
  };

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
      <header className="relative bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-600 text-white py-6 overflow-hidden">
        {/* Cercles décoratifs */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-1/3 translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-white/20 p-2 rounded-lg"><Heart className="w-5 h-5 fill-current" /></span>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Mes Favoris</h1>
                <p className="text-pink-200 text-sm">Vos offres préférées</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
              <div className="text-xl font-bold">{favoris.length}</div>
              <div className="text-pink-200 text-xs">Favoris</div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {favoris.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Heart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-4">Aucun favori pour le moment</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Découvrir des offres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoris.map((favori) => (
              <div key={favori.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                {/* Image */}
                <div className="h-48 bg-gradient-to-r from-red-400 to-pink-500 flex items-center justify-center">
                  {favori.offre.imageUrl ? (
                    <img src={favori.offre.imageUrl} alt={favori.offre.titre} className="w-full h-full object-cover" />
                  ) : (
                    <Tag className="w-20 h-20 text-white" />
                  )}
                </div>

                {/* Contenu */}
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-2">{favori.offre.titre}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{favori.offre.description}</p>

                  {/* Prix */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-green-600">{favori.offre.prixPromo} DT</span>
                    <span className="text-sm text-gray-400 line-through">{favori.offre.prixOriginal} DT</span>
                    <span className="ml-auto bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                      -{Math.round(((favori.offre.prixOriginal - favori.offre.prixPromo) / favori.offre.prixOriginal) * 100)}%
                    </span>
                  </div>

                  {/* Infos */}
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <span>{favori.offre.categorie}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{favori.offre.localisation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Expire le {new Date(favori.offre.dateExpiration).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => handleRemoveFavori(favori.offre.id)}
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Retirer des favoris
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favoris;