interface UserModel{
    email:string,
    password:string,
    name:string,
    lastname:string,
    latitude:number,
    longitude:number,
    phone_cell:number
}

interface newRegister{
    email:string
    password:string
    passwordRetyped:string
}

interface Coordenates{
    lat:number,
    long:number,
    zoom:number
}