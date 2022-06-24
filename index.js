const venom = require('venom-bot')

venom
  .create(
    'sessionName',
    (base64Qrimg, asciiQR) => {
      console.log('Terminal qrcode: ', asciiQR)
      console.log('base64 image string qrcode: ', base64Qrimg)
    },
    (statusSession) => {
      console.log('Status Session: ', statusSession) //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled
    },
    {
      folderNameToken: 'tokens', //folder name when saving tokens
      mkdirFolderToken: '', //folder directory tokens, just inside the venom folder, example:  { mkdirFolderToken: '/node_modules', } //will save the tokens folder in the node_modules directory
      headless: true, // Headless chrome
      devtools: false, // Open devtools by default
      useChrome: true, // If false will use Chromium instance
      debug: false, // Opens a debug session
      logQR: true, // Logs QR automatically in terminal
      browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'], // Parameters to be added into the chrome browser instance
      disableSpins: true, // Will disable Spinnies animation, useful for containers (docker) for a better log
      disableWelcome: true, // Will disable the welcoming message which appears in the beginning
      updates: true, // Logs info updates automatically in terminal
      autoClose: 60000 // Automatically closes the venom-bot only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
    }
  )
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
