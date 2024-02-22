export default class User{
    constructor(first_name,last_name,email,age,password,loggedBy, role){
        this.first_name = first_name
        this.last_name = last_name
        this.email = email
        this.age = age
        this.password= password
        this.loggedBy= loggedBy
        this.cart= new Array()
        this.role= role
    }
};
