import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOffreById, updateOffre } from '../services/api';
import { usePopup } from '../components/Popup';
import { Edit, ArrowLeft } from 'lucide-react';

function EditOffre() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { showNotification, PopupComponents } = usePopup();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    prixOriginal: '',
    prixPromo: '',
    categorie: 'Électronique',
    localisation: '',
    imageUrl: '',
    dateDebut: '',
    dateExpiration: ''
  });

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
    fetchOffre();
  }, [id]);

  const fetchOffre = async () => {
    try {
      setLoading(true);
      const response = await getOffreById(id);
      const offre = response.data;
      
      // Vérifier que l'utilisateur est le propriétaire de l'offre
      if (offre.user.id !== user.id) {
        showNotification('Vous ne pouvez modifier que vos propres offres', 'error');
        navigate('/mes-offres');
        return;
      }

      // Formater les dates pour l'input datetime-local
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      };

      setFormData({
        titre: offre.titre || '',
        description: offre.description || '',
        prixOriginal: offre.prixOriginal || '',
        prixPromo: offre.prixPromo || '',
        categorie: offre.categorie || 'Électronique',
        localisation: offre.localisation || '',
        imageUrl: offre.imageUrl || '',
        dateDebut: formatDate(offre.dateDebut),
        dateExpiration: formatDate(offre.dateExpiration)
      });
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('Erreur lors du chargement de l\'offre', 'error');
      navigate('/mes-offres');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des prix
    if (parseFloat(formData.prixOriginal) <= parseFloat(formData.prixPromo)) {
      showNotification('Le prix original doit être supérieur au prix promotionnel', 'error');
      return;
    }

    try {
      await updateOffre(id, formData, user.id);
      showNotification('Offre modifiée avec succès !', 'success');
      setTimeout(() => navigate('/mes-offres'), 1500);
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('Erreur lors de la modification de l\'offre', 'error');
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
      
      {/* Header */}
      <header className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white py-5 overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/3 translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/mes-offres')}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>
            <div className="flex items-center gap-2">
              <span className="bg-white/20 p-1.5 rounded-lg"><Edit className="w-5 h-5" /></span>
              <h1 className="text-xl md:text-2xl font-bold">Modifier l'offre</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de l'offre *
                </label>
                <input
                  type="text"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Laptop HP Gaming"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Décrivez votre offre..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix original (DT) *
                </label>
                <input
                  type="number"
                  name="prixOriginal"
                  value={formData.prixOriginal}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="2500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix promotionnel (DT) *
                </label>
                <input
                  type="number"
                  name="prixPromo"
                  value={formData.prixPromo}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="1999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  name="categorie"
                  value={formData.categorie}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Électronique">Électronique</option>
                  <option value="Mode">Mode</option>
                  <option value="Maison">Maison</option>
                  <option value="Sport">Sport</option>
                  <option value="Alimentation">Alimentation</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation *
                </label>
                <input
                  type="text"
                  name="localisation"
                  value={formData.localisation}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Tunis, Sousse..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de l'image
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de début *
                </label>
                <input
                  type="datetime-local"
                  name="dateDebut"
                  value={formData.dateDebut}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date d'expiration *
                </label>
                <input
                  type="datetime-local"
                  name="dateExpiration"
                  value={formData.dateExpiration}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
              >
                Enregistrer les modifications
              </button>
              <button
                type="button"
                onClick={() => navigate('/mes-offres')}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditOffre;
