import './bid.css'
import Icon from '../../components/Icon/Icon'
import PhotoWindow from '../../components/PhotoWindow/PhotoWindow'

function App(){

    const imgs:Array<string> = ['https://fooddl-1307472723.cos.ap-beijing.myqcloud.com/database/house-sample1.jpg',
    'https://fooddl-1307472723.cos.ap-beijing.myqcloud.com/database/house-sample2.jpg',
    'https://fooddl-1307472723.cos.ap-beijing.myqcloud.com/database/house-sample3.jpg']

    return (
        <div className='App'>
            <Icon color='black'></Icon>
            <div className='big-container'>
                <div className='house-box'>
                    <PhotoWindow images={imgs}></PhotoWindow>
                    <div className='info-box'>
                        <div id='box-head'>
                            <div id='line-head'>
                                <div className='house-name'>Sesame Street 15</div>
                                <div className='house-add'>East Coast Park</div>
                            </div>
                            <div className='house-price'>1600 SGD/month</div>
                        </div>
                        <div id='box-body'>
                            <div id='body-left'>
                                <div id='current-bid'>
                                    <strong>Current bid: </strong><span>1610 SGD</span>
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
                                    <span className='item-detail'>100 m2</span>
                                </div>
                                <div className='info-item'>
                                    <span className='item-title'>Rooms</span>
                                    <span className='item-detail'>4</span>
                                </div>
                                <div className='info-item'>
                                    <span className='item-title'>Rental period</span>
                                    <span className='item-detail'>21 Jul 2023 - 15 Dec 2023</span>
                                </div>
                                <div className='info-item'>
                                    <span className='item-title'>Type</span>
                                    <span className='item-detail'>House</span>
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