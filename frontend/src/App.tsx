import { Routes, Route, Navigate } from 'react-router-dom';
import Board from './components/Board';
import LoginForm from './components/Login';
import RegisterForm from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';



function App() {
  return (
  
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/board" element={
          <ProtectedRoute>
            <Board />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/board" />} />
        <Route path="*" element={<Navigate to="/board" />} />
      </Routes>
  
  );
}

export default App;