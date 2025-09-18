import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState('usuario@admin.com');
    const [password, setPassword] = useState('usu@ri0Adm1n');
    const [errors, setErrors] = useState({ email: '', password: '', login: '' });

    const auth = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        const emailError = !email ? 'O campo de e-mail é obrigatório' : '';
        const passwordError = !password ? 'O campo de senha é obrigatório' : '';

        setErrors({ email: emailError, password: passwordError, login: '' });

        if (emailError || passwordError) return;

        const successLogin = await auth.login(email, password);

        if (!successLogin) {
            setErrors(prev => ({ ...prev, login: 'E-mail e/ou senha incorretos.' }));

            return;
        }

        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white rounded shadow p-6">
                <div className="mb-4">
                    <h1 className="text-2xl font-medium text-gray-800">Entrar no portal</h1>
                    {errors.login && <p className="text-red-600 text-sm mt-1">{errors.login}</p>}
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label
                            className="block mb-1 font-medium text-gray-600"
                            htmlFor="emailInput"
                        >
                            E-mail
                        </label>
                        <input
                            type="email"
                            id="emailInput"
                            placeholder="Insira seu e-mail"
                            className="w-full p-3 border rounded border-2 border-gray-200 hover:border-orange-500 outline-orange-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label
                            className="block mb-1 font-medium text-gray-600"
                            htmlFor="passwordInput"
                        >
                            Senha
                        </label>
                        <input
                            type="password"
                            id="passwordInput"
                            placeholder="Insira sua senha"
                            className="w-full p-3 border rounded border-2 border-gray-200 hover:border-orange-500 outline-orange-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                    </div>
                    <button
                        className="w-full bg-orange-500 text-white px-6 py-3 rounded cursor-pointer outline-orange-500"
                        onClick={handleLogin}
                    >
                        Entrar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;