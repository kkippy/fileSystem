//封装本地存储token和读取token的方法
export const SET_TOKEN = (token:string)=>{
    localStorage.setItem('TOKEN',token)
}

export const SET_USER = (user:string)=>{
    localStorage.setItem('USER_ROLE',user)
}

export const GET_TOKEN = ()=>{
    return localStorage.getItem('TOKEN')
}

export const GET_USER = ()=>{
    return localStorage.getItem('USER_ROLE')
}

export const REMOVE_TOKEN = ()=>{
    localStorage.removeItem('TOKEN')
}

export const REMOVE_USER = ()=>{
    localStorage.removeItem('USER_ROLE')
}