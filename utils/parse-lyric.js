const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g
// 解析歌词
export function parseLyric(lyric){
    const lyricStrings = lyric.split("\n")
    const lyricInfos = []

    for(const line of lyricStrings){
        // [00:51.76]他们说 要带着光 驯服每一头怪兽

        // 获取时间
        const timeRes = timeRegExp.exec(line)
        if(!timeRes) continue
        const minute = timeRes[1] * 60 * 1000
        const second = timeRes[2] * 1000
        const millSecond = timeRes[3].length === 2 ? timeRes[3] * 10 : timeRes[3] * 1
        const time = minute + second + millSecond

        // 获取歌词文本
        // const text = line.replace(timeRes[0],"")
        const text = line.replace(timeRegExp,"")

        const lyricInfo = {time,text}
        lyricInfos.push(lyricInfo)
    }
    return lyricInfos
}