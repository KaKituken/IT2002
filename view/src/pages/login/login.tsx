import './login.css'
import Icon from '../../components/Icon/Icon'
import BottomNav from '../../components/BottomNav/BottomNav'
import * as api from '../../service/api'

function App(){
    return(
        <div className='App'>
            <Icon color='white'></Icon>
            <h1>Login</h1>
            <div id='info-box'>
                <div className='input-box'>
                    <span>Email</span>
                    <input type="text"></input>
                </div>
                <div className='input-box' id='input-password'>
                    <span>Password</span>
                    <input type="password"></input>
                </div>
                <button id='login-btn'>Login</button>
            </div>
        </div>
    )
}

export default App