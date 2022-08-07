const baseURL = 'http://123.207.32.32:9001'
const loginBaseUrl = "http://123.207.32.32:3000"
const token = wx.getStorageSync('token')

class SYRequest{
    constructor(baseURL,authHeader = {}){
        this.baseURL = baseURL
        this.authHeader = authHeader
    }
    request(url,method,params,isAuth = false,header = {}){
        const finalHeader = isAuth ? {...this.authHeader, ...header } : header
        
        return new Promise((resolve,reject) => {
            wx.request({
                url:this.baseURL + url,
                method,
                header:finalHeader,
                data:params,
                success:function(res){
                    resolve(res.data)
                },
                // fail:function(err){
                //     reject(err)
                // },
                fail:reject
            })
        })
    }
    get(url,params,isAuth = false,header){
        return this.request(url,"GET",params,isAuth,header)
    }
    post(url,data,isAuth = false,header){
        return this.request(url,"POST",data,isAuth,header)
    }
}

const syRequest = new SYRequest(baseURL)
const syRequestLogin = new SYRequest(loginBaseUrl,{
    token
})

export default syRequest
export {
    syRequestLogin
}