// app.js
import {getLoginCode, sendCodeToServer, checkToken, checkSessionKey} from './service/api_login'
App({
    // 全局共享数据
    globalData:{
        screenWidth:0,
        screenHeight:0,
        // 导航栏的高度
        statusBarHeight:0,
        deviceRadio:0
    },
    // 生命周期回调——监听小程序初始化。
    async onLaunch(){ // 
        // 1、获取系统信息
        const info = wx.getSystemInfoSync()
        this.globalData.screenWidth = info.screenWidth
        this.globalData.screenHeight = info.screenHeight
        this.globalData.statusBarHeight = info.statusBarHeight
        this.globalData.deviceRadio = info.screenHeight / info.screenWidth

        // 2、让用户进行默认登录
        this.handleLoginCheck()
    },
    // 登录前检测
    async handleLoginCheck(){
        const token = wx.getStorageSync('token')
        // 判断token是否过期
        const result = await checkToken(token)
        // 判断session_key是否过期
        const sessionResult = await checkSessionKey()
        // 当没有token、checkToken的返回结果中有errorCode（token过期）、session_key过期都要重新登陆
        if(!token || result.errorCode || !sessionResult) { 
            this.loginAction()
        }
    },
    // 登录操作
    async loginAction(){
        // 1、获取code
        const code = await getLoginCode()
        // 2、将code发送给服务器
        const result = await sendCodeToServer(code)
        const token = result.token
        // 3、将token存储到storage中
        wx.setStorageSync('token', token)
    }
})
