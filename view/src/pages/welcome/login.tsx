import './login.css'
import Icon from '../../components/Icon/Icon'
import BottomNav from '../../components/BottomNav/BottomNav'
import { useState } from 'react'
import { UserContext } from '../../GlobalContext'

function App(){

    return (
        <div className="App">
            <Icon color="white"></Icon>
            <p id="title">Sign Up As</p>
            <div id="button-group">
                <button onClick={() => handelOnClick('Provider')}>Provider</button>
                <button onClick={() => handelOnClick('Renter')}>Renter</button>
                <button onClick={() => handelOnClick('Guest')}>Browse As Guest</button>
                <a href='login.html'><u>I have account, log in</u></a>
            </div>
            <BottomNav></BottomNav>
        </div>
    )

    function handelOnClick(user: string){
        if(user === 'Provider')
            window.location.href = 'sign-in-provider.html'
        else if(user === 'Renter')
            window.location.href = 'sign-in-renter.html'
        else
            window.location.href = 'display.html'
    }
}

export default App