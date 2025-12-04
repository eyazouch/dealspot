import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Eye, Heart, Package, Award, Calendar, PlusCircle, Trash2, Clock } from 'lucide-react';
import { usePopup } from '../components/Popup';
import axios from 'axios';

function VendorStatistiques() {
  const [stats, setStats] = useState(null);
  const [rapports, setRapports] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { showNotification, PopupComponents } = usePopup();

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
    fetchStatistiques();
    fetchRapports();
    updateBadges();
  }, []);

  const fetchStatistiques = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8081/api/statistiques/vendor/${user.id}`);
      setStats(response.data);
    } catch (error) {
      console.error('Erreur stats:', error);
      showNotification('Erreur lors du chargement des statistiques', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchRapports = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/rapports/vendor/${user.id}`);
      setRapports(response.data);
    } catch (error) {
      console.error('Erreur rapports:', error);
    }
  };

  const updateBadges = async () => {
    try {
      const response = await axios.post(`http://localhost:8081/api/vendeur/update-badges?userId=${user.id}`);
      setBadges(response.data.badges || []);
      // Mettre à jour le localStorage avec les nouveaux badges
      const updatedUser = { ...user, badges: response.data.badges };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Erreur mise à jour badges:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold text-blue-600">Chargement...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold text-red-600">Erreur de chargement</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PopupComponents />
      
      {/* Header */}
      <header className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white py-6 overflow-hidden">
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
              <span className="bg-white/20 p-1.5 rounded-lg"><TrendingUp className="w-5 h-5" /></span>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">Mes Statistiques</h1>
                <p className="text-blue-200 text-sm">Tableau de bord des performances</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Badges du vendeur */}
        {badges.length > 0 && (
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-xl p-4 mb-8 flex items-center gap-4">
            <Award className="w-12 h-12 text-purple-600" />
            <div>
              <h3 className="text-lg font-bold text-gray-800">Vos Badges</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {badges.map((badge, index) => (
                  <span key={index} className="text-lg font-bold text-purple-600 bg-white px-3 py-1 rounded-full shadow-sm">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Offres */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Package className="w-12 h-12 opacity-80" />
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                <span className="text-xs font-semibold">Actives</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 opacity-90">Offres Actives</h3>
            <p className="text-4xl font-bold">{stats.totalOffres}</p>
          </div>

          {/* Total Vues */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Eye className="w-12 h-12 opacity-80" />
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                <span className="text-xs font-semibold">Total</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 opacity-90">Total Vues</h3>
            <p className="text-4xl font-bold">{stats.totalVues}</p>
            {stats.totalOffres > 0 && (
              <p className="text-sm mt-2 opacity-80">
                Moyenne: {Math.round(stats.totalVues / stats.totalOffres)} vues/offre
              </p>
            )}
          </div>

          {/* Total Favoris */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Heart className="w-12 h-12 opacity-80 fill-current" />
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                <span className="text-xs font-semibold">Total</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 opacity-90">Total Favoris</h3>
            <p className="text-4xl font-bold">{stats.totalFavoris}</p>
            {stats.totalOffres > 0 && (
              <p className="text-sm mt-2 opacity-80">
                Moyenne: {Math.round(stats.totalFavoris / stats.totalOffres)} favoris/offre
              </p>
            )}
          </div>
        </div>

        {/* Offre la plus populaire */}
        {stats.offrePopulaire && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Offre la Plus Populaire</h2>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{stats.offrePopulaire.titre}</h3>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">{stats.offrePopulaire.vues} vues</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Rapports */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Rapports Automatiques</h2>
          </div>

          <div className="text-sm text-gray-600 mb-4 bg-blue-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">📅 Génération automatique des rapports :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Rapports hebdomadaires : chaque lundi à 8h00</li>
              <li>Rapports mensuels : le 1er de chaque mois à 8h00</li>
            </ul>
          </div>

          {rapports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Aucun rapport généré pour le moment</p>
              <p className="text-sm">Les rapports seront générés automatiquement chaque semaine</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rapports.map((rapport) => (
                <div 
                  key={rapport.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${
                        rapport.periode === 'SEMAINE' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-purple-100 text-purple-600'
                      }`}>
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          Rapport {rapport.periode === 'SEMAINE' ? 'Hebdomadaire' : 'Mensuel'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Généré le {new Date(rapport.dateGeneration).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="text-gray-500">Offres</p>
                        <p className="text-xl font-bold text-blue-600">{rapport.totalOffres}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">Vues</p>
                        <p className="text-xl font-bold text-green-600">{rapport.totalVues}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">Favoris</p>
                        <p className="text-xl font-bold text-purple-600">{rapport.totalFavoris}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500 flex items-center gap-1"><PlusCircle className="w-3 h-3" />Créées</p>
                        <p className="text-xl font-bold text-emerald-600">{rapport.offresCreees || 0}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500 flex items-center gap-1"><Trash2 className="w-3 h-3" />Supprimées</p>
                        <p className="text-xl font-bold text-red-600">{rapport.offresSupprimees || 0}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" />Expirées</p>
                        <p className="text-xl font-bold text-orange-600">{rapport.offresExpirees || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informations complémentaires */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Conseils pour améliorer les performances */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Conseils pour Améliorer vos Performances
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>Ajoutez des images de qualité à vos offres</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>Rédigez des descriptions détaillées et attractives</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>Proposez des réductions compétitives (30% ou plus)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>Renouvelez régulièrement vos offres</span>
              </li>
            </ul>
          </div>

          {/* Progression vers les badges */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Progression vers les Badges
            </h3>
            <div className="space-y-4">
              {/* Badge Vendeur Fiable */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Vendeur Fiable ✓</span>
                  <span className="text-sm text-gray-600">{stats.totalOffres}/10 offres</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((stats.totalOffres / 10) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Badge Vendeur Expert */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Vendeur Expert 💎</span>
                  <span className="text-sm text-gray-600">{stats.totalOffres}/50 offres</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-cyan-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((stats.totalOffres / 50) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Badge Vendeur Populaire */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Vendeur Populaire ⭐</span>
                  <span className="text-sm text-gray-600">{stats.totalFavoris}/30 favoris</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((stats.totalFavoris / 30) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Badge Top Vendeur */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Top Vendeur 🏆</span>
                  <span className="text-sm text-gray-600">{stats.totalFavoris}/100 favoris</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((stats.totalFavoris / 100) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorStatistiques;