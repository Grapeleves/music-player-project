// pages/detail-search/index.js
import {getSearchHot,getSearchSuggest,getSearchResult} from '../../service/api_search'
import debounce from '../../utils/debounce'

const debouncGetSearchSuggest = debounce(getSearchSuggest,300)

Page({

    /**
     * 页面的初始数据
     */
    data: {
        hotKeywords:[],
        searchValue:'',
        suggestSongs:[],
        suggestSongsNodes:[],
        resultSongs:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getPageData()
    },

    getPageData(){
        getSearchHot().then(res => {
            this.setData({hotKeywords:res.result.hots})
        })
    },

    // 搜索处理
    handleSearchChange(event){
        const value = event.detail
        this.setData({searchValue:value})
        if(!value.length){
            this.setData({suggestSongs:[],resultSongs:[]})
            return
        }
        debouncGetSearchSuggest(value).then(res => {
            // 当快速清空搜索内容时可能上一次的请求还会返回结果，但此事不应该显示搜索数据
            // if(!this.data.searchValue.length) reutrn

            const suggestSongs = res.result.allMatch
            this.setData({suggestSongs})
            
            if(!suggestSongs.length) return
            // 将keyword转化成富文本可以渲染的nodes
            const keywords = suggestSongs.map(item => item.keyword)
            const suggestSongsNodes = []
            for(const key of keywords){
                const nodes = []
                if(key.startsWith(value)){
                    const key1 = key.slice(0,value.length)
                    const node1 = {
                        name:'span',
                        attrs:{style:"color:red;"},
                        children:[{
                            type:'text',
                            text:key1
                        }]
                    }
                    nodes.push(node1)

                    const key2 = key.slice(value.length)
                    const node2 = {
                        name:'span',
                        attrs:{style:"color:#000;"},
                        children:[{
                            type:'text',
                            text:key2
                        }]
                    }
                    nodes.push(node2)
                } else {
                    const node = {
                        name:'span',
                        attrs:{style:"color:#000;"},
                        children:[{
                            type:'text',
                            text:key
                        }]
                    }
                    nodes.push(node)
                }
                suggestSongsNodes.push(nodes)
            }
            this.setData({suggestSongsNodes})
        })
    },

    // 输入内容点击回车进行搜索
    handleSearchResult(){
        const searchVal = this.data.searchValue
        getSearchResult(searchVal).then(res => {
            this.setData({resultSongs:res.result.songs})
        })
    },

    /**
     * 
     * @param {*} event 
     * 点击具体的推荐歌曲
     */
    handleSongClick(event){
        // 获取点击的文本
        const index = event.currentTarget.dataset.index
        const key = this.data.suggestSongs[index].keyword
        // 将关键字设置到searchValue中
        this.setData({searchValue:key})
        // 请求数据
        this.handleSearchResult()
    },

    /**
     * 
     * @param {*} event 
     * 点击热门搜索查询
     */
    handleTagClick(event){
        // 获取点击的文本
        const key = event.currentTarget.dataset.keyword
         // 将关键字设置到searchValue中
         this.setData({searchValue:key})
         // 请求数据
         this.handleSearchResult()
    }
})