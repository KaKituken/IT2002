import './login.css'
import Icon from '../../components/Icon/Icon'
import BottomNav from '../../components/BottomNav/BottomNav'
import { useAppSelector, useAppDispatch } from '../../hooks';
import { setUserToken, setUserType } from '../../feature/userInfo/userInfoSlice';
import { useState } from 'react'
import * as api from '../../service/api'
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'

function App(){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userTypeChoosed, setUserTypeChoosed] = useState()
    const navigate = useNavigate()
    const userToken = useAppSelector((state) => state.userInfoTracker.userToken)
    const dispatch = useAppDispatch()

    function handleUserTypeChoose(option:any){
        setUserTypeChoosed(option.value)
    }

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
                <div className='input-box' id='input-user-type'>
                    <span> Log In As </span>
                    <Select options={[{value: 'provider', label: 'provider'}, {value: 'renter', label: 'renter'}]}
                    styles={{
                        control: (baseStyles, state) => ({
                            ...baseStyles,
                            borderRadius: 20,
                            backgroundColor: "#FFFFFF",
                            border: 0,
                            width: '100%',
                            height: '36px',
                        }),
                    }} 
                    onChange={(option) => handleUserTypeChoose(option)}></Select>
                </div>
                <button id='login-btn' onClick={handleLogin}>Login</button>
            </div>
            <BottomNav></BottomNav>
        </div>
    )

    async function handleLogin(){
        if(email === 'admin' && password === '12345678'){
            dispatch(setUserToken('admin'))
            navigate('/admin')
            return
        }
        if(userTypeChoosed){
            const formData:api.LogInForm = {
                email: email,
                password: password,
                userType: userTypeChoosed
            }
            let success = await api.logIn(formData)
            if(success.status === true) {
                window.alert('success')
                dispatch(setUserToken(success.token))
                dispatch(setUserType(success.userType))
                navigate('/display')
            }   
            else{
                // jump
                window.alert(success.details)
            }
        }
        else{
            window.alert('Choose a user type!')
        }
    }
}

export default App