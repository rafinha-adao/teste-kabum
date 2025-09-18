import axios from "axios";

export interface CepResponse {
    logradouro?: string;
    bairro?: string;
    localidade?: string;
    estado?: string;
    erro?: boolean;
}

export const getAddressByCep = async (cep: string): Promise<CepResponse | null> => {
    try {
        const cleanedCep = cep.replace(/\D/g, '');

        if (cleanedCep.length !== 8) return null;

        const response = await axios.get<CepResponse>(`https://viacep.com.br/ws/${cleanedCep}/json`);

        if (response.data.erro) return null;

        return response.data;
    } catch (err) {
        return null;
    }
}
