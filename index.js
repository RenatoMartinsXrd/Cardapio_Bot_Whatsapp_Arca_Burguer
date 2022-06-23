const venom = require('venom-bot')

venom.create().then((client) => start(client))

let memoryUsers = new Map()
function start(client) {
  setInterval(function () {
    var agora = new Date()
    var a = `${agora}`
    var resultado = a.split(' ')
    console.log(resultado[4])
    if (resultado[4] == '01:59:00') {
      memoryUsers = new Map()
    }
  }, 1000)

  client.onAnyMessage((message) => {
    if (message.body === '123' || message.body === 'pa') {
      if (!memoryUsers.get(message.from)) {
        client
          .sendText(
            message.from,
            'Olá! Tudo bem com você? Acesse nosso cardápio: https://l.instagram.com/?u=https%3A%2F%2Fapp.anota.ai%2FAArcaBurguereAcai&e=ATOa5tPpQZfk2aEfd_hKeLdunyJBeDcPwhhQAPV40HQEKOPmH_Vafkz08cEDKy8YxpCuYlyuu8Pfc85hjz4tRwWRneSfBY_urcvnufU&s=1'
          )
          .then((result) => {
            memoryUsers.set(message.from, true)
          })
          .catch((erro) => {
            console.error('Erro ao enviar mensagem: ', erro)
          })
      }
    }
  })
}
