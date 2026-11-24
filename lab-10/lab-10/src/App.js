import { createBrowserRouter, RouterProvider, Outlet, Link } from 'react-router-dom';
import Home from './pages/home';
import Lab4 from './pages/lab-4';
import Lab5 from './pages/lab-5';
import './App.css';

const Layout = () => (
  <div className="App">
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/lab_4">lab_4</Link></li>
        <li><Link to="/lab_5">lab_5</Link></li>
      </ul>
    </nav>
    <main>
      <Outlet />
    </main>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'lab_4', element: <Lab4 /> },
      { path: 'lab_5', element: <Lab5 /> },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
