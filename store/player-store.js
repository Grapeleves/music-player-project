// const audioContext = wx.createInnerAudioContext()
const audioContext = wx.getBackgroundAudioManager()

import { HYEventStore } from 'hy-event-store'
import { getSongDetail, getSongLyric } from '../service/api_play'
import { parseLyric } from '../utils/parse-lyric'

const playerStore = new HYEventStore({
    state:{
        id:0,
        isFirstPlaying:true, // 是否是第一次播放
        isStop:false, // 是否停止了播放

        curSongInfo:{},
        songLyric:[],
        durationTime:0, // 总时间
        currentTime:0, // 现在时间
        currentLyricIndex:0, // 现在播放的歌词的index
        currentLyricText:'', // 现在播放的歌词

        playModeIndex:0, // 0:顺序播放，1：单曲循环，2：随机播放
        isPlaying:false, // 是否在播放
        playListSongs:[], // 歌曲列表
        playListIndex:0, // 当前播放歌曲在播放列表中的index
    },
    actions:{
        playMusicWithSongAction(ctx,{ id }){
            // 如果传进来的id跟之前的是同一个，不在重新获取数据，而是继续播放
            if(ctx.id === id) return
            ctx.id = id
           
            // 重新获取数据时，将数据恢复默认值，避免显示上一首歌的数据
            ctx.curSongInfo = {}
            ctx.durationTime = 0
            ctx.songLyric = []
            ctx.isPlaying =  true

            // 获取播放歌曲的数据
            getSongDetail(id).then(res => {
                ctx.curSongInfo = res.songs[0]
                ctx.durationTime = res.songs[0].dt
                audioContext.title = res.songs[0].name
            })
            getSongLyric(id).then(res => {
                const songLyric = parseLyric(res.lrc.lyric)
                ctx.songLyric = songLyric
            })

            // 播放对应id的歌曲
            audioContext.stop() // 停止上一首音乐
            audioContext.src=`https://music.163.com/song/media/outer/url?id=${id}.mp3`
            audioContext.title= id // 使用getBackgroundAudioManager背景播放必须设置title
            audioContext.autoplay = true // 自动播放

            // 播放器事件监听处理
            if(ctx.isFirstPlaying){
                this.dispatch("setupAudioContextListener")
                ctx.isFirstPlaying = false
            }
            
        },
        // 播放器事件监听
        setupAudioContextListener(ctx){
            // 1、监听歌曲播放
            audioContext.onCanplay(() => { // 音乐播放时的回调
                if(ctx.isPlaying){
                    audioContext.play()
                }
                // audioContext.play()
            })
            // 2、监听时间改变
            audioContext.onTimeUpdate(() => {
                const currentTime = audioContext.currentTime * 1000
                ctx.currentTime = currentTime
    
                // 根据当前时间查找要播放的歌词
                if(!ctx.songLyric.length) return
                let  i = 0
                for(let len = ctx.songLyric.length; i < len; i++){
                    const lyric = ctx.songLyric[i]
                    if(currentTime < lyric.time){
                        break
                    }
                }
                const currentIndex = i - 1
                if(currentIndex !== ctx.currentLyricIndex){
                    const currentLyricText = ctx.songLyric[currentIndex].text
                    ctx.currentLyricText = currentLyricText
                    ctx.currentLyricIndex = currentIndex
                }
            })
            // 3、监听歌曲播放完毕
            audioContext.onEnded(() => {
                playerStore.dispatch("changeCurrentMusic","next")
            })
            // 4、监听歌曲播放、暂停
            audioContext.onPlay(() => { // 播放
                ctx.isPlaying = true
            })
            audioContext.onPause(() => { // 暂停
                ctx.isPlaying = false
            })
            audioContext.onStop(() => { // 停止
                ctx.isPlaying = false
                ctx.isStop = true
            })
        },
        // 更改歌曲播放状态
        changeMusicPlayState(ctx, isPlaying){
            ctx.isPlaying = isPlaying
            if(ctx.isPlaying) {
                if( ctx.isStop){
                    audioContext.src=`https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
                    audioContext.title= ctx.curSongInfo.name
                    audioContext.startTime = ctx.currentTime / 1000
                    ctx.isStop = false
                }
                audioContext.play()
            } else {
                audioContext.pause()
            }
        },
        // 下一首、上一首切换
        changeCurrentMusic(ctx, mode){
            let index = ctx.playListIndex

            // 更具不同的切换模式，获取下一首歌的索引
            switch(ctx.playModeIndex){
                case 0: // 顺序
                    if(mode === 'next'){
                        index = index + 1
                        if(index === ctx.playListSongs.length) index = 0
                    }else {
                        index = index - 1
                        if(index === -1) index = ctx.playListSongs.length - 1
                    }
                    break
                case 1: // 单曲循环(目前单曲循环点击下一曲上一曲不进行切换-之后再改)
                    break
                case 2: // 随机
                    index = Math.floor(Math.random() * ctx.playListSongs.length)
                    break
            }
            
            // 根据index获取对应歌曲
            let currentSong = ctx.playListSongs[index]
            if(!currentSong){
                currentSong = ctx.curSongInfo
            }  else{
                // 更新索引
                ctx.playListIndex = index
            }

            // 播放歌曲
            this.dispatch("playMusicWithSongAction",{id:currentSong.id})
        }
    }
})

export {
    audioContext,
    playerStore
}