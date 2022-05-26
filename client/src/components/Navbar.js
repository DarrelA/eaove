import { Link } from 'react-router-dom';
import useUserContext from '../context/userContext';

const Navbar = () => {
  const { _id, avatar, logout } = useUserContext();

  return (
    <header className="header">
      {/* @TODO: Add Eaove Logo */}

      <nav className="main-nav">
        <ul className="main-nav-list">
          {!_id && (
            <li>
              <Link to="/login" className="main-nav-link nav-cta">
                Login
              </Link>
            </li>
          )}

          {_id && (
            <>
              <li>
                <Link to="/" className="main-nav-link" onClick={logout}>
                  Logout
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className={!avatar ? 'main-nav-link nav-cta' : 'main-nav-link '}
                >
                  {!avatar ? (
                    'Profile'
                  ) : (
                    <img
                      className="avatar"
                      src={`/api/user/images/${avatar}`}
                      alt="profile"
                    />
                  )}
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
