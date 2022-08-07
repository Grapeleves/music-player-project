// pages/home-profile/index.js
import {getUserInfo} from '../../service/api_login'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo:{}
    },

    // 获取用户信息
    async handleGetUserInfo(){
        const res = await getUserInfo()
        this.setData({userInfo:res.userInfo})
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    }
})