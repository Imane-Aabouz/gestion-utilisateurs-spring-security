import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, updateUser } from '../services/userService';
import Layout from '../components/Layout';

function ProfilePage() {
  const navigate = useNavigate();
  const [nom, setNom] = useState(localStorage.getItem('adminNom') || 'Admin');
  const [email, setEmail] = useState(localStorage.getItem('adminEmail') || 'admin@gmail.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [successInfo, setSuccessInfo] = useState(false);
  const [successPassword, setSuccessPassword] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);

  // Trouver l'utilisateur connecté par email
  const getCurrentUser = async () => {
    const res = await getAllUsers();
    const currentEmail = localStorage.getItem('adminEmail');
    return res.data.find(u => u.email === currentEmail) || null;
  };

  // Sauvegarder nom + email — sans toucher au mot de passe
  const handleSaveInfo = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!nom.trim()) errs.nom = 'Nom obligatoire';
    if (!email.trim()) errs.email = 'Email obligatoire';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Email invalide';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoadingInfo(true);
    try {
      const user = await getCurrentUser();
      if (!user) { setErrors({ nom: 'Utilisateur introuvable' }); return; }

      
      await updateUser(user.id, {
        name: nom,
        email,
        role: user.role
        
      });

      localStorage.setItem('adminNom', nom);
      localStorage.setItem('adminEmail', email);
      setSuccessInfo(true);
      setTimeout(() => setSuccessInfo(false), 3000);
    } catch {
      setErrors({ nom: 'Erreur lors de la mise à jour' });
    } finally {
      setLoadingInfo(false);
    }
  };

  //  Changer le mot de passe :
  const handleSavePassword = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!currentPassword) errs.currentPassword = 'Mot de passe actuel obligatoire';
    if (!newPassword) errs.newPassword = 'Nouveau mot de passe obligatoire';
    else if (newPassword.length < 8) errs.newPassword = 'Minimum 8 caractères';
    if (!confirmPassword) errs.confirmPassword = 'Confirmation obligatoire';
    else if (newPassword !== confirmPassword) errs.confirmPassword = 'Les mots de passe ne correspondent pas';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoadingPassword(true);
    try {
      
      const loginRes = await fetch('http://localhost:8081/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: localStorage.getItem('adminEmail'),
          password: currentPassword
        })
      });

      
      if (!loginRes.ok) {
        setErrors({ currentPassword: 'Mot de passe actuel incorrect' });
        setLoadingPassword(false);
        return;
      }

      
      const user = await getCurrentUser();
      if (!user) { setErrors({ currentPassword: 'Utilisateur introuvable' }); return; }

      await updateUser(user.id, {
        name: user.name,
        email: user.email,
        role: user.role,
        password: newPassword  
      });

      setErrors({});
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessPassword(true);
      setTimeout(() => setSuccessPassword(false), 3000);
    } catch {
      setErrors({ currentPassword: 'Erreur lors du changement de mot de passe' });
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">

        {/* Topbar */}
        <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </button>
          <span className="text-slate-200">/</span>
          <h1 className="text-base font-medium text-slate-800">Mon profil</h1>
        </div>

        <div className="flex-1 p-6">
          <div className="max-w-2xl mx-auto flex flex-col gap-5">

            {/* Carte profil */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6">
              <div className="flex items-center gap-5 pb-6 border-b border-slate-100 mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-medium flex-shrink-0"
                  style={{backgroundColor:'#EEF2FF', color:'#001F5B'}}
                >
                  {nom.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-base font-medium text-slate-800">{nom}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{email}</p>
                  <span
                    className="inline-flex mt-2 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{backgroundColor:'#EDE9FE', color:'#5B21B6'}}
                  >
                    Administrateur
                  </span>
                </div>
              </div>

              {successInfo && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs rounded-xl px-4 py-3 mb-5">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Informations mises à jour avec succès
                </div>
              )}

              <form onSubmit={handleSaveInfo} className="flex flex-col gap-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Informations personnelles
                </p>

                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">Nom complet</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={nom}
                      onChange={e => { setNom(e.target.value); setErrors({...errors, nom: ''}); }}
                      className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl outline-none transition
                        ${errors.nom ? 'border-rose-300 bg-rose-50' : 'border-slate-200'}`}
                    />
                  </div>
                  {errors.nom && <p className="text-xs text-rose-500 mt-1">{errors.nom}</p>}
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">Adresse email</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setErrors({...errors, email: ''}); }}
                      className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl outline-none transition
                        ${errors.email ? 'border-rose-300 bg-rose-50' : 'border-slate-200'}`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                </div>

                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={loadingInfo}
                    className="text-sm font-medium text-white px-6 py-2.5 rounded-xl transition flex items-center gap-2"
                    style={{backgroundColor: loadingInfo ? '#93a3b8' : '#001F5B'}}
                    onMouseEnter={e => { if (!loadingInfo) e.currentTarget.style.backgroundColor='#002a7a'; }}
                    onMouseLeave={e => { if (!loadingInfo) e.currentTarget.style.backgroundColor='#001F5B'; }}
                  >
                    {loadingInfo && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {loadingInfo ? 'Enregistrement...' : 'Sauvegarder'}
                  </button>
                </div>
              </form>
            </div>

            {/* Modification de mot de passe */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6">

              {successPassword && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs rounded-xl px-4 py-3 mb-5">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Mot de passe modifié avec succès dans la base de données
                </div>
              )}

              <form onSubmit={handleSavePassword} className="flex flex-col gap-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                  Changer le mot de passe
                </p>

                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">Mot de passe actuel</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={e => { setCurrentPassword(e.target.value); setErrors({...errors, currentPassword: ''}); }}
                      placeholder="Votre mot de passe actuel"
                      className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl outline-none transition
                        ${errors.currentPassword ? 'border-rose-300 bg-rose-50' : 'border-slate-200'}`}
                    />
                  </div>
                  {errors.currentPassword && <p className="text-xs text-rose-500 mt-1">{errors.currentPassword}</p>}
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">Nouveau mot de passe</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => { setNewPassword(e.target.value); setErrors({...errors, newPassword: ''}); }}
                      placeholder="Nouveau mot de passe"
                      className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl outline-none transition
                        ${errors.newPassword ? 'border-rose-300 bg-rose-50' : 'border-slate-200'}`}
                    />
                  </div>
                  {errors.newPassword && <p className="text-xs text-rose-500 mt-1">{errors.newPassword}</p>}
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">Confirmer le mot de passe</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => { setConfirmPassword(e.target.value); setErrors({...errors, confirmPassword: ''}); }}
                      placeholder="Confirmer le nouveau mot de passe"
                      className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl outline-none transition
                        ${errors.confirmPassword ? 'border-rose-300 bg-rose-50' : 'border-slate-200'}`}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-rose-500 mt-1">{errors.confirmPassword}</p>}
                </div>

                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={loadingPassword}
                    className="text-sm font-medium text-white px-6 py-2.5 rounded-xl transition flex items-center gap-2"
                    style={{backgroundColor: loadingPassword ? '#93a3b8' : '#001F5B'}}
                    onMouseEnter={e => { if (!loadingPassword) e.currentTarget.style.backgroundColor='#002a7a'; }}
                    onMouseLeave={e => { if (!loadingPassword) e.currentTarget.style.backgroundColor='#001F5B'; }}
                  >
                    {loadingPassword && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {loadingPassword ? 'Enregistrement...' : 'Modifier le mot de passe'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProfilePage;