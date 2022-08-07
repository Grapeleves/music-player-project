// pages/home-viedo/index.js
import { getBanner, getSongMeun } from '../../service/api_music'
import queryRect  from '../../utils/query-rect'
import throttle from '../../utils/throttle'

import { rankingStore,rankingMap, playerStore } from '../../store/index'

const throttleQueryRect = throttle(queryRect,200,{trailing:true})
Page({

    /**
     * 页面的初始数据
     */
    data: {
      swiperHeight:0,
      // 轮播图图片数据
      banners:[],
      // 推荐歌曲前六条数据
      recommendSongs:[],
      // 热门歌单数据
      hotSongMeun:[],
      // 推荐歌单数据
      recommendSongMeun:[],
      // 巅峰榜数据
      // rankings:[]
      rankings:{
        0:{},
        2:{},
        3:{}
      },
      currentSong:{},
      isPlaying:false
    },

    /**
     * 生命周期函数--监听页面加载（类似vue中的created)
     */
    onLoad: function (options) {
      playerStore.dispatch('playMusicWithSongAction',{id:1901371647})
      // 获取页面数据
      this.getPageData()
      // 发起共享数据的请求
      rankingStore.dispatch('getRankingData')
      // 从store中获取推荐歌曲数据
      rankingStore.onState("hotRanking",res => {
        if(!res.tracks) return
        const recommendSongs = res.tracks.slice(0,6)
        this.setData({recommendSongs})
      })
       // 从store中获取巅峰榜数据：新歌、原创、飙升
      rankingStore.onState("newRanking",this.getRankingHandler(0))
      rankingStore.onState("originRanking",this.getRankingHandler(2))
      rankingStore.onState("upRanking",this.getRankingHandler(3))
      // 从store中获取当前播放歌曲的数据
      playerStore.onStates(["curSongInfo","isPlaying"],({curSongInfo,isPlaying}) => {
        if(curSongInfo) this.setData({currentSong:curSongInfo})
        if(isPlaying !== undefined) this.setData({isPlaying})
      })
    },

    /**
     * 当点击搜索框时跳转到搜索页面
     */
    handleSearchClick(){
        wx.navigateTo({
          url: '/pages/detail-search/index',
        })
    },

    /**
     * 获取页面数据
     */
    getPageData(){
      // 获取轮播图数据
      getBanner().then(res => {
          this.setData({banners:res.banners})
      })

      // 获取热门歌单数据
      getSongMeun().then(res => {
        this.setData({hotSongMeun:res.playlists})
      })

      // 获取推荐歌单数据
      getSongMeun("华语").then(res => {
        this.setData({recommendSongMeun:res.playlists})
      })
    },

    /**
     * 图片加载完成
     */
    handleImageLoaded(){
      throttleQueryRect('.swiper-image').then(res => {
        const info = res[0]
        this.setData({swiperHeight:info.height})
      })
    },

    /**
     * 处理从store中获取的数据
     */
    getRankingHandler(idx){
      return (res) => {
        if(Object.keys(res).length === 0) return
        const name = res.name
        const coverImgUrl = res.coverImgUrl
        const songList = res.tracks.slice(0,3)
        const playCount = res.playCount
        const rankingObj = {name,coverImgUrl,playCount,songList}
        // const originRankings = [...this.data.rankings]
        // originRankings.push(rankingObj)
        const originRankings = {... this.data.rankings,[idx]:rankingObj}
        this.setData({rankings:originRankings})
      }
    },

    /**
     * 
     */
    handleRcommendItenClick(event){
      const index = event.currentTarget.dataset.index
      playerStore.setState("playListIndex", index)
      playerStore.setState("playListSongs",this.data.recommendSongs)
    },

    /**
     * 歌曲推荐-更多点击跳转到详情页
     */
    handleMoreClick(){
      this.navigateToDetailSongPage("hotRanking")
    },

    /**
     * 监听巅峰榜的点击跳转到详情页
     */
    handleRankingClick(event){
      const idx = event.currentTarget.dataset.idx
      const rankingName = rankingMap[idx]
      this.navigateToDetailSongPage(rankingName)
    },

    /**
     * 
     * @param {string} rankingName 
     * 跳转到详情页
     */
    navigateToDetailSongPage(rankingName){
      wx.navigateTo({
        url: `../detail-songs/index?ranking=${rankingName}&type=rank`,
      })
    },

    // 封面暂停、播放
    handleBtnAction(){
      playerStore.dispatch("changeMusicPlayState",!this.data.isPlaying)
    },

    // 播放工具栏点击跳转到详情界面
    handlePlayBarClick(){
      wx.navigateTo({
        url: '../music-player/index?id=' + this.data.currentSong.id
      })
    }
})