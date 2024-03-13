import { Link } from "react-router-dom";
import useUser from "./hooks/useUser";
import { auth } from "./index.js";


const NavBar = () => {
  const { user } = useUser();
  const handleLogout = () => {
    auth.signOut();
  }
  return (
    <div>
      <nav>
        <ul>
          { user && (
            <li>
              Hello, {user.email}
            </li>
          )}
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/articles">Articles</Link>
          </li>
          {!user && (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
      <div className="nav-right">
      { user && (
         <Link onClick={handleLogout}>Logout</Link> 
      )}
      </div>
    </div>
  );
}

export default NavBar;