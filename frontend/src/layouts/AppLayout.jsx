import Navbar from '../components/Navbar';

const AppLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="py-4">
        <div className="container">{children}</div>
      </main>
    </div>
  );
};

export default AppLayout;
