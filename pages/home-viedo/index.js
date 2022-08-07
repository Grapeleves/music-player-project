// pages/home-viedo/index.js
// import syRequest from '../../service/index'
import { getTopMV } from '../../service/api_viedo'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        topMVs:[],
        hasMore:true
    },

    /**
     * 生命周期函数--监听页面加载（类似vue中的created)
     */
    onLoad: async function (options) {
        // wx.request({
        //   url: 'http://123.207.32.32:9001/top/mv',
        //   data:{
        //       offset:0,
        //       limit:10
        //   },
        //   success:(res) => {
        //     console.log(res)
        //     this.setData({topMVs:res.data.data})
        //   },
        //   fail:(err) => {
        //     console.log(err)
        //   }
        // })

        // syRequest.get('/top/mv',{ offset:0, limit:10}).then(res => {
        //   console.log(res)
        //   this.setData({topMVs:res.data.data})
        // })

        // getTopMV(0).then(res => {
          // this.setData({topMVs:res.data})
        // })

        // const res = await getTopMV(0)
        // this.setData({topMVs:res.data})
        this.getTopMVData(0)
    },

    /**
     * 当到达底部时->下拉加载更多
     */
    async onReachBottom(){
        console.log('达到底部')
        // if(this.data.hasMore){
        //     const res = await getTopMV(this.data.topMVs.length)
        //     this.setData({topMVs:[...this.data.topMVs,...res.data]})
        //     this.setData({hasMore:res.hasMore})
        // }else {
        //     return
        // }
        this.getTopMVData(this.data.topMVs.length)
    },

    /**
     * 当执行下拉刷新时，重新加载最新的10条数据
     */
    async onPullDownRefresh(){
        // const res = await getTopMV(0)
        // this.setData({topMVs:res.data})
        // console.log(res.data.length)
        this.getTopMVData(0)
    },

    /**
     * 函数封装-获取MV数据
     */
    async getTopMVData(offset){
        if(!this.data.hasMore) return

        // 展示加载导航栏动画
        wx.showNavigationBarLoading()

        const res = await getTopMV(offset)
        let newData = this.data.topMVs
        if(!offset){
            newData = res.data
        } else {
            newData = [...newData,...res.data]
        }
        this.setData({topMVs:newData})
        this.setData({hasMore:res.hasMore})

        wx.hideNavigationBarLoading()
        // .json中backgroundTextStyle更改背景颜色，即可看到下拉刷新的动画
        if(offset === 0){
            wx.stopPullDownRefresh()
        }
    },

    /**
     * 
     */
    handleVideoItemClick(event){
        const id = event.currentTarget.dataset.item.id
        console.log(id)
        // 界面跳转到详情
        wx.navigateTo({
          url: '/pages/detail-video/index?id=' + id,
        })
    }
})