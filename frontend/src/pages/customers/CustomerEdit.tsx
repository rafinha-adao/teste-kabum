import { useParams } from "react-router-dom";

const CustomerEdit = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <>
            <h1>Editar cliente {id}</h1>
        </>
    );
};

export default CustomerEdit;