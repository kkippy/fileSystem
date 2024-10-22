export const SET_PATH = (path:string)=>{
  localStorage.setItem('PATH',path)
}

export const GET_PATH = ()=>{
  return localStorage.getItem('PATH')
}

export const REMOVE_PATH = ()=>{
  return localStorage.removeItem('PATH')
}