import { api } from "./api";

export interface Customer {
    id: string;
    name: string;
    date_of_birth: string;
    cpf: string;
    rg: string;
    phone: string;
    addresses?: Address[];
}

export interface Address {
    id: string;
    customer_id?: string;
    zip_code: string;
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
}

export const getCustomers = async () => {
    const response = await api.get<Customer[]>('/customers');

    return response.data;
}

export const getCostumerById = async (id: string) => {
    const response = await api.get<Customer>(`/customers/${id}`);

    return response.data;
}

export const createCustomer = async (customer: Omit<Customer, 'id'>) => {
    const response = await api.post('/customers', customer);

    return response.data;
}

export const createCustomerAddress = async (address: Omit<Address, 'id'>) => {
    const response = await api.post('/addresses', address);

    return response.data;
}

export const updateCustomer = async (id: string, customer: Partial<Customer>) => {
    const response = await api.put(`/customers/${id}`, customer);

    return response.data;
}

export const updateCustomerAddress = async (id: string, address: Partial<Omit<Address, 'id' | 'customer_id'>>) => {
    const response = await api.put(`/addresses/${id}`, address);

    return response.data;
}

export const deleteCustomer = async (id: string) => {
    const response = await api.delete(`/customers/${id}`);

    return response.data;
}

export const deleteCustomerAddress = async (id: string) => {
    const response = await api.delete(`/addresses/${id}`);

    return response.data;
}