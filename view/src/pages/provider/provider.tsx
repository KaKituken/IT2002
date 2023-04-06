import './provider.css'
import Icon from '../../components/Icon/Icon'
import house1 from "../../assets/house1.png"
import house2 from "../../assets/house2.png"
import house3 from "../../assets/house3.png"
import house4 from "../../assets/house4.png"
import house5 from "../../assets/house5.png"
import house6 from "../../assets/house6.png"
import * as api from "../../service/api"
import Select from 'react-select'
import { useState } from 'react'
import { useAppSelector } from '../../hooks'
import { useNavigate } from 'react-router-dom'

function App(){

    const images = [house1, house2, house3, house4, house5, house6]

    const userToken = useAppSelector((state) => state.userInfoTracker.userToken)
    const navigate = useNavigate()

    const [location, setLocation] = useState<string>('')
    const [houseSize, setHouseSize] = useState<number>()
    const [houseType, setHouseType] = useState<string>('')
    const [houseAge, setHouseAge] = useState<number>()
    const [minPrice, setMinPrice] = useState<number>()
    const [fromDate, setFromDate] = useState<Date>()
    const [toDate, setToDate] = useState<Date>()
    const [description, setDescription] = useState<string>()
    const [biddingPeriod, setBiddingPeriod] = useState<number>()

    const imgs = api.getHouseImages()

    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]

    async function handleUpdateClicked(){
        const param:api.ProviderForm = {
            token: '',
            houseInfo: {}
        }
        param.token = userToken
        param.houseInfo['location'] = location
        param.houseInfo['size'] = houseSize
        param.houseInfo['startDate'] = fromDate
        param.houseInfo['endDate'] = toDate
        param.houseInfo['description'] = description
        param.houseInfo['typeOfHouse'] = houseType
        param.houseInfo['age'] = houseAge
        param.houseInfo['minPrice'] = minPrice
        param.houseInfo['bidPeriod'] = biddingPeriod
        param.houseInfo['images'] = []
        let success = await api.postNewHouse(param)
        if(success.status){
            navigate('/display')
        }
        else{
            window.alert(success.details)
        }
    }

    return(
        <div className="provider-page">
            <Icon color="black"></Icon>
            <h1 id="title">My object</h1>
            <div className="photo-box">
                {images.map((image, index) => (
                    <img key={index} src={image}></img>
                ))}
            </div>
            <div className="provide-form">
                <div className="form-item">
                    <p>Location</p>
                    <input className="form-input" type="number" onChange={e => setLocation(e.target.value)}></input>
                </div>
                <div className="form-item">
                    <p>Size</p>
                    <input className="form-input" type="number" onChange={e => setHouseSize(Number(e.target.value))}></input>
                </div>
                <div className="form-item">
                    <p>Type</p>
                    <input className="form-input" type="text" onChange={e => setHouseType(e.target.value)}></input>
                </div>
                <div className="form-item">
                    <p>Age of house</p>
                    <input className="form-input" type="number" onChange={e => setHouseAge(Number(e.target.value))}></input>
                </div>
                {/* <div className="form-item">
                    <p>Location</p>
                    <input className="form-input" type="string"></input>
                </div> */}
                <div className="form-item">
                    <p>Start date</p>
                    <input className="form-input" type="date" onChange={e => setFromDate(new Date(e.target.value))}></input>
                </div>
                <div className="form-item">
                    <p>End date</p>
                    <input className="form-input" type="date" onChange={e => setToDate(new Date(e.target.value))}></input>
                </div>
                <div className="form-item">
                    <p>Min price</p>
                    <input className="form-input" type="number" onChange={e => setMinPrice(Number(e.target.value))}></input>
                </div>
                <div className="form-item">
                    <p>Bidding period</p>
                    <input className="form-input" type="number" onChange={e => setBiddingPeriod(Number(e.target.value))}></input>
                </div>
                <div className="form-item">
                    <p>Description</p>
                    <input className="form-input" type="text" onChange={e => setDescription(e.target.value)}></input>
                </div>
            </div>
            <button id="submit-btn" onClick={handleUpdateClicked}>Update</button>
            <div className="form-item" id="see-all-bids">
                <p>See all bids</p>
                <Select className="form-input" options={options}
                    styles={{
                        control: (baseStyles, state) => ({
                            ...baseStyles,
                            borderRadius: 10,
                            backgroundColor: "#ECEAEA",
                            border: 0,
                            width: 240,
                            height: 47,
                        }),
                    }} />
            </div>
        </div>
    )
}

export default App