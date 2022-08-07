// pages/detail-video/index.js
import { getMVURL,getMVDetail,getMVRelated } from '../../service/api_viedo'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mvURLInfo:{},
        mvDetail:{},
        relatedViedos:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const id = options.id
        this.getPageInfo(id)
    },

    /**
     * 获取详情页面信息
     */
    getPageInfo(id){
        // 请求播放地址
        getMVURL(id).then(res => {
            this.setData({mvURLInfo:res.data})
        })
        // 请求视频信息
        getMVDetail(id).then(res => {
            this.setData({mvDetail:res.data})
        })
        //请求相关视频
        getMVRelated(id).then(res => {
            this.setData({relatedViedos:res.data})
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})