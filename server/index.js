const { serverPort } = require('../config')
const Controller = require('./modules/Controller')
const io = require('socket.io').listen(serverPort)

io.sockets.on('connection', (socket) => {
    const controller = new Controller(socket)

    socket.on('message', (payloadStr) => {
        const payload = JSON.parse(payloadStr)
        const { command, data } = payload

        switch (command) {
            case 'auth_user':
                controller.authUser(data)
                break;
            case 'send_message_public':
                controller.sendMessagePublic(data)
                break
            case 'send_message_private':
                controller.sendMessagePrivate(data)
                break
            default:
                console.log('Unknown command', payload)
                break;
        }
    })

    socket.on('disconnect', (data) => {
        console.log('LEAVe')
        controller.userLeftChat(data)
    })
})
