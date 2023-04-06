import './search.css'
import Icon from '../../components/Icon/Icon'
import BottomNav from '../../components/BottomNav/BottomNav'
import { useContext, useState } from 'react'
import * as api from '../../service/api'

function App(){

    const [location, setLocation] = useState('')
    const [houseTypeList, setHouseTypeList] = useState<string[]>([])
    const [houseSize, setHouseSize] = useState<number>()
    const [maxPrice, setMaxPrice] = useState<number>()
    const [fromDate, setNationality] = useState('')
    const [toDate, setSex] = useState('')
    

    return(
        <div className="search-page">
            <Icon color="white"></Icon>
            <div className='wood-box'>
                <div className='search-box'>
                    <div className='input-box' id='location'>
                        <span>Location</span>
                        <input placeholder='Enter desired location' type='text'></input>
                    </div>
                    <div className='type-tag-box'>
                        <div className='type-tag'>All</div>
                        <div className='type-tag'>condo</div>
                        <div className='type-tag'>HDB</div>
                        <div className='type-tag'>private house</div>
                    </div>
                    <div className='detail-info-box'>
                        <div className='input-box' id='size'>
                            <span>Size</span>
                            <input type='number'></input>
                        </div>
                        <div className='input-box' id='max-price'>
                            <span>Max price</span>
                            <input type='number'></input>
                        </div>
                        <div className='input-box' id='rooms'>
                            <span>Rooms</span>
                            <input type='number'></input>
                        </div>
                        <div className='input-box' id='from-time'>
                            <span>From</span>
                            <input type='date'></input>
                        </div>
                        <div className='input-box' id='to-time'>
                            <span>To</span>
                            <input type='date'></input>
                        </div>
                        <div className='input-box'></div>
                    </div>
                    <button id='search-btn'>Search</button>
                </div>
            </div>
        </div>
    )
}

export default App