class Watcher {
  constructor(instance, key, cb) {
    this.subject = {}
    this.vueInstance = instance
    this.key = key
    this.cb = cb
    this.value = this.getValue()
  }

  watchTo(subject) {
    if (!this.subject[subject.id]) {
      subject.addWatcher(this)
      this.subject[subject.id] = subject
    }
  }

  update(newValue) {
    this.cb(newValue)
  }

  getValue() {
    currentWatcher = this
    // 这里把【当前的 watcher 】订阅到对应的属性上了
    const value = this.vueInstance.data[this.key]
    currentWatcher = null
    return value
  }
}
