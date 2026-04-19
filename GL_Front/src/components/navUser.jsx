import { NavLink} from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";

export const Navbar = () => {
  const { keycloak } = useKeycloak();

  return (
    <nav className="bg-gray-900 h-20 text-white px-6 py-4 flex justify-between items-center shadow-md ">
      
      {/* Left side */}
      <div className="text-xl font-bold">
        Admin Panel
      </div>

      {/* Center links */}
      <div className="flex space-x-6">

        <NavLink
          to="/users/Dashboard"
          className={({ isActive }) =>
              `p-3 rounded-lg transition ${
                isActive
                  ? "text-blue-400"
                  : "hover:text-blue-600"
              }`
            }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/users/add-user"
          className={({ isActive }) =>
              `p-3 rounded-lg transition ${
                isActive
                  ? "text-blue-400"
                  : "hover:text-blue-800"
              }`
            }
        >
          Add User
        </NavLink>

        <NavLink
          to="/users/delete-user"
          className={({ isActive }) =>
              `p-3 rounded-lg transition ${
                isActive
                  ? "text-blue-400"
                  : "hover:text-blue-800"
              }`
            }
        >
          Delete User
        </NavLink>
      </div>

      {/* Right side */}
      <button
        onClick={() => keycloak.logout()}
        className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-md transition"
      >
        Logout
      </button>

    </nav>
  );
};