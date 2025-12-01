import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllOffres, deleteOffre } from '../services/api';
import { Plus, Edit, Trash2, MapPin, Calendar, Tag } from 'lucide-react';

function MesOffres() {
  const [mesOffres, setMesOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!user.id) {
      alert('Vous devez être connecté');
      navigate('/login');
      return;
    }
    if (user.role !== 'VENDEUR') {
      alert('Accès réservé aux vendeurs');
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
      alert('Erreur lors du chargement des offres');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) return;

    try {
      await deleteOffre(id, user.id);
      alert('Offre supprimée avec succès');
      fetchMesOffres();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
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
      <header className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">📊 Mes Offres</h1>
              <p className="text-green-100">Gérez vos offres ({mesOffres.length})</p>
            </div>
            <button
              onClick={() => navigate('/create-offre')}
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nouvelle offre
            </button>
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