// pages/music-player/index.js
import { audioContext, playerStore } from '../../store/index'

const playModeNames=['order','repeat','random']

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id:0,
        currentTag:0, // 当前所在界面：歌曲/歌词
        contentHeight:150,

        curSongInfo:{}, // 歌曲信息
        durationTime:0,  // 总时间
        currentTime:0, // 现在时间

        showLyric:true,
        songLyric:[], // 歌词
        currentLyricIndex:0, // 现在播放的歌词的index
        currentLyricText:'', // 现在播放的歌词
        lyricScrollTop:0, // 歌词自动滚动的距离
       
        sliderValue:0,
        isSliderChanging:false,

        playModeIndex:0, // 播放模式
        playModeName:'order', // 播放图标名字
        isPlaying:false, // 歌曲是否在播放
        playStateName:'pause',// 歌曲播放暂停图标
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取传入的id
        const id = options.id
        this.setData({id})
        // 添加数据监听
        this.setupMusicListener()
        // 动态计算content的高度
        const globalData = getApp().globalData
        const screenHeight = globalData.screenHeight
        const statusHeight = globalData.statusBarHeight
        const contentHeight =  screenHeight - statusHeight - 44
        const deviceRadio = globalData.deviceRadio
        this.setData({contentHeight, showLyric: deviceRadio >= 2})
    },

    /**
     * 界面切换
     */
    handleSwiperChange(event){
        const current = event.detail.current
        this.setData({currentTag:current})
    },

    /**
     * 
     * @param {*} event 
     * 进度条改变,指最后滑动完毕松手时或者用户点击完毕
     */
    handleSliderChange(event){
        // value:0-100
        const value = event.detail.value
        // 需要播放的时间
        const currentTime = this.data.durationTime * value / 100
        // 设置为当前播放时间
        // audioContext.pause() // 暂停音乐
        audioContext.seek(currentTime / 1000) // 以s为单位
        // 记录最新的sliderValue
        this.setData({sliderValue:value,isSliderChanging:false})
    },

    /**
     * 
     * @param {*} event 
     * 当进度条在切换过程中
     */
    handleSliderChanging(event){
        const value = event.detail.value
        const currentTime = this.data.durationTime * (value / 100)
        this.setData({isSliderChanging:true,currentTime})
    },

    /**
     * 切换播放模式
     */
    handlePlayModeClick(){
        let curModeIndex = this.data.playModeIndex + 1
        if(curModeIndex === 3) curModeIndex = 0
        playerStore.setState("playModeIndex",curModeIndex)
    },

    /**
     * 暂停-播放按钮点击
     */
    handlePauseClick(){
        playerStore.dispatch("changeMusicPlayState",!this.data.isPlaying)
    },

    /**
     * 返回操作
     */
    handleBackClick(){
        wx.navigateBack()
    },

    /**
     * 使用store监听歌曲数据
     */
    setupMusicListener(){
        // 1、监听歌曲数据
        playerStore.onStates(["curSongInfo","durationTime","songLyric"], ({curSongInfo,durationTime,songLyric}) => {
            if(curSongInfo) this.setData({curSongInfo})
            if(durationTime) this.setData({durationTime})
            if(songLyric) this.setData({songLyric})
        })
        // 2、监听当前播放数据
        playerStore.onStates(["currentTime","currentLyricIndex","currentLyricText"],(
            {currentTime,currentLyricIndex,currentLyricText}) => {
            // 当用户在拖动滑块的时候不去更改sliderValue，否则滑块回来会跳动。
            // 也不要去更改currentTime，否则现在时间会显示播放的时间
            if(currentTime && !this.data.isSliderChanging) {
                const sliderValue = Math.floor(currentTime / this.data.durationTime * 100)
                this.setData({currentTime,sliderValue})
            }
            if(currentLyricIndex) {
                const lyricScrollTop = currentLyricIndex * 38 // 38是样式中设置的每行歌词的高度
                this.setData({currentLyricIndex,lyricScrollTop})
            }
            if(currentLyricText) this.setData({currentLyricText})
        })
        // 3、监听播放模式
        playerStore.onState("playModeIndex",(index) => {
            this.setData({playModeIndex:index,playModeName:playModeNames[index]})
        })
        // 4、监听是否播放
        playerStore.onState("isPlaying",(flag) => {
            this.setData({isPlaying:flag,playStateName: flag ? "pause":'resume'})
        })
    },

    // 上一首
    handlePrevClick(){
        playerStore.dispatch("changeCurrentMusic","prev")
    },

    // 下一首
    handleNextClick(){
        playerStore.dispatch("changeCurrentMusic","next")
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        // 取消数据监听
        // playerStore.offStates()
    }
})