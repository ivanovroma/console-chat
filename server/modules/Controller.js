const store = require('./store')

class Controller {
    constructor(socket) {
        this.socket = socket

        console.log('Новое подключение')
    }
    authUser(data) {
        const user = {
            nickname: data.nickname,
            socketId: this.socket.id,
            socket: this.socket
        }

        store.addUser(user)
        const userList = store.getUserListNicknames()
    
        user.socket.emit('message', {
            command: 'init_chat',
            data: userList
        })
    
        this.socket.broadcast.emit('message', {
            command: 'new_user_add_to_chat',
            data: {
                nickname: user.nickname
            }
        })
    
        console.log(`\nПодключился пользователь: ${user.nickname}`)
    }
    sendMessagePublic(data) {
        const date = new Date()
        this.socket.broadcast.emit('message', {
            command: 'received_message_public',
            data: {
                nicknameFrom: data.nicknameFrom,
                message: data.message,
                time: `${date.getHours()}:${date.getMinutes()}`
            }
        })
    }
    sendMessagePrivate(data) {
        const {
            nicknameTo,
            nicknameFrom,
            message
        } = data

        const date = new Date()
        const socketTo = store.getSocketByNickname(nicknameTo)

        socketTo.emit('message', {
            command: 'received_message_private',
            data: {
                nicknameFrom,
                message,
                time: `${date.getHours()}:${date.getMinutes()}`
            }
        })
    }
    userLeftChat() {
        const departedUser = store.findUserBySocketId(this.socket.id)

        if (!departedUser) return

        console.log(`Пользователь ${departedUser.nickname} покинул комнату`)

        const { socket } = departedUser

        socket.broadcast.emit('message', {
            command: 'user_left_chat',
            data: {
                nickname: departedUser.nickname
            }
        })

        store.removeUserByNickname(departedUser.nickname)
    }
}

module.exports = Controller
