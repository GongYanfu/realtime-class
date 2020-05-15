export const setItem = (key, value) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value)
    }
  }
  
  export const getItem = (key) => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(key)
    }
  }
  
  export const removeItem = (key) => {
    if (typeof window !== 'undefined') {
      return window.localStorage.removeItem(key)
    }
  }
  
  export const KEYS = {
    KEY_CUR_USERINFO:'currentUserInfo', //当前用户Info
    KEY_CUR_CLASSWORK:'currentClasswork', //当前作业
    KEY_CUR_ANSWER:'answerId', //当前答案Id
    KEY_CUR_ANSWERS:'answers', //当前作业至少提交一次
    KEY_CUR_CHAPTER:'currentChapterInfo',//当前章节测评
  }