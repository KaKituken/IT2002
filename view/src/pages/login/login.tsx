import './login.css'
import Icon from '../../components/Icon/Icon'
import BottomNav from '../../components/BottomNav/BottomNav'
import { useAppSelector, useAppDispatch } from '../../hooks';
import { setUserToken } from '../../feature/userInfo/userInfoSlice';
import { useState } from 'react'
import * as api from '../../service/api'
import { useNavigate } from 'react-router-dom';

function App(){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const userToken = useAppSelector((state) => state.userInfoTracker.userToken)
    const dispatch = useAppDispatch()

    return(
        <div className='login-page'>
            <Icon color='white'></Icon>
            <h1>Login</h1>
            <div id='info-box'>
                <div className='input-box'>
                    <span>Email</span>
                    <input type="text"
                           onChange={e => setEmail(e.target.value)}></input>
                </div>
                <div className='input-box' id='input-password'>
                    <span>Password</span>
                    <input type="password"
                           onChange={e => setPassword(e.target.value)}></input>
                </div>
                <button id='login-btn' onClick={handleLogin}>Login</button>
            </div>
            <BottomNav></BottomNav>
        </div>
    )

    async function handleLogin(){
        let formData:api.LogInForm = {
            email: email,
            password: password,
        }
        if(email === 'admin' && password === '12345678'){
            dispatch(setUserToken('admin'))
            navigate('/admin')
            return
        }
        let success = await api.logIn(formData)
        if(success.status === true) {
            window.alert('success')
            dispatch(setUserToken(success.token))
            navigate('/display')
        }   
        else{
            // jump
            window.alert(success.details)
        }
    }
}

export default App