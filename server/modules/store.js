const data = {
    userList: []
}

const store = {
    addUser(user) {
        data.userList.push(user)
    },
    getUserListNicknames() {
        const result = []

        data.userList.forEach((user) => {
            const { nickname } = user
            result.push(nickname)
        })

        return result
    },
    getSocketByNickname(desiredNickname) {
        let socket = null

        data.userList.forEach((user) => {
            const { nickname } = user

            if (nickname === desiredNickname) {
                socket = user.socket
            }
        })

        return socket
    },
    findUserBySocketId(desiredSocketId) {
        let desiredUser = null

        data.userList.forEach((user) => {
            const { socketId } = user

            if (socketId === desiredSocketId) {
                desiredUser = user
            }
        })

        return desiredUser
    },
    removeUserByNickname(desiredNickname) {
        data.userList.forEach((user, userIndex) => {
            const { nickname } = user

            if (nickname === desiredNickname) {
                data.userList.splice(userIndex, 1)
            }
        })
    }
}

module.exports = store
