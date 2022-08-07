import {HYEventStore} from 'hy-event-store'
import {getRanking} from '../service/api_music'

const rankingMap = {
    0:'newRanking',
    1:'hotRanking',
    2:'originRanking',
    3:'upRanking'
}

const rankingStore = new HYEventStore({
    state:{
        // 新歌数据
        newRanking:{},
        // 热门数据
        hotRanking:{},
        // 原创数据
        originRanking:{},
        // 飙升数据
        upRanking:{},
    },
    actions:{
        // ctx：0-新歌，1-热门，2-原创，3-飙升
        getRankingData(ctx){
            for(let i = 0; i < 4; i++){
                getRanking(i).then(res =>{
                    const rankingName = rankingMap[i]
                    ctx[rankingName] = res.playlist
                    // switch(i){
                    //     case '0':
                    //         ctx.newRanking = res.playlist
                    //         break
                    //     case '1':
                    //         ctx.hotRanking = res.playlist
                    //         break
                    //     case '2':
                    //         ctx.originRanking = res.playlist
                    //         break
                    //     case '3':
                    //         ctx.upRanking = res.playlist
                    //         break
                    // }
                 })
            }
            
        }
    }
})

export {
    rankingStore,
    rankingMap
}