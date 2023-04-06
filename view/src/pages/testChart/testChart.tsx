import { useEffect,useState } from "react";
import MyChart from "../../components/MyChart/MyChart";
import * as api from "../../service/api"

function Test(){

    const [tableData, setTableData] = useState<api.TableData>({columns:[], rows: []})
    let a: api.TableData = {columns:[], rows: []}

    useEffect(()=>{
        console.log('hello');
        (async () => {
            console.log('arrow')
            let success = await api.postComplexQery({
                fromTable: ['housing'],
                joinOn: [],
                filterEqual: {},
                filterLess: {}
            })
            if(success.status){
                setTableData(success.tableData)
                a = success.tableData
                console.log(success.tableData)
            }
            else{
                console.log(success.tableData)
            }
        })()
    }, [])

    return (
        <MyChart tableData={a}></MyChart>
        
    )
}

export default Test