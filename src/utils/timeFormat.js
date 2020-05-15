export const TimestampToNormaltime = (timestamp) => {
    var date = new Date(timestamp)
    var Y = date.getFullYear() + '-'
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
    var D = date.getDate() + ' '
    var h = date.getHours() + ':'
    var m = date.getMinutes() + ':'
    var s = date.getSeconds()
    return Y+M+D+h+m+s
}

export const NormaltimeToTimestamp = (normaltime) => {
    if(typeof(normaltime) === 'string'){
        const newDate = normaltime.replace(/-/g,'/')
        const timestamp = (new Date(newDate)).getTime()
        return timestamp
    }
    else{
        var date = new Date(normaltime)
        var Y = date.getFullYear() + '/'
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/'
        var D = date.getDate() + ' '
        var h = date.getHours() + ':'
        var m = date.getMinutes() + ':'
        var s = date.getSeconds()
        const newDate = Y+M+D+h+m+s
        const timestamp = (new Date(newDate)).getTime()
        return timestamp
    }
}