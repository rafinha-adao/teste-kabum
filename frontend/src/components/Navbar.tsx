import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const auth = useAuth();

    return (
        <nav className="bg-white shadow px-6 py-3">
            <div className="w-full max-w-5xl flex justify-between items-center mx-auto">
                <div className="text-xl font-medium text-gray-800">
                    Portal Administrativo
                </div>
                <button
                    onClick={auth.logout}
                    className="bg-gray-50 outline-gray-100 font-medium px-6 py-3 rounded cursor-pointer"
                >
                    Sair
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
