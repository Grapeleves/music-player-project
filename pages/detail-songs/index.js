// pages/detail-songs/index.js
import {rankingStore, playerStore} from '../../store/index'
import {getSongMenuList} from '../../service/api_music'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type:'',
        ranking:'',
        songInfo:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const type = options.type
        this.setData({type})
        if(type === "menu"){
            const id = options.id
            this.getSongMenuDetail(id)
        } else if(type === "rank"){
            const ranking = options.ranking
            this.setData({ranking})
            // 获取数据
            rankingStore.onState(ranking,this.getRankingDataHandler)
        }
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        if(Object.keys(this.data.ranking).length){
            rankingStore.offState(this.data.ranking,this.getRankingDataHandler)
        }
    },

    getRankingDataHandler(res){
        this.setData({songInfo:res})
    },

    /**
     * 
     * @param {Number} id 
     * 获取歌单的详情数据
     */
    getSongMenuDetail(id){
        getSongMenuList(id).then(res => {
            console.log(res)
            this.setData({songInfo:res.playlist})
        })
    },

    /**
     * 
     * @param {object} event 
     * 歌曲列表点击
     */
    handelSongItemClick(event){
        const index = event.currentTarget.dataset.index
        playerStore.setState("playListIndex", index)
        playerStore.setState("playListSongs",this.data.songInfo.tracks)
    }
})