import { Link } from 'react-router-dom';
import useUserContext from '../context/userContext';
import classes from './Navbar.module.css';

const Navbar = () => {
  const { _id, avatar, logout } = useUserContext();

  return (
    <header className={classes.header}>
      {/* @TODO: Add Eaove Logo */}
      <Link to="/" className={classes['main-nav-link']}>
        Home
      </Link>

      <nav className={classes['main-nav']}>
        <ul className={classes['main-nav-list']}>
          {!_id && (
            <li>
              <Link
                to="/login"
                className={`${classes['main-nav-link']} ${classes['nav-cta']}`}
              >
                Login
              </Link>
            </li>
          )}

          {_id && (
            <>
              <li>
                <Link
                  to="/idea/create/newidea"
                  className={`${classes['main-nav-link']} ${classes['nav-cta']}`}
                >
                  New Idea
                </Link>
              </li>
              <li>
                <Link to="/" className={classes['main-nav-link']} onClick={logout}>
                  Logout
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className={classes['main-nav-link']}>
                  {!avatar ? (
                    'Profile'
                  ) : (
                    <img
                      className={classes.avatar}
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
