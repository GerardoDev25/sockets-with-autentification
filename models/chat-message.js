class Message {
    constructor( uid, nombre, mensaje ) {
        this.uid     = uid;
        this.nombre  = nombre;
        this.mensaje = mensaje;
    }
}


class ChatMessage {

    constructor() {
        this.messages = [];
        this.users = {};
    }

    get last10() {
        this.messages = this.messages.splice(0,10);
        return this.messages;
    }

    get usersArr() {
        return Object.values( this.users ); // [ {}, {}, {}]
    }

    sendMessage( uid, name, message ) {
        this.messages.unshift(
            new Message(uid, name, message)
        );
    }

    userConnect( user ) {
        this.users[user.id] = user
    }

    userDisconnect( id ) {
        delete this.users[id];
    }

}

module.exports = ChatMessage;