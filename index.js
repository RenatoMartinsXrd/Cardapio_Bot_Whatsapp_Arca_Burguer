const venom = require('venom-bot')
const venomOptions = require('./venom-options.js')

venom
  .create(venomOptions)
  .then((client) => {
    start(client)
  })
  .catch((erro) => {
    console.log(erro)
  })

let memoryUsers = new Map()

function getMinutesDiffDate(datetime2, datetime1) {
  const miliseconds = datetime2.getTime() - datetime1.getTime()
  const seconds = miliseconds / 1000
  const minutes = seconds / 60

  return Math.abs(Math.round(minutes))
}

function start(client) {
  setInterval(function () {
    let agora = new Date()
    var resultado = `${agora}`.split(' ')
    if (resultado[4] == '06:00:00') {
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
            memoryUsers.set(message.from, {
              hora: new Date(),
              finalizado: false
            })
          })
          .catch((erro) => {
            console.error('Erro ao enviar mensagem: ', erro)
          })
      } else if (
        !memoryUsers.get(message.from).finalizado &&
        getMinutesDiffDate(new Date(), memoryUsers.get(message.from).hora) >= 1
      ) {
        client
          .sendText(
            message.from,
            'Olá, caso queira falar conosco ligue para nosso whatsapp'
          )
          .then((result) => {
            memoryUsers.get(message.from).finalizado = true
          })
          .catch((erro) => {
            console.error('Erro ao enviar mensagem: ', erro)
          })
      }
    }
  })
}
