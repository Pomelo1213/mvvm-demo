(function () {
  const vue = new Vue('#app', {
    message: 1,
    inputValue: 'haha'
  })



  setInterval(() => {
    // 便于浏览器测试
    vue.data.message++
  }, 500)
})()