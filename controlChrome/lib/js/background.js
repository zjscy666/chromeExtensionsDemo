// background.js
class BackgroundService {
  constructor() {
      this.socketIoURL = 'http://localhost:9527'
      this.socketInstance = {}
      this.socketRetryMax = 5
      this.socketRetry = 0
  }
  init() {
      console.log('background.js')   
      this.connectSocket()
      this.linstenSocketEvent()
  }
  setSocketURL(url) {
      this.socketIoURL = url
  }
  // 修改 background.js 为如下代码
static emitMessageToSocketService(socketInstance, params = {}) {
  if (!_.isEmpty(socketInstance) && _.isFunction(socketInstance.emit)) {
      console.log(params)
      // 将从 content-script.js 接收到的 msg 发送到 node 服务
      socketInstance.emit('webviewEventCallback', params);
  }
}
linstenSocketEvent() {
  if (!_.isEmpty(this.socketInstance) && _.isFunction(this.socketInstance.on)) {
      this.socketInstance.on('webviewEvent', (msg) => {
          console.log(`webviewEvent msg`, msg)
          // 将从 node 服务接收到的 msg 发送到 content-script.js
          this.sendMessageToContentScript(msg, BackgroundService.emitMessageToSocketService)
      });
  }
}
sendMessageToContentScript(message, callback) {
  const operateTabIndex = message.operateTabIndex ? message.operateTabIndex : 0
  // const operateTabIndex = 1
  console.log(message)
  chrome.tabs.query({ index: operateTabIndex }, (tabs) => { // 获取 索引的方式获取对应 tabs 实例以及 id
      chrome.tabs.sendMessage(tabs[0].id, message, (response) => { // 发送消息到对应 tab
          console.log(callback)
          if (callback) callback(this.socketInstance, response)
      });
  });
}
  connectSocket() {
      if (!_.isEmpty(this.socketInstance) && _.isFunction(this.socketInstance.disconnect)) {
          this.socketInstance.disconnect()
      }
      this.socketInstance = io(this.socketIoURL);
      this.socketRetry = 0
      this.socketInstance.on('connect_error', (e) => {
          console.log('connect_error', e)
          this.socketRetry++
          if (this.socketRetryMax < this.socketRetry) {
              this.socketInstance.close()
              alert(`以尝试连接${this.socketRetryMax}次，无法连接到 socket 服务，请排查服务是否可用`)
          }
      })
  }
}
const app = new BackgroundService()
app.init()
