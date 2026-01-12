import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/login"); 
  };

  return (
    <div className="h-14 bg-gray-800 text-white flex justify-between px-4 items-center">
      <h1 className="font-semibold">SaaS Dashboard</h1>
      <div>
        {auth?.user?.name}
        <button onClick={logout} className="ml-4 text-red-400">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;

