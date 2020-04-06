const data = {
    userList: [],
    currentUser: null,
}

const store = {
    setCurrentUser(currentUser) {
        data.currentUser = currentUser
    },
    getCurrentUser() {
        return data.currentUser
    },
    setUserList(userList) {
        data.userList = []

        userList.forEach((user) => {
            if (user != data.currentUser) {
                data.userList.push(user)
            }
        })

        return data.userList
    },
    addUserInUserList(nickname) {
        data.userList.push(nickname)
    },
    checkUser(nickname) {
        return data.userList.indexOf(nickname) !== -1
    },
    removeUserFromUserList(nickname) {
        const userIndex = data.userList.indexOf(nickname)
        data.userList.splice(userIndex, 1)
    }
}

module.exports = store
