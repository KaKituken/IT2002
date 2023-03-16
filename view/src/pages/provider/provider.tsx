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

function App(){

    const images = [house1, house2, house3, house4, house5, house6, 
    'https://fooddl-1307472723.cos.ap-beijing.myqcloud.com/ingredient_img/apple.png']

    const imgs = api.getHouseImages()

    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]

    return(
        <div className="App">
            <Icon color="black"></Icon>
            <h1 id="title">My object</h1>
            <div className="photo-box">
                {images.map((image, index) => (
                    <img key={index} src={image}></img>
                ))}
            </div>
            <div className="provide-form">
                <div className="form-item">
                    <p>Asking price</p>
                    <input className="form-input" type="number"></input>
                </div>
                <div className="form-item">
                    <p>Size</p>
                    <input className="form-input" type="number"></input>
                </div>
                <div className="form-item">
                    <p>Type</p>
                    <input className="form-input" type="text"></input>
                </div>
                <div className="form-item">
                    <p>Rooms for rent</p>
                    <input className="form-input" type="number"></input>
                </div>
                <div className="form-item">
                    <p>Location</p>
                    <input className="form-input" type="string"></input>
                </div>
                <div className="form-item">
                    <p>Start date</p>
                    <input className="form-input" type="date"></input>
                </div>
                <div className="form-item">
                    <p>End date</p>
                    <input className="form-input" type="date"></input>
                </div>
                <div className="form-item">
                    <p>Max bid</p>
                    <input className="form-input" type="number"></input>
                </div>
                <div className="form-item">
                    <p>Bidding period</p>
                    <input className="form-input" type="number"></input>
                </div>
                <div className="form-item">
                    <p>Description</p>
                    <input className="form-input" type="text"></input>
                </div>
            </div>
            <button id="submit-btn">Update</button>
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