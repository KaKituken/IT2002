import './sign-in.css'
import Icon from '../../components/Icon/Icon'
import BottomNav from '../../components/BottomNav/BottomNav'
import { useContext, useState } from 'react'
import { UserContext } from '../../GlobalContext'
import * as api from '../../service/api'

function App(){

    const {userType, setUserType} = useContext(UserContext)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [age, setAge] = useState(0)
    const [nationality, setNationality] = useState('')
    const [sex, setSex] = useState('')
    

    return(
        <div className="App">
            <Icon color="white"></Icon>
            <h1 id="title">{userType}</h1>
            <div id="sign-in-form">
                <div className="form-side">
                    <div className="info-box">
                        <p>First name</p>
                        <input type="text" 
                               value={firstName}
                               onChange={e => setFirstName(e.target.value)}>
                        </input>
                    </div>
                    <div className="info-box">
                        <p>Last name</p>
                        <input type="text"
                               value={lastName}
                               onChange={e => setLastName(e.target.value)}>
                        </input>
                    </div>
                    <div className="info-box">
                        <p>Email</p>
                        <input type="email"
                               value={email}
                               onChange={e => setEmail(e.target.value)}>
                        </input>
                    </div>
                </div>
                <div className="form-side">
                    <div className="info-box">
                        <p>Age</p>
                        <input type="number"
                               value={age}
                               onChange={e => setAge(Number(e.target.value))}>
                        </input>
                    </div>
                    <div className="info-box">
                        <p>Nationality</p>
                        <input type="text"
                               value={nationality}
                               onChange={e => setNationality(e.target.value)}>
                        </input>
                    </div>
                    <div className="info-box">
                        <p>Sex</p>
                        <input type="text"
                               value={sex}
                               onChange={e => setSex(e.target.value)}>
                        </input>
                    </div>
                </div>
                <div className="submit-button" onClick={handleSignIn}>Sign up</div>
            </div>
            <BottomNav></BottomNav>
        </div>
    )

    function handleSignIn(){
        let formData:api.SignInForm = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            age: age,
            nationality: nationality,
            sex: sex
        }
        let success = api.signIn(formData)
        if(!success) {
            return
        }
        else{
            // jump
        }
    }
}

export default App