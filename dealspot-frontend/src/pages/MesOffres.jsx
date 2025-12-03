import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllOffres, deleteOffre } from '../services/api';
import { Plus, Edit, Trash2, MapPin, Calendar, Tag, TrendingUp } from 'lucide-react';
import { usePopup } from '../components/Popup';

function MesOffres() {
  const [mesOffres, setMesOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { showNotification, showConfirm, PopupComponents } = usePopup();

  useEffect(() => {
    if (!user.id) {
      showNotification('Vous devez être connecté', 'warning');
      navigate('/login');
      return;
    }
    if (user.role !== 'VENDEUR') {
      showNotification('Accès réservé aux vendeurs', 'error');
      navigate('/');
      return;
    }
    fetchMesOffres();
  }, []);

  const fetchMesOffres = async () => {
    try {
      setLoading(true);
      const response = await getAllOffres();
      // Filtrer pour ne garder que les offres du vendeur connecté
      const offresVendeur = response.data.filter(offre => offre.user.id === user.id);
      setMesOffres(offresVendeur);
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('Erreur lors du chargement des offres', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm('Êtes-vous sûr de vouloir supprimer cette offre ?');
    if (!confirmed) return;

    try {
      await deleteOffre(id, user.id);
      showNotification('Offre supprimée avec succès', 'success');
      fetchMesOffres();
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
      <header className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white py-6 overflow-hidden">
        {/* Cercles décoratifs */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-52 h-52 bg-white/5 rounded-full translate-x-1/3 translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-white/20 p-2 rounded-lg"><Tag className="w-5 h-5" /></span>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Mes Offres</h1>
                <p className="text-emerald-200 text-sm">Gérez vos offres publiées</p>
              </div>
            </div>
            
            {/* SECTION MODIFIÉE : Ajout du bouton Statistiques */}
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                <div className="text-xl font-bold">{mesOffres.length}</div>
                <div className="text-emerald-200 text-xs">Offres</div>
              </div>
              
              {/* NOUVEAU : Bouton Statistiques */}
              <button
                onClick={() => navigate('/vendor/statistiques')}
                className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50 flex items-center gap-2 shadow-md transition-all"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Statistiques</span>
              </button>
              
              {/* Bouton Nouvelle Offre (existant) */}
              <button
                onClick={() => navigate('/create-offre')}
                className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50 flex items-center gap-2 shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nouvelle</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {mesOffres.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Tag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-4">Vous n'avez pas encore créé d'offres</p>
            <button
              onClick={() => navigate('/create-offre')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Créer ma première offre
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mesOffres.map((offre) => (
              <div key={offre.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                {/* Image */}
                <div className="h-48 bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
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
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/edit-offre/${offre.id}`)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(offre.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
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

export default MesOffres;