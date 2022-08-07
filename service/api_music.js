import SYRequest from './index'

export function getBanner(idx = 2){
    return SYRequest.get("/banner",{
       idx
    })
}

export function getRanking(idx){
    return SYRequest.get("/top/list",{
       idx
    })
}

export function getSongMeun(cat = "全部",limit = 6,offset = 0){
    return SYRequest.get("/top/playlist",{
        cat,
        limit,
        offset
    })
}

export function getSongMenuList(id) {
    return SYRequest.get("/playlist/detail/dynamic",{
        id
    })
}