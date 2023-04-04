import { useState } from 'react'
import './FilterBox.css'

interface FilterBoxProps{
    tableName: string
    attList: Record<string, number | string>[]
    onIsClickedChange: (tableName:string, updatedIsClicked: boolean[]) => void
}

function FilterBox(props: FilterBoxProps){

    const [isClicked, setClicked] = useState(Array<boolean>(props.attList.length).fill(false))

    return (
        <div className='filter-box-component'>
            <div id='box-body'>
                <div id='box-header'>{props.tableName}</div>
                <AttBoxList></AttBoxList>
            </div>
        </div>
    )

    function AttBoxList(){
        return (
            <div id='att-box'>
                {props.attList.map((att, index)=>(
                    <div className={'att-item' + (isClicked[index]? ' activate' : '')} 
                    onClick={()=>{
                        const newIsClicked = [...isClicked]
                        newIsClicked[index] = !newIsClicked[index]
                        setClicked(newIsClicked)
                        props.onIsClickedChange(props.tableName, newIsClicked)
                    }}>{Object.keys(att)[0] + ' (' + Object.values(att)[0] + ')'}</div>
                ))}
            </div>
        )
    }
}

export default FilterBox