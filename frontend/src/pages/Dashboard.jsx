import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import Loading from '../components/Loading';

const Dashboard = () => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchHealth = async () => {
      try {
        const { data } = await axiosClient.get('/health');
        if (mounted) {
          setStatus(data);
        }
      } catch (err) {
        if (mounted) {
          setError('Error al obtener el estado del backend');
        }
      }
    };

    fetchHealth();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <h1 className="mb-4">Dashboard (público en Fase 4 será protegido)</h1>
      {!status && !error && <Loading />}
      {status && (
        <pre className="bg-light p-3 rounded border">
          {JSON.stringify(status, null, 2)}
        </pre>
      )}
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Dashboard;
