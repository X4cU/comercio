import { keycloakService } from '../auth/keycloakService';

const Perfil = () => {
  const token = keycloakService.getToken();
  const tokenPreview = token ? `${token.substring(0, 15)}...` : 'No hay token disponible';

  return (
    <div>
      <h1 className="mb-3">Perfil del usuario</h1>
      <p className="text-muted">Esta sección mostrará la información real del usuario en la Fase 4.</p>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Token actual</h5>
          <p className="card-text">{tokenPreview}</p>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
