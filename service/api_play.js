import SYRequest from './index'

export function getSongDetail(ids){
    return SYRequest.get("/song/detail",{
        ids
    })
}

export function getSongLyric(id){
    return SYRequest.get("/lyric",{
        id
    })
}