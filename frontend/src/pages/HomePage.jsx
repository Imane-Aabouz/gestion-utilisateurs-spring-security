import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../services/userService';
import Layout from '../components/Layout';

function HomePage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllUsers()
      .then(res => setUsers(res.data))
      .finally(() => setLoading(false));
  }, []);

  const totalUsers  = users.length;
  const totalAdmins = users.filter(u => u.role === 'ADMIN').length;
  const totalSimple = users.filter(u => u.role === 'USER').length;
  const adminPct    = totalUsers ? Math.round((totalAdmins / totalUsers) * 100) : 0;
  const userPct     = totalUsers ? Math.round((totalSimple / totalUsers) * 100) : 0;

  const recentUsers = [...users].slice(-5).reverse();

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{borderColor:'#001F5B', borderTopColor:'transparent'}}></div>
      </div>
    </Layout>
  );

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const adminDash = (totalAdmins / totalUsers) * circumference;
  const userDash  = (totalSimple / totalUsers) * circumference;

  return (
    <Layout>
      <div className="flex flex-col overflow-hidden">

        {/* la bar */}
        <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-base font-medium text-slate-800">Tableau de bord</h1>
            <p className="text-xs text-slate-400 mt-0.5">Bienvenue, Admin</p>
          </div>
          
        </div>

        <div className="p-6">

          {/* Cartes stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{backgroundColor:'#EEF2FF'}}>
                <svg className="w-5 h-5" style={{color:'#001F5B'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-medium text-slate-800">{totalUsers}</p>
                <p className="text-xs text-slate-400 mt-0.5">Total utilisateurs</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{backgroundColor:'#EDE9FE'}}>
                <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-medium text-slate-800">{totalAdmins}</p>
                <p className="text-xs text-slate-400 mt-0.5">Administrateurs</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{backgroundColor:'#ECFDF5'}}>
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-medium text-slate-800">{totalSimple}</p>
                <p className="text-xs text-slate-400 mt-0.5">Utilisateurs simples</p>
              </div>
            </div>
          </div>

          {/* Deux colonnes */}
          <div className="grid grid-cols-2 gap-6">

            {/* Colonne gauche — Derniers utilisateurs */}
            <div className="bg-white border border-slate-100 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-700">Derniers ajoutés</p>
                
              </div>
              <div className="flex flex-col gap-3">
                {recentUsers.map(u => (
                  <div key={u.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                        style={{
                          backgroundColor: u.role === 'ADMIN' ? '#EDE9FE' : '#EEF2FF',
                          color: u.role === 'ADMIN' ? '#5B21B6' : '#001F5B'
                        }}
                      >
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-700">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: u.role === 'ADMIN' ? '#EDE9FE' : '#ECFDF5',
                        color: u.role === 'ADMIN' ? '#5B21B6' : '#065F46'
                      }}
                    >
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Graphique */}
            <div className="bg-white border border-slate-100 rounded-xl p-5 flex flex-col">
              <p className="text-sm font-medium text-slate-700 mb-4">Répartition des rôles</p>

              <div className="flex items-center justify-center flex-1 gap-8">
                {/* SVG Donut */}
                <div className="relative">
                  <svg width="140" height="140" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r={radius} fill="none" stroke="#F1F5F9" strokeWidth="16" />
                    {totalUsers > 0 && (
                      <>
                        <circle
                          cx="70" cy="70" r={radius}
                          fill="none" stroke="#001F5B" strokeWidth="16"
                          strokeDasharray={`${adminDash} ${circumference}`}
                          strokeLinecap="round"
                          transform="rotate(-90 70 70)"
                        />
                        <circle
                          cx="70" cy="70" r={radius}
                          fill="none" stroke="#B0C4DE" strokeWidth="16"
                          strokeDasharray={`${userDash} ${circumference}`}
                          strokeDashoffset={-adminDash}
                          strokeLinecap="round"
                          transform="rotate(-90 70 70)"
                        />
                      </>
                    )}
                    <text x="70" y="65" textAnchor="middle" fontSize="18" fontWeight="500" fill="#1e293b">{totalUsers}</text>
                    <text x="70" y="82" textAnchor="middle" fontSize="10" fill="#94a3b8">total</text>
                  </svg>
                </div>

                {/* Légende */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{backgroundColor:'#001F5B'}}></div>
                    <div>
                      <p className="text-xs font-medium text-slate-700">Administrateurs</p>
                      <p className="text-xs text-slate-400">{totalAdmins} — {adminPct}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{backgroundColor:'#B0C4DE'}}></div>
                    <div>
                      <p className="text-xs font-medium text-slate-700">Utilisateurs</p>
                      <p className="text-xs text-slate-400">{totalSimple} — {userPct}%</p>
                    </div>
             </div>
        </div>
       </div>
         </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;