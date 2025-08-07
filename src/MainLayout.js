import HeaderBar from './HeaderBar';
import Nav from './Nav';

const MainLayout = ({ children }) => (
  <>
    <HeaderBar />
    {children}
    <Nav />
  </>
);

export default MainLayout;