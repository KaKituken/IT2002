import apisauce from 'apisauce'
import { HouseInfo } from '../components/InfoCard/InfoCard'

// const machineIP = "172.25.77.37"
const machineIP = "127.0.0.1"
const machinePort = "2222"
const api = apisauce.create({
    baseURL: `http://${machineIP}:${machinePort}`,
})

export interface LogInForm {
    email: string,
    password: string
}

export interface SignInForm {
    firstName: string,
    lastName: string,
    email: string,
    age: number,
    nationality: string,
    sex: string,
    password: string,
    type: string
}

export interface ProviderForm {
    houseInfo: HouseInfo
    token: string
}

export interface SignInReturn {
    status: boolean
    details: string
}

export interface LogInReturn {
    status: boolean
    details: string
    token: string
}

export interface GetTableNameReturn {
    status: boolean
    details: string
    tableNameList: string[]
}

export interface GetAttributeReturn {
    status: boolean;
    tableAttributes: TableAttributes[];
    details: string;
}

export interface TableAttributes {
    name: string;
    attribute: Attribute[];
}

interface Attribute {
    attributeName: string;
    type: string;
    count: ValueCount[];
}

interface ValueCount {
    [value: string]: number;
}
  

export async function signIn(params:SignInForm) {
    let res = await api.post('/sign-in', params)
    if (res.ok){
        console.log(res)
        return res.data as Promise<SignInReturn>
    }
    else {
        alert("Failed to sign in")
        console.log(res.data)
        return res.data as Promise<SignInReturn>
    }
}

export async function logIn(params:LogInForm) {
    let res = await api.post('/log-in', params)
    if (res.ok){
        console.log(res)
        return res.data as Promise<LogInReturn>
    }
    else {
        alert("Failed to log in")
        console.log(res.data)
        return res.data as Promise<LogInReturn>
    }
}

export async function getHouseImages() {
    return []
}

export async function uploadHouse(params:ProviderForm) {
    let res = await api.post('/provide-house', params)
    if (res.ok){
        return res.data
    }
    else {
        alert("Failed to upload")
        console.log(res.data)
    }
}

export async function getHouseList() {
    let res = await api.get('/house-list')
    if (res.ok){
        return res.data
    }
    else {
        alert("Failed to get current house list")
        console.log(res.data)
    }
}

export async function getTableName() {
    let res = await api.get('/admin/table-name')
    if (res.ok){
        return res.data as Promise<GetTableNameReturn>
    }
    else {
        alert("Failed to get table name")
        console.log(res.data)
        return res.data as Promise<GetTableNameReturn>
    }
}

export async function getAttributeInfo(params:string[]) {
    let res = await api.post('/admin/attributes', params)
    if(!res.ok){
        alert("Failed to get attribute info")
        console.log(res.data)
    }
    return res.data as Promise<GetAttributeReturn>
}