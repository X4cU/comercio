const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="auth-card shadow-sm p-4 bg-white rounded w-100" style={{ maxWidth: '420px' }}>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
