// components/song-menu-area/index.js
const App = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        title:{
            type:String,
            value:''
        },
        songMenu:{
            type:Array,
            value:[]
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        screenWidth:App.globalData.screenWidth
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handlerMenuItemClick(event){
            const item = event.currentTarget.dataset.item
            wx.navigateTo({
              url: `/pages/detail-songs/index?id=${item.id}&type=menu`,
            })
        }
    }
})
