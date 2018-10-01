interface UserModel{
    email:string,
    password:string,
    name:string,
    lastname:string,
    latitude:number,
    longitude:number,
    phone_cell:number
}

interface DistribuitorModel{
    code: string,
    identification_card:string,
    lastname:string,
    name:string,
    password:string,
    plaque:string,
    user:string,
    zone:string,
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