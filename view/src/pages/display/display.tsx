import './display.css'
import Icon from '../../components/Icon/Icon'
import InfoCard from '../../components/InfoCard/InfoCard'
import SignUpIcon from '../../components/SignUpIcon/SignUpIcon'
import { HouseInfo } from '../../components/InfoCard/InfoCard'
import { useState } from 'react'

function App(){

    const houseInfos:Array<HouseInfo> = [
        {
            name: 'Sesame Street 15',
            location: "East Coast Park",
            price: 1600,
            size: 100,
            rooms: 4,
            currentBid: 1610,
            description: "Good good very good",
            startDate: new Date("2023-01-01"),
            endDate: new Date("2023-12-31"),
            images: [
                'https://fooddl-1307472723.cos.ap-beijing.myqcloud.com/database/house-sample1.jpg',
                'https://fooddl-1307472723.cos.ap-beijing.myqcloud.com/database/house-sample2.jpg',
                'https://fooddl-1307472723.cos.ap-beijing.myqcloud.com/database/house-sample3.jpg'
            ]
        },
        {
            name: 'Sesame Street 16',
            location: "East Coast Park",
            price: 1600,
            size: 100,
            rooms: 4,
            currentBid: 1610,
            description: "Good good very good",
            startDate: new Date("2023-01-01"),
            endDate: new Date("2023-12-31"),
            images: [
                'https://fooddl-1307472723.cos.ap-beijing.myqcloud.com/database/house-sample2.jpg',
                'https://fooddl-1307472723.cos.ap-beijing.myqcloud.com/database/house-sample1.jpg',
                'https://fooddl-1307472723.cos.ap-beijing.myqcloud.com/database/house-sample3.jpg'
            ]
        },
        {
            name: 'Sesame Street 17',
            location: "East Coast Park",
            price: 1600,
            size: 100,
            rooms: 4,
            currentBid: 1610,
            description: "Good good very good",
            startDate: new Date("2023-01-01"),
            endDate: new Date("2023-12-31"),
            images: [
                'https://fooddl-1307472723.cos.ap-beijing.myqcloud.com/database/house-sample3.jpg',
                'https://fooddl-1307472723.cos.ap-beijing.myqcloud.com/database/house-sample1.jpg',
                'https://fooddl-1307472723.cos.ap-beijing.myqcloud.com/database/house-sample2.jpg',
            ]
        },
    ]

    return (
        <div className="App">
            <Icon color="black"></Icon>
            <SignUpIcon color='black'></SignUpIcon>
            <div id="display-box">
                {houseInfos.map((houseInfo, index) => (
                    <InfoCard name={houseInfo.name} 
                    location={houseInfo.location}
                    price={houseInfo.price} 
                    size={houseInfo.size} 
                    rooms={houseInfo.rooms} 
                    currentBid={houseInfo.currentBid} 
                    description={houseInfo.description}
                    startDate={houseInfo.startDate}
                    endDate={houseInfo.endDate}
                    images={houseInfo.images}
                    key={houseInfo.name}></InfoCard>
                ))}
            </div>
        </div>
    )
}

export default App