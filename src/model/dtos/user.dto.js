class UserDto{
    constructor({username,address,age}){
        this.username = username,
        this.address = address,
        this.age = age
    };
}

export const applyDto = (users)=>{
    if(Array.isArray(users)){
        const newData = users.map(user=>new UserDto(user));
        return newData;
    } else {
        const newData = new UserDto(users);
        return newData;
    }
}