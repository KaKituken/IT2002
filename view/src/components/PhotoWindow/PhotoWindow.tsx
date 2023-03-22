import React, { useState } from 'react'
import './PhotoWindow.css'

export interface PhotoWindowInfo {
    images: Array<string>
}

function PhotoWindow(props: PhotoWindowInfo){
    const [currentImage, setCurrentImage] = useState(0)
    const [animation, setAnimation] = useState('');
    const len = props.images.length

    function handleNextPhoto(){
        setAnimation('slideOut')
        setTimeout(() => {
            setCurrentImage((currentImage + 1) % len)
            setAnimation('slideIn')
        }, 500)
    }

    function handelPrePhoto(){
        setAnimation('slideOut')
        setTimeout(() => {
            setCurrentImage((currentImage + len - 1) % len)
            setAnimation('slideIn')
        }, 500)
    }

    return (
        <div className='photo-window-bg'>
            <img src={props.images[currentImage]} alt="Current"
                className={`photo-window-img ${animation}`}></img>
            <div className='photo-ctr-btn' id="photo-next-btn" onClick={handleNextPhoto}></div>
            <div className='photo-ctr-btn' id="photo-pre-btn" onClick={handelPrePhoto}></div>
        </div>
    )
}

export default PhotoWindow