import { NavLink } from "react-router-dom";

const PageNotFound = () => {
    return (
        <>
            <div style={{ display: "flex" }}>

                <div style={{ flex: 1, height: "100vh", display: "grid", placeItems: "center" }}>
                    <h1 style={{}}>404 Page Not Found</h1>
                    <NavLink to="/" style={{textDecoration: "none", color: "blue", fontSize: "2rem"}}>Go To home</NavLink>
                </div>
            </div>
        </>
    );
}

export default PageNotFound;