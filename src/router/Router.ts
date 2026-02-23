
import Home from "../Pages/index"
import HomePanel from "../Pages/view/Home"
import RedesSocial from "../Pages/view/Social/RedesSocial"

type JXSComponent =  () => JSX.Element
interface navigate{
    to:string,
    path:string,
    Component: JXSComponent,
    name:string
}

export const routes : navigate[] = [
    {
        to:'session',
        path:'/',
        Component:Home,
        name:'Home'
    },
    {
        to:'panel',
        path:'/panel',
        Component:HomePanel,
        name:'Panel'
    },
    {
        to:'redes',
        path:'/redes-social',
        Component:RedesSocial,
        name:'Redes'
    }
  
]
