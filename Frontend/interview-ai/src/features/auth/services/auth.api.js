import axios from "axios";


const api = axios.create({
    baseURL:"http://localhost:3000",
    withCredentials: true
})

export async function register( {username, email, password } ) {
    
    try {

        const response = await api.post('/api/auth/register', {
            username, email, password
        })

        // if server returned token, set Authorization header for future requests
        if (response.data && response.data.token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
        }
        return response.data 

    } catch (err) {

        console.log(err)
    
    }

}

export async function login({ email, password }) {

    try{

        const response = await api.post("/api/auth/login",{
            email, password
        })

        if (response.data && response.data.token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
        }

        return response.data
   
    } catch (err) {
        console.log(err)
    }
    
}

export async function logout(){
    try{

        const response = await api.get("/api/auth/logout") 
           
        // clear auth header when logged out
        delete api.defaults.headers.common['Authorization']
        return response.data

    } catch (err) {

        console.log(err)
        return null
    }
}

export async function getMe(){

    try{

        const response = await api.get("/api/auth/get-me")

        return response.data

    }catch(err){
        console.log(err)
        return null
    }
}
