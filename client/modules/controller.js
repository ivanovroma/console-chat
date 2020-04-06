const store = require('./store')
const display = require('./display')

const controller = {
    socket: null,
    initClient(socket) {
        this.socket = socket
        display.initClient((nickname) => {
            currentUser = `${nickname}_${getId()}`
            display.yourAuth(currentUser)

            store.setCurrentUser(currentUser)

            socket.emit('message', JSON.stringify({
                command: 'auth_user',
                data: {
                    nickname: currentUser
                }
            }))
        })
    },
    newUserAddedToChat(data) {
        if (!store.getCurrentUser()) return
        
        const { nickname } = data
        
        store.addUserInUserList(nickname)
        display.addUserInChat(nickname)
    },
    initChat(data) {
        const userList = store.setUserList(data)
        display.initChat(userList)

        startChat.call(this)
    },
    receivedMessagePublic(data) {
        display.messagePublic(data)
    },
    receivedMessagePrivate(data) {
        display.messagePrivate(data)
    },
    userLeftChat(data) {
        store.removeUserFromUserList(data.nickname)
        display.userLeftChat(data.nickname)
    }
}

function startChat() {
    display.inputUserName((nicknameTo) => {
        const userNotFound = nicknameTo.length !== 0 && !store.checkUser(nicknameTo)
            
        if (userNotFound) {
            display.userNotFound(nicknameTo)
            startChat.call(this)
        }

        display.inputMessage((message) => {
            if (nicknameTo) {
                this.socket.emit('message', JSON.stringify({
                    command: 'send_message_private',
                    data: {
                        nicknameTo,
                        nicknameFrom: store.getCurrentUser(),
                        message
                    }
                }))
                display.sendMessagePrivate(nicknameTo, message)
            }
            else {
                this.socket.emit('message', JSON.stringify({
                    command: 'send_message_public',
                    data: {
                        nicknameFrom: store.getCurrentUser(),
                        message
                    }
                }))
                display.sendMessagePublic(message)
            }

            startChat.call(this)
        })
    })
}

function getId() {
    const min = 111
    const max = 999

    return Math.floor(Math.random() * (max - min) + min);
}

module.exports = controller
