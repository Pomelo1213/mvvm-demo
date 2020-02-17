

class Vue {
  constructor(el, data) {
    const element = document.getElementById(el)
    if (!element) {
      throw new Error('element is not exist !!!')
    }
    this.el = element
    this.data = data
    new Compile(this)
  }

}




