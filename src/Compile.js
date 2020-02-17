
// const ELEMENT_NODE = 1

// const TEXT_ELEMENT_NODE = 3


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
    let value = data[key] || undefined
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




class Compile {
  constructor(vueInstance) {
    const { el, data } = vueInstance
    this.vueInstance = vueInstance
    this.data = data
    this.el = el
    observable(data)
    this.compileElement(this.el)
  }

  compileElement(el) {
    // console.log(el, el.tagName)
    // if (el.nodeType === ELEMENT_NODE) {
    if (el.tagName !== 'SPAN') {
      // 普通元素节点
      const attributes = el.attributes
      const childrens = Array.from(el.children)
      if (attributes) {
        this.transferModelNode(el, attributes)
      }
      if (childrens.length > 0) {
        childrens.forEach((child) => {
          this.compileElement(child)
        })
      }
      // } else if (el.nodeType === TEXT_ELEMENT_NODE) {
    } else if (el.tagName === 'SPAN') {
      // 文本节点
      this.transferTextNode(el)
    }
    // 其余节点不考虑 详见[MDN nodeType](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType)

  }



  //处理指令节点，如含有 v-model 的属性元素节点
  transferModelNode(node, attributes) {
    // 只考虑简单实现的话，这里暂时只考虑 input 节点，并且指令也暂时只考虑 v-model
    const vueCommand = 'v-model'
    const attributesArray = Array.from(attributes)
    attributesArray.forEach((eachAttr) => {
      if (eachAttr.name === vueCommand) {
        // 这就是绑定的值
        const bindValue = eachAttr.value
        if (this.data[bindValue] === undefined && this.data[bindValue] === null) {
          throw new Error('data do not have this value')
        }
        // 双向绑定的核心
        new Watcher(this, bindValue, (newValue) => {
          node.value = newValue
        })
        node.value = this.data[bindValue]
        node.oninput = (e) => {
          this.data[bindValue] = e.target.value
        }
      }
    })
  }

  //处理文本节点
  transferTextNode(node) {
    const reg = /{{([^}]+)}}/g
    const result = reg.exec(node.innerText)
    const value = result[1]
    if (!this.data[value]) {
      throw new Error('data do not have this value')
    }
    new Watcher(this, value, (newValue) => {
      node.innerText = newValue
    })
    node.innerText = this.data[value]
  }
}