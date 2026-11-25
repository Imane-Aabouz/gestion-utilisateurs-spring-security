import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, deleteUser } from '../services/userService';
import ConfirmDialog from '../components/ConfirmDialog';
import Layout from '../components/Layout';

const ITEMS_PER_PAGE = 6;

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('TOUS');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    getAllUsers()
      .then(res => setUsers(res.data))
      .finally(() => setLoading(false));
  }, []);

  const onDeleteClick = (id) => { setSelectedId(id); setShowConfirmDialog(true); };

  const onConfirmDelete = () => {
    deleteUser(selectedId).then(() => {
      setUsers(users.filter(u => u.id !== selectedId));
      setShowConfirmDialog(false);
    });
  };

  const filtered = users
    .filter(u => filterRole === 'TOUS' || u.role === filterRole)
    .filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
          style={{borderColor:'#001F5B', borderTopColor:'transparent'}}></div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">

        <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-base font-medium text-slate-800">Utilisateurs</h1>
            <p className="text-xs text-slate-400 mt-0.5">Liste complete des utilisateurs</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Rechercher..."
                className="bg-transparent text-xs text-slate-600 outline-none w-36 placeholder-slate-400"
              />
            </div>
            <button
              onClick={() => navigate('/add')}
              className="flex items-center gap-2 text-white text-xs font-medium px-4 py-2 rounded-lg transition"
              style={{backgroundColor:'#001F5B'}}
              onMouseEnter={e => e.currentTarget.style.backgroundColor='#002a7a'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor='#001F5B'}
            >
              <span className="text-sm leading-none">+</span> Nouvel utilisateur
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-4">
            {['TOUS', 'ADMIN', 'USER'].map(role => (
              <button
                key={role}
                onClick={() => { setFilterRole(role); setCurrentPage(1); }}
                className="text-xs font-medium px-4 py-1.5 rounded-full transition"
                style={{
                  backgroundColor: filterRole === role ? '#001F5B' : '#F1F5F9',
                  color: filterRole === role ? '#fff' : '#64748b'
                }}
              >
                {role}
              </button>
            ))}
            <span className="ml-auto text-xs text-slate-400 self-center">
              {filtered.length} utilisateur{filtered.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Nom</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-xs text-slate-400">Aucun utilisateur trouve</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                            style={{
                              backgroundColor: u.role === 'ADMIN' ? '#EDE9FE' : '#EEF2FF',
                              color: u.role === 'ADMIN' ? '#5B21B6' : '#001F5B'
                            }}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-700 text-xs">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-500">{u.email}</td>
                      <td className="px-5 py-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: u.role === 'ADMIN' ? '#EDE9FE' : '#ECFDF5',
                            color: u.role === 'ADMIN' ? '#5B21B6' : '#065F46'
                          }}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              sessionStorage.setItem('editUser', JSON.stringify(u));
                              navigate(`/edit/${u.id}`);
                            }}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg transition"
                            style={{backgroundColor:'#EEF2FF', color:'#001F5B'}}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor='#B0C4DE'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor='#EEF2FF'}
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => onDeleteClick(u.id)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-500 text-xs font-medium px-3 py-1.5 rounded-lg transition"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
                <p className="text-xs text-slate-400">Page {currentPage} sur {totalPages}</p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50 transition"
                  >
                    Precedent
                  </button>
                  {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className="text-xs px-3 py-1.5 rounded-lg border transition"
                      style={{
                        backgroundColor: currentPage === page ? '#001F5B' : 'transparent',
                        borderColor: currentPage === page ? '#001F5B' : '#e2e8f0',
                        color: currentPage === page ? '#fff' : '#64748b'
                      }}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50 transition"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {showConfirmDialog && (
          <ConfirmDialog
            message="Voulez-vous vraiment supprimer cet utilisateur ?"
            onConfirm={onConfirmDelete}
            onCancel={() => setShowConfirmDialog(false)}
          />
        )}
      </div>
    </Layout>
  );
}

export default UsersPage;