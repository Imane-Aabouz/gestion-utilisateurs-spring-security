import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/userService';
import imglogin from '../assets/imglogin.webp';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs !");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await loginUser({ email, password });
      const { token, role, name } = res.data;

      if (!token) {
        setError("Email ou mot de passe incorrect !");
        return;
      }

      // Seuls les administrateurs accèdent à l'interface
      // (le backend refuse de toute façon les routes /users aux non-admins)
      if (role !== 'ADMIN') {
        setError("Accès refusé. Seuls les administrateurs peuvent se connecter.");
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('adminEmail', email);
      localStorage.setItem('adminNom', name);
      navigate('/');

    } catch (err) {
      setError(err.response?.status === 429
        ? "Trop de tentatives. Réessayez dans quelques minutes."
        : "Email ou mot de passe incorrect !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl flex overflow-hidden">

        {/* Panneau gauche */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-[#000080] to-[#001f3f] w-1/2 p-12 text-white">
          <img src={imglogin} alt="Sécurité" className="w-40 h-40 object-contain mb-8 drop-shadow-xl"
            style={{ filter: 'brightness(0) invert(1)' }} />
          <h2 className="text-2xl font-bold text-center mb-3">Espace Administrateur</h2>
          <p className="text-blue-200 text-sm text-center leading-relaxed">
            Accédez à votre espace de gestion et contrôlez vos utilisateurs facilement.
          </p>
          <div className="flex gap-2 mt-10">
            <span className="w-2 h-2 bg-white rounded-full opacity-80"></span>
            <span className="w-2 h-2 bg-white rounded-full opacity-40"></span>
            <span className="w-2 h-2 bg-white rounded-full opacity-40"></span>
          </div>
        </div>

        {/* Panneau droit */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Connexion</h1>
            <p className="text-gray-400 text-sm mt-1">Réservé aux administrateurs.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5 flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={onLogin} className="flex flex-col gap-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Adresse email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre email"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-medium py-3 rounded-xl transition duration-200 mt-2 flex items-center justify-center gap-2"
              style={{ backgroundColor: loading ? '#93a3b8' : '#001F5B' }}
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Vérification...</>
              ) : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;