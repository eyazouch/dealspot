import { useState, useEffect } from 'react';
import { getAllOffres, getOffresByCategorie, getOffresByLocalisation } from '../services/api';
import { Heart, MapPin, Calendar, Tag } from 'lucide-react';

function Home() {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categorie, setCategorie] = useState('');
  const [localisation, setLocalisation] = useState('');

  useEffect(() => {
    fetchOffres();
  }, []);

  const fetchOffres = async () => {
    try {
      setLoading(true);
      const response = await getAllOffres();
      setOffres(response.data);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement des offres');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      let response;
      if (categorie) {
        response = await getOffresByCategorie(categorie);
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

  const resetFilters = () => {
    setCategorie('');
    setLocalisation('');
    fetchOffres();
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
      {/* Header */}
      <header className="bg-blue-600 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">🎯 DealSpot</h1>
          <p className="text-blue-100">Découvrez les meilleures offres près de chez vous</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filtres */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">🔍 Filtrer les offres</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Catégorie</label>
              <select
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Toutes les catégories</option>
                <option value="Électronique">Électronique</option>
                <option value="Mode">Mode</option>
                <option value="Maison">Maison</option>
                <option value="Sport">Sport</option>
                <option value="Alimentation">Alimentation</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Localisation</label>
              <input
                type="text"
                value={localisation}
                onChange={(e) => setLocalisation(e.target.value)}
                placeholder="Ex: Tunis, Sousse..."
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleFilter}
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Filtrer
              </button>
              <button
                onClick={resetFilters}
                className="flex-1 bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Liste des offres */}
        <h2 className="text-2xl font-bold mb-6">📋 Offres actives ({offres.length})</h2>
        
        {offres.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-xl text-gray-500">Aucune offre disponible pour le moment</p>
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
                    <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                      Voir détails
                    </button>
                    <button className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100">
                      <Heart className="w-5 h-5" />
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