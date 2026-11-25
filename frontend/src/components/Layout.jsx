import { useNavigate, useLocation } from 'react-router-dom';

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const adminNom   = localStorage.getItem('adminNom')   || 'Admin';
  const adminEmail = localStorage.getItem('adminEmail') || 'admin@gmail.com';

  return (
    <div className="flex min-h-screen bg-slate-50">
    <div className="w-56 flex flex-col py-5 flex-shrink-0 fixed h-full" style={{backgroundColor:'#001F5B'}}>
     <div className="px-5 pb-5 mb-5 flex items-center gap-3" style={{borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{backgroundColor:'#B0C4DE'}}>
     <svg className="w-4 h-4" style={{color:'#001F5B'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      </div>
       <div>
       <p className="text-sm font-medium text-white">GestionUtilisateur</p>
       <p className="text-xs" style={{color:'rgba(176,196,222,0.7)'}}>Espace admin</p>
        </div>
     </div>

      <div className="px-3 flex flex-col gap-1 flex-1">
      <p className="text-xs uppercase tracking-wider px-3 mb-2" style={{color:'rgba(176,196,222,0.5)'}}>Principal</p>

          <div onClick={() => navigate('/')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition"
            style={{backgroundColor: isActive('/') ? '#B0C4DE' : 'transparent', color: isActive('/') ? '#001F5B' : 'rgba(176,196,222,0.7)'}}
            onMouseEnter={e => { if (!isActive('/')) { e.currentTarget.style.backgroundColor='rgba(176,196,222,0.15)'; e.currentTarget.style.color='#fff'; }}}
            onMouseLeave={e => { if (!isActive('/')) { e.currentTarget.style.backgroundColor='transparent'; e.currentTarget.style.color='rgba(176,196,222,0.7)'; }}}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Tableau de bord
          </div>

          <div onClick={() => navigate('/users')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition"
            style={{backgroundColor: isActive('/users') ? '#B0C4DE' : 'transparent', color: isActive('/users') ? '#001F5B' : 'rgba(176,196,222,0.7)'}}
            onMouseEnter={e => { if (!isActive('/users')) { e.currentTarget.style.backgroundColor='rgba(176,196,222,0.15)'; e.currentTarget.style.color='#fff'; }}}
            onMouseLeave={e => { if (!isActive('/users')) { e.currentTarget.style.backgroundColor='transparent'; e.currentTarget.style.color='rgba(176,196,222,0.7)'; }}}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Utilisateurs
          </div>

          <p className="text-xs uppercase tracking-wider px-3 mt-4 mb-2" style={{color:'rgba(176,196,222,0.5)'}}>Compte</p>

          <div onClick={() => navigate('/profile')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition"
            style={{backgroundColor: isActive('/profile') ? '#B0C4DE' : 'transparent', color: isActive('/profile') ? '#001F5B' : 'rgba(176,196,222,0.7)'}}
            onMouseEnter={e => { if (!isActive('/profile')) { e.currentTarget.style.backgroundColor='rgba(176,196,222,0.15)'; e.currentTarget.style.color='#fff'; }}}
            onMouseLeave={e => { if (!isActive('/profile')) { e.currentTarget.style.backgroundColor='transparent'; e.currentTarget.style.color='rgba(176,196,222,0.7)'; }}}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Mon profil
          </div>

        </div>

        
        <div className="px-3 pt-4" style={{borderTop:'1px solid rgba(255,255,255,0.1)'}}>
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
              style={{backgroundColor:'#B0C4DE', color:'#001F5B'}}
            >
              {adminNom.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-medium text-white">{adminNom}</p>
              <p className="text-xs" style={{color:'rgba(176,196,222,0.6)'}}>{adminEmail}</p>
            </div>
          </div>
          <button
            onClick={() => { 
              localStorage.removeItem('isAuthenticated'); 
              localStorage.removeItem('token');
              localStorage.removeItem('adminEmail');
              localStorage.removeItem('adminNom');
              window.location.href = '/login'; 
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition"
            style={{color:'#ffffff'}}
            onMouseEnter={e => e.currentTarget.style.backgroundColor='rgba(253,164,175,0.1)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor='transparent'}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Deconnexion
          </button>
        </div>
      </div>

      <div className="flex-1 ml-56">
        {children}
      </div>
    </div>
  );
}

export default Layout;