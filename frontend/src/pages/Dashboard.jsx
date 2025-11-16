import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import Loading from '../components/Loading';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      try {
        const { data } = await axiosClient.get('/me');
        if (mounted) {
          setUserInfo(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          const status = err?.response?.status;
          if (status === 401 || status === 403) {
            setError('Tu sesión expiró o no tienes permisos. Inicia sesión nuevamente.');
          } else {
            setError('No se pudo obtener tu perfil.');
          }
        }
      }
    };

    fetchProfile();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      {!userInfo && !error && <Loading />}
      {userInfo && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Bienvenido, {userInfo.username}</h5>
            <p className="card-text mb-1">
              <strong>Email:</strong> {userInfo.email || 'Sin correo'}
            </p>
            <div>
              <strong>Roles:</strong>
              <ul className="mb-0">
                {userInfo.roles.length > 0 ? (
                  userInfo.roles.map((role) => <li key={role}>{role}</li>)
                ) : (
                  <li>Sin roles asignados</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};

export default Dashboard;
