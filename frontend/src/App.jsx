import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import UsersPage from './pages/UsersPage';
import AddUserPage from './pages/AddUserPage';
import EditUserPage from './pages/EditUserPage';
import ProfilePage from './pages/ProfilePage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/"         element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/users"    element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
        <Route path="/add"      element={<ProtectedRoute><AddUserPage /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><EditUserPage /></ProtectedRoute>} />
        <Route path="/profile"  element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

