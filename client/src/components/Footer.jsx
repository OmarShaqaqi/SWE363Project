import React from "react";


function Footer(){


    const d = new Date().getFullYear();

    return(
        <footer className="footer">
            <p>Copyright© {d}</p>
        </footer>
    );
}


export default Footer;