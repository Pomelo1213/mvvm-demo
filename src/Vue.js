
let currentWatcher = null

function isVaildData(data) {
  //NOTE: 待优化
  return typeof data === 'object' && !Array.isArray(data)
}

function observable(data) {
  const validData = isVaildData(data)
  if (!validData) {
    throw new Error('data is not vaild! please check and retry')
  }

  Object.keys(data).forEach((key) => {
    let value = data[key] || undefiend
    const subject = new Subject()
    Object.defineProperty(data, key, {
      enumerable: false,
      get() {
        if (currentWatcher) {
          currentWatcher.watchTo(subject)
        }
        return value
      },
      set(newValue) {
        value = newValue
        subject.notify(newValue)
      }
    })
  })
}


class Vue {
  constructor(el, data) {
    const element = document.getElementById(el)
    if (!element) {
      throw new Error('element is not exist !!!')
    }
    this.el = element
    this.data = data
    observable(data)
    this.renderValue()
  }


  renderValue() {
    const text = this.el.innerText
    const reg = /{{([^}]+)}}/g
    const result = reg.exec(text)
    const value = result[1]
    if (!this.data[value]) {
      throw new Error('data do not have this value')
    }
    new Watcher(this, value, (newValue) => {
      this.el.innerText = newValue
    })
    this.el.innerText = this.data[value]
  }


}



