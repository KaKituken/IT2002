import './login.css'
import Icon from '../../components/Icon/Icon'
import BottomNav from '../../components/BottomNav/BottomNav'
import { useState } from 'react'
import { UserContext } from '../../GlobalContext'

function App(){

    const [userType, setUserType] = useState('Guest')

    return (
        <div className="App">
            <Icon color="white"></Icon>
            <p id="title">Sign Up As</p>
            <div id="button-group">
                <button onClick={() => handelOnClick('Provider')}>Provider</button>
                <button onClick={() => handelOnClick('Renter')}>Renter</button>
                <button onClick={() => handelOnClick('Guest')}>Guest</button>
            </div>
            <BottomNav></BottomNav>
        </div>
    )

    function handelOnClick(user: string){
        setUserType(user)
        console.log(userType)
    }
}

export default App