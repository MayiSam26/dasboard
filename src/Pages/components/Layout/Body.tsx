interface type  { 
    children: React.ReactNode
}

export default function Body({ children }: type){
    return(
        <>
        <div className="container-fluid mt-2">
            <div className="row">
                <div className="col-12">
                        <div className="card" style={{paddingBottom:'20px'}}>
                            <div className="card-body">
                                {children}
                            </div>
                        </div>
                </div>
            </div>
        </div>
        </>
    )
}