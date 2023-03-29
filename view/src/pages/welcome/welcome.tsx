import './welcome.css'
import Icon from '../../components/Icon/Icon'
import BottomNav from '../../components/BottomNav/BottomNav'
import { useAppSelector, useAppDispatch } from '../../hooks';
import { setValue } from '../../feature/userInfo/userInfoSlice';
import { useNavigate } from 'react-router-dom';

function App(){
    const userType = useAppSelector((state) => state.userInfoTracker.value)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    return (
        <div className="welcome-page">
            <Icon color="white"></Icon>
            <p id="title">Sign in as</p>
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
        if(user === 'Provider'){
            dispatch(setValue('Provider'))
            console.log(userType)
            navigate("/sign-in-provider");
        }
        else if(user === 'Renter'){
            dispatch(setValue('Renter'))
            console.log(userType)
            navigate("/sign-in-provider");
        }
        else
            navigate("/sign-in-provider");
    }
}

export default App