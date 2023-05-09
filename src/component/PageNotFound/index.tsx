import { NavLink } from "react-router-dom";
import page404Image from "../../assets/page404.png";
import { HomeFilled } from "@ant-design/icons";

const PageNotFound = () => {
    return (
        <>
            <div style={{ display: "flex" }}>

                <div style={{ flex: 1, height: "100vh", display: "grid", placeItems: "center" }}>
                    <img alt="404notfound" src={page404Image} style={{ width: "30%", height: "auto", userSelect: "none" }} />
                    <NavLink to="/" style={{ textDecoration: "none", color: "blue", fontSize: "2rem", userSelect: "none" }}>Go To home <HomeFilled /></NavLink>
                </div>
            </div>
        </>
    );
}

export default PageNotFound;