import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center py-5">
      <h1 className="display-5">404</h1>
      <p className="lead">Página no encontrada</p>
      <Link to="/dashboard" className="btn btn-primary">
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;
