import './sign-in.css'
import Icon from '../../components/Icon/Icon'
import BottomNav from '../../components/BottomNav/BottomNav'
import { useState } from 'react'
import * as api from '../../service/api'
import { useAppSelector, useAppDispatch } from '../../hooks';
import { setValue } from '../../feature/userInfo/userInfoSlice';

function App(){

    const userType = useAppSelector((state) => state.userInfoTracker.value);
    const dispatch = useAppDispatch();

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [age, setAge] = useState(0)
    const [nationality, setNationality] = useState('')
    const [sex, setSex] = useState('')
    const [password, setPassword] = useState('')
    

    return(
        <div className="sign-in-page">
            <Icon color="white"></Icon>
            <h1 id="title">{userType}</h1>
            <div id="sign-in-form">
                <div className="form-side">
                    <div className="info-box">
                        <p>First name</p>
                        <input type="text" 
                               onChange={e => setFirstName(e.target.value)}>
                        </input>
                    </div>
                    <div className="info-box">
                        <p>Last name</p>
                        <input type="text"
                               onChange={e => setLastName(e.target.value)}>
                        </input>
                    </div>
                    <div className="info-box">
                        <p>Email</p>
                        <input type="email"
                               onChange={e => setEmail(e.target.value)}>
                        </input>
                    </div>
                    <div className="info-box">
                        <p>Password</p>
                        <input type="password"
                               onChange={e => setPassword(e.target.value)}>
                        </input>
                    </div>
                </div>
                <div className="form-side">
                    <div className="info-box">
                        <p>Age</p>
                        <input type="number"
                               onChange={e => setAge(Number(e.target.value))}>
                        </input>
                    </div>
                    <div className="info-box">
                        <p>Nationality</p>
                        <input type="text"
                               onChange={e => setNationality(e.target.value)}>
                        </input>
                    </div>
                    <div className="info-box">
                        <p>Sex</p>
                        <input type="text"
                               onChange={e => setSex(e.target.value)}>
                        </input>
                    </div>
                    <div className="info-box"></div>
                </div>
                <div className="submit-button" onClick={handleSignIn}>Sign up</div>
            </div>
            <BottomNav></BottomNav>
        </div>
    )

    async function handleSignIn(){
        let formData:api.SignInForm = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            age: age,
            nationality: nationality,
            sex: sex,
            password: password,
            type: "provider"
        }
        let success = await api.signIn(formData)
        if(success.status === true) {
            window.location.href = 'login'
        }   
        else{
            // jump
            console.log(success.details)
        }
    }
}

export default App