import './bid.css'
import Icon from '../../components/Icon/Icon'
import PhotoWindow from '../../components/PhotoWindow/PhotoWindow'
import { useNavigate, useLocation } from "react-router-dom";

function App(){

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 
    'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

    const imgs:Array<string> = ['https://fooddl-1307472723.cos.ap-beijing.myqcloud.com/database/house-sample1.jpg',
    'https://fooddl-1307472723.cos.ap-beijing.myqcloud.com/database/house-sample2.jpg',
    'https://fooddl-1307472723.cos.ap-beijing.myqcloud.com/database/house-sample3.jpg']

    const location = useLocation()

    return (
        <div className='App'>
            <Icon color='black'></Icon>
            <div className='big-container'>
                <div className='house-box'>
                    <PhotoWindow images={imgs}></PhotoWindow>
                    <div className='info-box'>
                        <div id='box-head'>
                            <div id='line-head'>
                                <div className='house-name'>{location.state.houseInfo.location}</div>
                                <div className='house-add'>{location.state.houseInfo.houseid}</div>
                            </div>
                            <div className='house-price'>{location.state.houseInfo.minPrice} SGD/month</div>
                        </div>
                        <div id='box-body'>
                            <div id='body-left'>
                                <div id='current-bid'>
                                    <strong>Current bid: </strong><span>{location.state.houseInfo.currentBid} SGD/month</span>
                                </div>
                                <div id='enter-bid'>
                                    <div>Enter new bid</div>
                                    <input type="number"></input>
                                </div>
                                <button id='make-bid-btn'>Make bid</button>
                            </div>
                            <div id='body-right'>
                                <div className='info-item'>
                                    <span className='item-title'>Size</span>
                                    <span className='item-detail'>{location.state.houseInfo.size} m2</span>
                                </div>
                                <div className='info-item'>
                                    <span className='item-title'>Size type</span>
                                    <span className='item-detail'>{location.state.houseInfo.sizeType}</span>
                                </div>
                                <div className='info-item'>
                                    <span className='item-title'>Rental period</span>
                                    <span className='item-detail'>{location.state.houseInfo.startDate.getDate()} {months[location.state.houseInfo.startDate.getMonth()]} {location.state.houseInfo.startDate.getFullYear()} - {location.state.houseInfo.endDate.getDate()} {months[location.state.houseInfo.endDate.getMonth()]} {location.state.houseInfo.endDate.getFullYear()}</span>
                                </div>
                                <div className='info-item'>
                                    <span className='item-title'>Type</span>
                                    <span className='item-detail'>{location.state.houseInfo.houseType}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='provider-info'>
                    <span id='contact-provider'>Contact provider</span>
                    <u>Elisa Tan</u>
                    <div className='provider-photo'>
                        <img src='https://fooddl-1307472723.cos.ap-beijing.myqcloud.com/database/szk.jpeg'></img>
                    </div>
                    <button className='provider-btn' id='provider-phone-number'>Show phone number</button>
                    <button className='provider-btn' id='provider-email'>Show email</button>
                </div>
            </div>
        </div>
    )
}

export default App