import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../services/userService';
import Layout from '../components/Layout';

function AddUserPage() {
  const navigate = useNavigate();
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('USER');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');

  const validate = () => {
    const e = {};
    if (!nom.trim()) e.nom = 'Nom obligatoire';
    if (!email.trim()) e.email = 'Email obligatoire';
    if (!password.trim()) e.password = 'Mot de passe obligatoire';
    else if (password.length < 8) e.password = 'Minimum 8 caractères';
    if (email.trim() && !/\S+@\S+\.\S+/.test(email)) e.email = 'Email invalide';
    return e;
  };

  const onLogin = (e) => {
  e.preventDefault();
  const errs = validate();
  if (Object.keys(errs).length > 0) { setErrors(errs); return; }
  setLoading(true);
  
  /*creation d'un utilisateur*/
  createUser({ name: nom, email, password, role })
    .then(() => navigate('/users'))
    .catch(err => setErrors({ email: err.response?.status === 409 ? 'Email déjà utilisé' : 'Erreur lors de la création' }))
    .finally(() => setLoading(false));
};

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">

    {/* Topbar */}
     <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-3">
        <button
            onClick={() => navigate('/users')}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition"
          >
         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
       </svg>
         Retour
      </button>
      <span className="text-slate-200">/</span>
      <h1 className="text-base font-medium text-slate-800">Ajouter un utilisateur</h1>
    </div>

     {/* Contenu */}
     <div className="flex-1 p-6 flex items-start justify-center">
      <div className="bg-white border border-slate-100 rounded-2xl p-8 w-full max-w-lg">

    {/* Header carte */}
   <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
   <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
    style={{backgroundColor:'#EEF2FF'}}>
   <svg className="w-6 h-6" style={{color:'#001F5B'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
    </div>
    <div>
    <h2 className="text-sm font-medium text-slate-800">Nouvel utilisateur</h2>
   <p className="text-xs text-slate-400 mt-0.5">Remplissez les informations ci-dessous</p>
   </div>
    </div>

   {/* Formulaire */}
   <form onSubmit={onLogin} className="flex flex-col gap-5">

   {/* Champs Nom */}
    <div>
    <label className="text-xs font-medium text-slate-600 mb-1.5 block">
     Nom complet
     </label>
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
          placeholder="Ex: user"
          className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl outline-none transition
          ${errors.nom
            ? 'border-rose-300 bg-rose-50 focus:ring-2 focus:ring-rose-200'
           : 'border-slate-200 focus:ring-2 focus:border-transparent'}`}
          style={!errors.nom ? {'--tw-ring-color':'#B0C4DE'} : {}}
                  />
      </div>
       {errors.nom && <p className="text-xs text-rose-500 mt-1">{errors.nom}</p>}
      </div>

     {/* Champs Email */}
      <div>
       <label className="text-xs font-medium text-slate-600 mb-1.5 block">
         Adresse email
       </label>
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
      placeholder="Ex: user@gmail.com"
      className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl outline-none transition
      ${errors.email
         ? 'border-rose-300 bg-rose-50 focus:ring-2 focus:ring-rose-200'
       : 'border-slate-200 focus:ring-2 focus:border-transparent'}`}
                  />
     </div>
      {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
     </div>
        <div>
  <label className="text-xs font-medium text-slate-600 mb-1.5 block">Mot de passe</label>
  <div className="relative">
    <div className="absolute left-3 top-1/2 -translate-y-1/2">
      <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    </div>
        <input
          type="password"
          value={password}
          onChange={e => { setPassword(e.target.value); setErrors({...errors, password: ''}); }}
          placeholder="Mot de passe"
          className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl outline-none transition
            ${errors.password ? 'border-rose-300 bg-rose-50' : 'border-slate-200 focus:ring-2 focus:border-transparent'}`}
        />
      </div>
      {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
    </div>
     {/* Role */}
      <div>
        <label className="text-xs font-medium text-slate-600 mb-1.5 block">
              Role
       </label>
      <div className="flex gap-3">
          {['USER', 'ADMIN'].map(r => (
        <div
             key={r}
            onClick={() => setRole(r)}
           className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition"
           style={{
                        borderColor: role === r ? '#001F5B' : '#e2e8f0',
                        backgroundColor: role === r ? '#EEF2FF' : '#fff'
                      }}
                    >
       <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
            style={{borderColor: role === r ? '#001F5B' : '#cbd5e1'}}>
            {role === r && (
     <div className="w-2 h-2 rounded-full" style={{backgroundColor:'#001F5B'}}></div>  )}
          </div>
       <div>
        <p className="text-xs font-medium text-slate-700">{r}</p>
        <p className="text-xs text-slate-400">
             {r === 'USER' ? 'Acces standard' : 'Acces complet'}
       </p>
          </div>
      </div>
                  ))}
           </div>
      </div>

     {/* Boutons */}
      <div className="flex gap-3 mt-2">
        <button
            type="button"
            onClick={() => navigate('/users')}
            className="flex-1 py-2.5 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition"
                >
        Annuler
      </button>
         <button
         type="submit"
         disabled={loading}
         className="flex-1 py-2.5 text-sm font-medium text-white rounded-xl transition flex items-center justify-center gap-2"
         style={{backgroundColor: loading ? '#93a3b8' : '#001F5B'}}
                >
        {loading ? (
                    <>
     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Enregistrement...
                    </>
        ) : (
        'Ajouter l utilisateur'
                  )}
         </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AddUserPage;

