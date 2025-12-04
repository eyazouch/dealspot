import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOffre } from '../services/api';
import { usePopup } from '../components/Popup';
import { PlusCircle, ArrowLeft } from 'lucide-react';

function CreateOffre() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { showNotification, PopupComponents } = usePopup();

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.id) {
      showNotification('Vous devez être connecté pour créer une offre', 'warning');
      navigate('/login');
      return;
    }

    if (user.role !== 'VENDEUR') {
      showNotification('Seuls les vendeurs peuvent créer des offres', 'error');
      return;
    }

    // Validation des prix
    if (parseFloat(formData.prixOriginal) <= parseFloat(formData.prixPromo)) {
      showNotification('Le prix original doit être supérieur au prix promotionnel', 'error');
      return;
    }

    // Validation des dates
    if (new Date(formData.dateDebut) > new Date(formData.dateExpiration)) {
      showNotification('La date de début doit être antérieure ou égale à la date d\'expiration', 'error');
      return;
    }

    try {
      await createOffre(formData, user.id);
      showNotification('Offre créée avec succès !', 'success');
      setTimeout(() => navigate('/mes-offres'), 1500);
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('Erreur lors de la création de l\'offre', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PopupComponents />
      
      {/* Header */}
      <header className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white py-5 overflow-hidden">
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
              <span className="bg-white/20 p-1.5 rounded-lg"><PlusCircle className="w-5 h-5" /></span>
              <h1 className="text-xl md:text-2xl font-bold">Créer une nouvelle offre</h1>
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
                  step="any"
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
                  step="any"
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
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                Créer l'offre
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
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

export default CreateOffre;