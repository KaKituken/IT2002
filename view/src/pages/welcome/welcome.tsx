import './welcome.css'
import Icon from '../../components/Icon/Icon'
import BottomNav from '../../components/BottomNav/BottomNav'
import { useAppSelector, useAppDispatch } from '../../hooks';
import { setValue } from '../../feature/userInfo/userInfoSlice';

function App(){
    const userType = useAppSelector((state) => state.userInfoTracker.value);
    const dispatch = useAppDispatch();

    return (
        <div className="App">
            <Icon color="white"></Icon>
            <p id="title">{userType}</p>
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
            // globalInfo.setType('Provider')
            // console.log(globalInfo.getType())
            dispatch(setValue('Provider'))
            console.log(userType)
            // window.location.href = 'sign-in-provider.html'
        }
        else if(user === 'Renter'){
            // globalInfo.setType('Renter')
            dispatch(setValue('Renter'))
            window.location.href = 'sign-in-provider.html'
        }
        else
            window.location.href = 'display.html'
    }
}

export default App