const venom = require('venom-bot')
const venomOptions = require('./venom-options.js')
const schedule = require('node-schedule')

venom
  .create(
    'Chatbot a arca',
    undefined,
    (statusSession, session) => {
      console.log('Status Session: ', statusSession)
      console.log('Session name: ', session)
    },
    venomOptions
  )
  .then((client) => {
    client.onStreamChange((state) => {
      console.log('State Connection Stream: ' + state)
    })
    start(client)
  })
  .catch((erro) => {
    console.log(erro)
  })

let memoryUsers = new Map()
let client = null

function getMinutesDiffDate(datetime2, datetime1) {
  const miliseconds = datetime2.getTime() - datetime1.getTime()
  const seconds = miliseconds / 1000
  const minutes = seconds / 60

  return Math.abs(Math.round(minutes))
}

function start(_client) {
  let hour = { hour: 6, minute: 00 }
  client = _client
  schedule.scheduleJob(hour, function () {
    memoryUsers = new Map()
  })

  client.onMessage((message) => {
    if (message && message.isGroupMsg === false) {
      if (!memoryUsers.get(message.from)) {
        client
          .sendText(
            message.from,
            'Olá Bem vindo ao nosso autoatendimento me chamo NOÉ 🤖.\nVocê pode dar uma olhada em nosso cardápio entrando no link aqui abaixo 👇\nhttps://app.anota.ai/p/AArcaBurguereAcai'
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

process.on('SIGINT', function () {
  client.close()
})
