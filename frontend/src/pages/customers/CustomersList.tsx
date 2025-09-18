import { useEffect, useState } from "react";
import { getCustomers, type Customer } from "../../services/customerService";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Customers = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        getCustomers().then(customers => setCustomers(customers));
    }, []);

    const formatDate = (date: string) => {
        if (!date) return '';

        return new Date(date).toLocaleDateString('pt-BR');
    }

    const formatCpf = (cpf: string) => {
        if (!cpf) return '';

        const v = cpf.replace(/\D/g, '');

        if (v.length !== 11) return v;

        return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9)}`;
    }

    const formatRg = (rg: string) => {
        if (!rg) return '';

        const v = rg.replace(/\D/g, '');

        if (v.length <= 8) return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5, 8)}`;

        return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5, 8)}-${v.slice(8)}`;
    }

    const formatPhone = (phone: string) => {
        if (!phone) return '';

        const v = phone.replace(/\D/g, '').slice(-11);

        if (v.length <= 2) return `(${v}`;
        if (v.length <= 7) return `(${v.slice(0, 2)}) ${v.slice(2)}`;

        return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex items-center justify-center p-6">
                <div className="w-full max-w-5xl bg-white rounded shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-medium text-gray-800">Lista de clientes</h1>
                        <Link
                            to="/customers/create"
                            className="bg-orange-500 outline-orange-500 text-white font-medium px-6 py-3 rounded cursor-pointer"
                        >
                            Adicionar cliente
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-4 text-left">ID</th>
                                    <th className="p-4 text-left">Nome</th>
                                    <th className="p-4 text-left">Data de Nascimento</th>
                                    <th className="p-4 text-left">CPF</th>
                                    <th className="p-4 text-left">RG</th>
                                    <th className="p-4 text-left">Telefone</th>
                                    <th className="p-4 text-left">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50">
                                        <td className="p-4 border-t border-gray-200">{customer.id}</td>
                                        <td className="p-4 border-t border-gray-200">{customer.name}</td>
                                        <td className="p-4 border-t border-gray-200">{formatDate(customer.date_of_birth)}</td>
                                        <td className="p-4 border-t border-gray-200">{formatCpf(customer.cpf)}</td>
                                        <td className="p-4 border-t border-gray-200">{formatRg(customer.rg)}</td>
                                        <td className="p-4 border-t border-gray-200">{formatPhone(customer.phone)}</td>
                                        <td className="p-4 border-t border-gray-200 text-center">
                                            <Link
                                                to={`/customers/${customer.id}/edit`}
                                                className="text-orange-500 outline-orange-500 cursor-pointer underline"
                                            >
                                                Editar
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Customers;
