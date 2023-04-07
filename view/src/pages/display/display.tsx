import './display.css'
import Icon from '../../components/Icon/Icon'
import InfoCard from '../../components/InfoCard/InfoCard'
import SignUpIcon from '../../components/SignUpIcon/SignUpIcon'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAppSelector } from '../../hooks';
import * as api from '../../service/api'

function App(){

    const navigate = useNavigate()
    const location = useLocation()
    const userType = useAppSelector((state) => state.userInfoTracker.userType)

    const [houseInfoList, setHouseInfoList] = useState<api.SingleHouseInfo[]>([])
    const demoImages =  [
                    'https://fooddl-1307472723.cos.ap-beijing.myqcloud.com/database/house-sample1.jpg',
                    'https://fooddl-1307472723.cos.ap-beijing.myqcloud.com/database/house-sample2.jpg',
                    'https://fooddl-1307472723.cos.ap-beijing.myqcloud.com/database/house-sample3.jpg'
                ]

    useEffect(()=>{
        if(location.state?.houseLis != null){
            console.log('I should display this')
            setHouseInfoList(location.state.houseLis)
        }
        else{
            (async () => {
                let success = await api.getHouseList()
                if(success.status){
                    const updatedHouseInfoList = success.houseInfoList.map((house) => ({
                        ...house,
                        startDate: new Date(house.startDate),
                        endDate: new Date(house.endDate),
                      }));
                    setHouseInfoList(updatedHouseInfoList)
                    console.log(success.houseInfoList)
                }
                else{
                    window.alert(success.details)
                }
            })()
        }
    }, [])

    function handleBidClicked(houseID: number){
        if(userType === 'Guest'){
            window.alert('Please log in first')
            return
        }
        houseInfoList.forEach((houseInfo, index) => {
            if(houseInfo.houseid === houseID){
                navigate('/bid', {state: {houseInfo}})
            }
        })
    }

    function handleSerchClicked(){
        if(userType === 'Guest'){
            window.alert('Please log in first')
            return
        }
        navigate('/search')
    }

    function handleUploadClicked(){
        navigate('/provider')
    }

    return (
        <div className="App">
            <Icon color="black"></Icon>
            <SignUpIcon color='black'></SignUpIcon>
            <div className='btn-container'>
                <button className='btn' id='search-btn' onClick={handleSerchClicked}>search for houses</button>
                <button className='btn' id='add-btn' onClick={handleUploadClicked}>Upload house</button>
            </div>
            <div id="display-box">
                {houseInfoList.map((singleHouseInfo, index) => (
                    <InfoCard id={singleHouseInfo.houseid} 
                    location={singleHouseInfo.location}
                    minPrice={singleHouseInfo.minPrice} 
                    size={singleHouseInfo.size} 
                    sizeType={singleHouseInfo.sizeType} 
                    currentBid={singleHouseInfo.currentBid} 
                    description={singleHouseInfo.description}
                    startDate={singleHouseInfo.startDate}
                    endDate={singleHouseInfo.endDate}
                    images={demoImages}
                    onBidClicked={handleBidClicked}
                    key={singleHouseInfo.houseid}></InfoCard>
                ))}
            </div>
        </div>
    )
}

export default App