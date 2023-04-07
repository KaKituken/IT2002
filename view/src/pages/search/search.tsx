import './search.css'
import Icon from '../../components/Icon/Icon'
import { useState } from 'react'
import { useAppSelector } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import * as api from '../../service/api'

function App(){

    const typeList = ['condo', 'HDB', 'private house']
    const navigate = useNavigate()
    const userToken = useAppSelector((state) => state.userInfoTracker.userToken)

    const [location, setLocation] = useState<string>()
    const [houseTypeList, setHouseTypeList] = useState<boolean[]>(Array(3).fill(false))
    const [houseSize, setHouseSize] = useState<number>()
    const [maxPrice, setMaxPrice] = useState<number>()
    const [fromDate, setFromDate] = useState<Date>()
    const [toDate, setToDate] = useState<Date>()

    function handleTypeChoose(index:number){
        const newHouseTypeList = [...houseTypeList]
        newHouseTypeList[index] = !newHouseTypeList[index]
        setHouseTypeList(newHouseTypeList)
    }

    async function handleSearchClicked(){
        const param:api.FilterHousesCondition = {
            token: '',
            houseinfo: {}
        }
        param.token = userToken
        const typeChoosed:string[] = []
        houseTypeList.forEach((ele, index) => {
            if(ele){
                typeChoosed.push(typeList[index])
            }
        })
        param.houseinfo['location'] = location
        param.houseinfo['type'] = typeChoosed
        param.houseinfo['maxPrice'] = maxPrice
        param.houseinfo['size'] = houseSize
        param.houseinfo['startDate'] = fromDate
        param.houseinfo['endDate'] = toDate
        let success = await api.postFilterHouses(param)
        if(success.status){
            const houseList = success.houseInfoList
            navigate('/display', {state: {houseList}})
        }
        else{
            window.alert(success.details)
        }
    }
    

    return(
        <div className="search-page">
            <Icon color="white"></Icon>
            <div className='wood-box'>
                <div className='search-box'>
                    <div className='input-box' id='location'>
                        <span>Location</span>
                        <input placeholder='Enter desired location' type='text' onChange={e => setLocation(e.target.value)}></input>
                    </div>
                    <div className='type-tag-box'>
                        <div className='type-tag' onClick={()=>handleTypeChoose(0)}>condo</div>
                        <div className='type-tag' onClick={()=>handleTypeChoose(1)}>HDB</div>
                        <div className='type-tag' onClick={()=>handleTypeChoose(2)}>private house</div>
                    </div>
                    <div className='detail-info-box'>
                        <div className='input-box' id='size'>
                            <span>Size</span>
                            <input type='number' onChange={e => setHouseSize(Number(e.target.value))}></input>
                        </div>
                        <div className='input-box' id='max-price'>
                            <span>Max price</span>
                            <input type='number' onChange={e => setMaxPrice(Number(e.target.value))}></input>
                        </div>
                        <div className='input-box' id='from-time'>
                            <span>From</span>
                            <input type='date' onChange={e => setFromDate(new Date(e.target.value))}></input>
                        </div>
                        <div className='input-box' id='to-time'>
                            <span>To</span>
                            <input type='date' onChange={e => setToDate(new Date(e.target.value))}></input>
                        </div>
                        <div className='input-box'></div>
                    </div>
                    <button id='search-btn' onClick={handleSearchClicked}>Search</button>
                </div>
            </div>
        </div>
    )
}

export default App