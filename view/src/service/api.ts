import apisauce from 'apisauce'

const machineIP = "172.25.76.144"
const machinePort = "2222"
const api = apisauce.create({
    baseURL: `http://${machineIP}:${machinePort}`,
})

export interface LogInForm {
    email: string
}

export interface SignInForm {
    firstName: string,
    lastName: string,
    email: string,
    age: number,
    nationality: string,
    sex: string
}

export async function signIn(params:SignInForm) {
    let res = await api.post('/sign-in', params)
    if (res.ok){
        // jump to user page
    }
    else {
        alert("Failed to sign in")
        console.log(res.data)
    }
}