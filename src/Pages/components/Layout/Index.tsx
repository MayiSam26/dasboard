import React from "react";
interface type  { 
                 children: React.ReactNode
}
export default function Layout({ children }: type) {
    return(
        <>
         <div className="wrapper"> 
            {children}
         </div>
        </>
    )
}