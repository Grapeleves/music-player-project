import SYRequest from './index'

export function getSearchHot(){
    return SYRequest.get("/search/hot",{})
}

export function getSearchSuggest(keywords){
    return SYRequest.get("/search/suggest",{
        keywords,
        type:"mobile"
    })
}

export function getSearchResult(keywords){
    return SYRequest.get("/search",{
        keywords
    })
}