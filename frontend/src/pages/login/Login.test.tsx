import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Login from "./Login";

const mockLogin = vi.fn() as (email: string, password: string) => Promise<boolean>;

vi.mock("../../context/AuthContext", () => ({
    useAuth: () => ({
        login: mockLogin
    }),
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

const renderLogin = () => render(
    <BrowserRouter>
        <Login />
    </BrowserRouter>
);

describe("Login Component", () => {
    it("renderiza campos e botão", () => {
        renderLogin();

        expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Entrar/i })).toBeInTheDocument();
    });

    it("valida campos vazios", async () => {
        renderLogin();

        fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: "" } });
        fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: "" } });

        fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

        expect(await screen.findByText(/O campo de e-mail é obrigatório/i)).toBeInTheDocument();
        expect(await screen.findByText(/O campo de senha é obrigatório/i)).toBeInTheDocument();
    });

    it("exibe erro quando login falha e navega quando sucesso", async () => {
        renderLogin();

        mockLogin.mockResolvedValueOnce(false);

        fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: "usuario@admin.com" } });
        fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: "senha_errada" } });

        fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

        expect(await screen.findByText(/E-mail e\/ou senha incorretos/i)).toBeInTheDocument();

        mockLogin.mockResolvedValueOnce(true);

        fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: "usu@ri0Adm1n" } });

        await fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

        expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
});