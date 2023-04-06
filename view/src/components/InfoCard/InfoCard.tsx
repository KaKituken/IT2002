import './InfoCard.css'

export interface HouseInfo{
    location: string,
    id: number,
    minPrice: number,
    size: number,
    sizeType: string,
    startDate: Date,
    endDate: Date,
    currentBid: number,
    description: string,
    images: Array<string>,
    onBidClicked: any
}

function InfoCard(props: HouseInfo){

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 
    'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

    return(
        <div className='InfoCard-background'>
            <div id='InfoCard-photo-box'>
                <div id='photo-box-line1'>
                    <div id='photo1'>
                        <img src={props.images[0]}></img>
                    </div>
                </div>
                <div id='photo-box-line2'>
                    <div id='photo2'>
                        <img src={props.images[1]}></img>
                    </div>
                    <div id='photo3'>
                        <img src={props.images[2]}></img>
                    </div>
                </div>
            </div>
            <div id='InfoCard-info-box'>
                <h1 id="house-name">{props.location}</h1>
                <h2 id="house-location">{props.id}</h2>
                <div id='tbox'>
                    <span>{props.minPrice} SGD/month</span>
                    <span>{props.size} m2</span>
                    <span>{props.sizeType}</span>
                </div>
                <p>
                    <strong>Renting period: </strong>
                    <span>{props.startDate.getDate()} {months[props.startDate.getMonth()]} {props.startDate.getFullYear()} - {props.endDate.getDate()} {months[props.endDate.getMonth()]} {props.endDate.getFullYear()}</span>
                </p>
                <p>
                    <strong>Current bid: </strong>
                    <span>{props.currentBid} SGD</span>
                </p>
                <p>{props.description}</p>
                <button id='Make-bid' onClick={()=>{
                    props.onBidClicked(props.id)
                }}>Make bid</button>
            </div>
        </div>
    )
}

export default InfoCard