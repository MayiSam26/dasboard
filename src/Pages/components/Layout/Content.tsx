interface type  { 
    children: React.ReactNode
}

export default function Content({ children }: type){
    return(<>
        <div className="content-page">
            <div className="content">
                    {children}
            </div>
        </div>
    </>)
}