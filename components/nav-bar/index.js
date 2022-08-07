// components/nav-bar/index.js
const globalData = getApp().globalData
Component({
    options:{
        // 设置multipleSlots为true才能使用多个插槽
        multipleSlots:true
    },
    /**
     * 组件的属性列表
     */
    properties: {
        title:{
            type:String,
            value:'默认标题'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        statusHeight:globalData.statusBarHeight
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleLeftClick(){
            this.triggerEvent("click")
        }
    },

    /**
     * 组件的生命周期
     */
    lifetimes:{
        ready(){
            // 组件的信息
            // const info = wx.getSystemInfoSync()
            // console.log(info)
        }
    }
})
