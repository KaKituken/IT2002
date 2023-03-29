import './SignUpIcon.css'
import { useAppSelector } from '../../hooks';
import { useNavigate } from 'react-router-dom';

interface SignUpIconProp {
    color: string
}

function SignUpIcon(props: SignUpIconProp){

    const userType = useAppSelector((state) => state.userInfoTracker.userType)
    const navigate = useNavigate()

    if(userType !== "Guest"){
        return null
    }
    else{
        return(
            <p id="sign-up-icon" className={props.color} onClick={handelSignUp}>Sign Up</p>
        )
    }

    function handelSignUp(){
        navigate('/')
    }
}

export default SignUpIcon