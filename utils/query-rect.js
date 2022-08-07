export default function(selecter){
    return new Promise((resolve,reject )=> {
        const query = wx.createSelectorQuery()
        query.select(selecter).boundingClientRect()
        // query.exec(res =>{
        //     resolve(res)
        // })
        // 简写
        query.exec(resolve)
    })
}