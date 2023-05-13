import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import Header from "../Header/Header";

const Summary = () => {

    const auth: any = useAuth();
    const params: any = useParams();

    useEffect(() => {
        auth.setBotInContext(params.botId);
    }, [])

    return (
        <>

            <Header> <span>Bot Summary</span> </Header>

            <h1>Bot Summary</h1>
        </>
    );
}

export default Summary;