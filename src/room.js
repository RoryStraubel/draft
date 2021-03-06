var {EventEmitter} = require('events')

module.exports = class extends EventEmitter {
  constructor() {
    this.messages = Array(15)
    this.socks = []
  }
  join(sock) {
    this.socks.push(sock)
    sock.once('exit', this.exit.bind(this))
    sock.on('say', this.say.bind(this))
    sock.send('set', { messages: this.messages })
  }
  exit(sock) {
    sock.removeAllListeners('say')
    var index = this.socks.indexOf(sock)
    this.socks.splice(index, 1)
  }
  say(text, sock) {
    var msg = { text,
      time: Date.now(),
      name: sock.name
    }

    this.messages.shift()
    this.messages.push(msg)
    for (sock of this.socks)
      sock.send('hear', msg)
  }
}
