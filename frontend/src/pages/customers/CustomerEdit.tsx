import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getAddressByCep } from "../../services/cepService";
import { createCustomerAddress, deleteCustomer, deleteCustomerAddress, getCostumerById, updateCustomer, updateCustomerAddress, type Address } from "../../services/customerService";

const CustomerEdit = () => {
    const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [cpf, setCpf] = useState('');
    const [rg, setRg] = useState('');
    const [phone, setPhone] = useState('');
    const [addresses, setAddresses] = useState<Address[]>([{ id: '', customer_id: '', street: '', number: '', district: '', city: '', state: '', zip_code: '' }]);
    const [errors, setErrors] = useState({ name: '', dateOfBirth: '', cpf: '', rg: '', phone: '', addresses: [] as string[] });

    const navigate = useNavigate();

    const maskCpf = (cpf: string) => {
        const v = cpf.replace(/\D/g, '').slice(0, 11);

        if (!v) return '';
        if (v.length <= 3) return v;
        if (v.length <= 6) return `${v.slice(0, 3)}.${v.slice(3)}`;
        if (v.length <= 9) return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6)}`;

        return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9)}`;
    }

    const maskRg = (rg: string) => {
        const v = rg.replace(/\D/g, '').slice(0, 9);

        if (!v) return '';

        const part1 = v.slice(0, 2);
        const part2 = v.slice(2, 5);
        const part3 = v.slice(5, 8);
        const part4 = v.slice(8);

        return [part1, part2, part3].filter(Boolean).join('.') + (part4 ? `-${part4}` : '');
    }

    const maskPhone = (phone: string) => {
        const v = phone.replace(/\D/g, '').slice(0, 11);

        if (!v) return '';
        if (v.length <= 2) return `(${v}`;
        if (v.length <= 7) return `(${v.slice(0, 2)}) ${v.slice(2)}`;

        return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    }

    const maskCep = (cep: string) => {
        const v = cep.replace(/\D/g, '').slice(0, 8);

        if (!v) return '';
        if (v.length <= 5) return v;

        return `${v.slice(0, 5)}-${v.slice(5)}`;
    }

    const unmask = (value: string) => {
        return value.replace(/\D/g, '');
    }

    const updateAddressField = (index: number, field: keyof Address, value: string) => {
        const copy = [...addresses];
        copy[index][field] = value;

        setAddresses(copy);
    }

    const handleZipChange = async (index: number, zip: string) => {
        updateAddressField(index, 'zip_code', zip);

        const address = await getAddressByCep(zip);

        if (address) {
            updateAddressField(index, 'street', address.logradouro || '');
            updateAddressField(index, 'district', address.bairro || '');
            updateAddressField(index, 'city', address.localidade || '');
            updateAddressField(index, 'state', address.estado || '');
        }
    }

    const addAddress = () => {
        setAddresses([...addresses, { id: '', customer_id: '', street: '', number: '', district: '', city: '', state: '', zip_code: '' }]);
    }

    const removeAddress = async (index: number) => {
        const address = addresses[index];

        if (addresses.length === 1) {
            return;
        }

        if (address.id && confirm('Tem certeza que deseja excluir este endereço?')) {
            try {
                await deleteCustomerAddress(address.id);
            } catch (err) {
                alert('Erro ao excluir endereço: ' + err);
            }
        }

        setAddresses(prev => prev.filter((_, i) => i !== index));
    }

    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (!id) return;
        const fetchCustomer = async () => {
            const customer = await getCostumerById(id);

            setName(customer.name);
            setDateOfBirth(customer.date_of_birth);
            setCpf(maskCpf(customer.cpf));
            setRg(maskRg(customer.rg));
            setPhone(maskPhone(customer.phone));

            setAddresses(customer.addresses || [{ id: '', customer_id: '', street: '', number: '', district: '', city: '', state: '', zip_code: '' }]);
        }

        fetchCustomer();
    }, [id]);

    const handleUpdate = async () => {
        setErrors({ name: '', dateOfBirth: '', cpf: '', rg: '', phone: '', addresses: [] });

        let hasError = false;
        const addressErrors: string[] = [];

        if (!name) {
            setErrors(prev => ({ ...prev, name: 'Nome é obrigatório' }));
            hasError = true;
        }

        if (!dateOfBirth) {
            setErrors(prev => ({ ...prev, dateOfBirth: 'Data de nascimento é obrigatória' }));
            hasError = true;
        }

        if (!cpf) {
            setErrors(prev => ({ ...prev, cpf: 'CPF é obrigatório' }));
            hasError = true;
        }

        if (!rg) {
            setErrors(prev => ({ ...prev, rg: 'RG é obrigatório' }));
            hasError = true;
        }

        if (!phone) {
            setErrors(prev => ({ ...prev, phone: 'Telefone é obrigatório' }));
            hasError = true;
        }

        addresses.forEach((address, i) => {
            if (!address.zip_code || !address.street || !address.number || !address.district || !address.city || !address.state) {
                addressErrors[i] = 'Preencha todos os campos do endereço';
                hasError = true;
            } else {
                addressErrors[i] = '';
            }
        });

        setErrors(prev => ({ ...prev, addresses: addressErrors }));

        if (hasError) return;

        try {
            await updateCustomer(id!, {
                name,
                date_of_birth: dateOfBirth,
                cpf: unmask(cpf),
                rg: unmask(rg),
                phone: unmask(phone),
            });

            await Promise.all(addresses.map(async (address) => {
                if (address.id) {
                    return updateCustomerAddress(address.id, {
                        zip_code: unmask(address.zip_code),
                        street: address.street,
                        number: address.number,
                        district: address.district,
                        city: address.city,
                        state: address.state,
                    });
                } else {
                    return createCustomerAddress({
                        customer_id: id,
                        zip_code: unmask(address.zip_code),
                        street: address.street,
                        number: address.number,
                        district: address.district,
                        city: address.city,
                        state: address.state,
                    });
                }
            }));

            alert('Cliente atualizado com sucesso!');

            navigate('/customers');
        } catch (err) {
            alert('Erro ao atualizar cliente: ' + err);
        }
    }

    const handleDelete = async () => {
        if (confirm('Tem certeza que deseja excluir este cliente?')) {
            try {
                await deleteCustomer(id!);

                alert('Cliente excluído com sucesso!');

                navigate('/customers');
            } catch (err) {
                alert('Erro ao excluir cliente: ' + err);
            }
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex justify-center p-6">
                <div className="w-full max-w-5xl bg-white rounded shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-medium text-gray-800 mb-6">Editar cliente</h1>
                        <button
                            onClick={handleDelete}
                            className="bg-orange-500 outline-orange-500 text-white font-medium px-6 py-3 rounded cursor-pointer"
                        >
                            Excluir cliente
                        </button>
                    </div>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                className="block mb-1 font-medium text-gray-600"
                                htmlFor="nameInput"
                            >
                                Nome
                            </label>
                            <input
                                type="text"
                                id="nameInput"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nome completo"
                                className="w-full p-3 border rounded border-2 border-gray-200 hover:border-orange-500 outline-orange-500"
                            />
                            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label
                                className="block mb-1 font-medium text-gray-600"
                                htmlFor="dateOfBirthInput"
                            >
                                Data
                                de Nascimento</label>
                            <input
                                type="date"
                                id="dateOfBirthInput"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                className="w-full p-3 border rounded border-2 border-gray-200 hover:border-orange-500 outline-orange-500"
                            />
                            {errors.dateOfBirth && <p className="text-red-600 text-sm mt-1">{errors.dateOfBirth}</p>}
                        </div>
                        <div>
                            <label
                                className="block mb-1 font-medium text-gray-600"
                                htmlFor="cpfInput"
                            >
                                CPF
                            </label>
                            <input
                                type="text"
                                id="cpfInput"
                                value={cpf}
                                onChange={(e) => setCpf(maskCpf(e.target.value))}
                                placeholder="000.000.000-00"
                                className="w-full p-3 border rounded border-2 border-gray-200 hover:border-orange-500 outline-orange-500"
                            />
                            {errors.cpf && <p className="text-red-600 text-sm mt-1">{errors.cpf}</p>}
                        </div>
                        <div>
                            <label
                                className="block mb-1 font-medium text-gray-600"
                                htmlFor="rgInput"
                            >
                                RG
                            </label>
                            <input
                                type="text"
                                id="rgInput"
                                value={rg}
                                onChange={(e) => setRg(maskRg(e.target.value))}
                                placeholder="00.000.000-0"
                                className="w-full p-3 border rounded border-2 border-gray-200 hover:border-orange-500 outline-orange-500"
                            />
                            {errors.rg && <p className="text-red-600 text-sm mt-1">{errors.rg}</p>}
                        </div>
                        <div>
                            <label
                                className="block mb-1 font-medium text-gray-600"
                                htmlFor="phoneInput"
                            >
                                Telefone
                            </label>
                            <input
                                type="text"
                                id="phoneInput"
                                value={phone}
                                onChange={(e) => setPhone(maskPhone(e.target.value))}
                                placeholder="(00) 00000-0000"
                                className="w-full p-3 border rounded border-2 border-gray-200 hover:border-orange-500 outline-orange-500"
                            />
                            {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                        </div>
                    </form>
                    <div className="mt-6">
                        <h2 className="text-xl font-medium text-gray-800 mt-6 mb-4">Endereço(s)</h2>
                        {addresses.map((addr, i) => (
                            <div key={i} className="border border-gray-200 rounded p-6 mb-4 relative">
                                {addresses.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeAddress(i)}
                                        className="absolute top-4 right-6 text-orange-500 text-sm underline cursor-pointer"
                                    >
                                        Excluir
                                    </button>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            className="block mb-1 font-medium text-gray-600"
                                            htmlFor={`zip${i}`}
                                        >
                                            CEP
                                        </label>
                                        <input
                                            type="text"
                                            id={`zip${i}`}
                                            value={maskCep(addr.zip_code)}
                                            onChange={(e) => handleZipChange(i, e.target.value)}
                                            placeholder="Insira o CEP"
                                            className="w-full p-3 border rounded border-2 border-gray-200 hover:border-orange-500 outline-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="block mb-1 font-medium text-gray-600"
                                            htmlFor={`street${i}`}
                                        >
                                            Rua
                                        </label>
                                        <input
                                            type="text"
                                            id={`street${i}`}
                                            value={addr.street}
                                            onChange={(e) => updateAddressField(i, 'street', e.target.value)}
                                            placeholder="Insira a rua"
                                            className="w-full p-3 border rounded border-2 border-gray-200 hover:border-orange-500 outline-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="block mb-1 font-medium text-gray-600"
                                            htmlFor={`number${i}`}
                                        >
                                            Número
                                        </label>
                                        <input
                                            type="text"
                                            id={`number${i}`}
                                            value={addr.number}
                                            onChange={(e) => updateAddressField(i, 'number', e.target.value)}
                                            placeholder="Insira o número"
                                            className="w-full p-3 border rounded border-2 border-gray-200 hover:border-orange-500 outline-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="block mb-1 font-medium text-gray-600"
                                            htmlFor={`district${i}`}
                                        >
                                            Bairro
                                        </label>
                                        <input
                                            type="text"
                                            id={`district${i}`}
                                            value={addr.district}
                                            onChange={(e) => updateAddressField(i, 'district', e.target.value)}
                                            placeholder="Insira o bairro"
                                            className="w-full p-3 border rounded border-2 border-gray-200 hover:border-orange-500 outline-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="block mb-1 font-medium text-gray-600"
                                            htmlFor={`city${i}`}
                                        >
                                            Cidade
                                        </label>
                                        <input
                                            type="text"
                                            id={`city${i}`}
                                            value={addr.city}
                                            onChange={(e) => updateAddressField(i, 'city', e.target.value)}
                                            placeholder="Insira a cidade"
                                            className="w-full p-3 border rounded border-2 border-gray-200 hover:border-orange-500 outline-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="block mb-1 font-medium text-gray-600"
                                            htmlFor={`state${i}`}
                                        >
                                            Estado
                                        </label>
                                        <input
                                            type="text"
                                            id={`state${i}`}
                                            value={addr.state}
                                            onChange={(e) => updateAddressField(i, 'state', e.target.value)}
                                            placeholder="Insira o estado"
                                            className="w-full p-3 border rounded border-2 border-gray-200 hover:border-orange-500 outline-orange-500"
                                        />
                                    </div>
                                </div>
                                {errors.addresses[i] && <p className="text-red-600 text-sm mt-1">{errors.addresses[i]}</p>}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addAddress}
                            className="bg-orange-500 text-white font-medium px-6 py-3 rounded cursor-pointer mb-4"
                        >
                            Adicionar novo endereço
                        </button>
                    </div>
                    <div className="flex gap-4 justify-end">
                        <Link
                            to="/customers"
                            className="bg-gray-50 outline-gray-50 font-medium px-6 py-3 rounded cursor-pointer"
                        >
                            Voltar
                        </Link>
                        <button
                            type="button"
                            onClick={handleUpdate}
                            className="bg-orange-500 outline-orange-500 text-white font-medium px-6 py-3 rounded cursor-pointer"
                        >
                            Editar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomerEdit;