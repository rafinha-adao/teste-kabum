import { useParams } from "react-router-dom";

const UserEdit = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <>
            <h1>Editar usuário {id}</h1>
        </>
    );
};

export default UserEdit;