import "./Icon.css"

interface IconProps {
    color: string
}

function Icon(props: IconProps) {
    return (
        <p id="icon-name" className={props.color}>BidForRental</p>
    )
}

export default Icon