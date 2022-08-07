import {syRequestLogin} from './index'

// 获取code
export function getLoginCode() {
    return new Promise((resolve,rigect) => {
        wx.login({
            timeout: 1000,
            success: res => {
               const code = res.code
               resolve(code)
            },
            fail: err => {
              rigect(err)
            }
        })
    })
}

// 将code发送给服务器
export function sendCodeToServer(code){
    return syRequestLogin.post("/login",{ code })
}

// 判断token是否过期
export function checkToken(){
    return syRequestLogin.post("/auth",{},true)
}

// 检查session_key是否过期
export function checkSessionKey(){
    return new Promise(resolve => {
        wx.checkSession({
          success: () => {
            resolve(true)
          },
          fail:() => {
              resolve(false)
          }
        })
    })
}

// 获取用户登录信息
export function getUserInfo(){
    return new Promise((resolve,reject) => {
        wx.getUserProfile({
            desc: '孙烨的音乐播放器小程序',
            success:res => {
                resolve(res)
            },
            fail:err => {
                reject(err)
            }
          })
    })
}