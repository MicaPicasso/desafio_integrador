import userModel from './models/user.js'

export default class UserService {
    constructor() {
        console.log("Working users with Database persistence in fileSystem");
    }

    getUserById= async (id)=> {
        let result = await userModel.findById(id)
        return result
    }

}