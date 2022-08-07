import SYRequest from './index'

export function getTopMV(offset,limit=10){
    return SYRequest.get("/top/mv",{
        offset,
        limit
    })
}

/**
 * 获取mv的播放地址
 * @param {number} id 
 */
export function getMVURL(id){
    return SYRequest.get("/mv/url",{
        id
    })
}

/**
 * 获取mv的详细数据
 * @param {number} mvid
 */

 export function getMVDetail(mvid){
     return SYRequest.get("/mv/detail",{
         mvid
     })
 }

 /**
  * 获取mv的相关联视频
  * @param {number} id 
  */
 export function getMVRelated(id){
     return SYRequest.get('/related/allvideo',{
         id
     })
 }