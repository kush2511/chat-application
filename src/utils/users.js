const users = [];

const addUser = ({id, username, room}) => {
    // username = username.trim().toLowerCase();
    // room = room.trim().toLowerCase();

    //validate
    if(!username || !room){
        return {
            error: "Username, Room Name & Key is required."
        }
    }

    //Check for existing user in room
    const existingUser = users.find((user) => {
        return user.room.trim().toLowerCase() === room.trim().toLowerCase() && user.username.trim().toLowerCase() === username.trim().toLowerCase();
    });
    if(existingUser){
        return {
            error: username + " name is already in use in '" + room + "' room."
        }
    }

    const user = {id,username,room};
    users.push(user);
    return{user};
}

const removeUser = (id) =>{
    const index = users.findIndex((user) => {
        return user.id === id
    });
    if(index !== -1){
        //splice will return an array, so here we are only removing 1 item thats why we have add [0] so that it can remove 1st item from that splice array
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => {
    const matchUser = users.find((user) => {
        return user.id === id
    })
    if(!matchUser){
        return {
            error: "No user found"
        }
    }
    return matchUser;
}

const getUsersInRoom = (room) => {
    // room = room.trim().toLowerCase();

    const matchUsers = users.filter((user) => {
        return user.room.trim().toLowerCase() === room.trim().toLowerCase();
    })

    if(!matchUsers){
        return {
            error: "No user has joined."
        }
    }

    return matchUsers;
} 

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

//For testing all above functions
// addUser({
//     id: 1,
//     username: "kush",
//     room: "B",
//     key: "Kush"
// })
// addUser({
//     id: 2,
//     username: "raj",
//     room: "B",
//     key: "Kush"
// })
// addUser({
//     id: 3,
//     username: "xyz",
//     room: "C",
//     key: "Kush"
// })

// console.log(users);

// const user = getUser(10);
// console.log(user);

// const userInRoom = getUsersInRoom("b")
// console.log(userInRoom);