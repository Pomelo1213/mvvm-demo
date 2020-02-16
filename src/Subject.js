class Subject {
  constructor() {
    this.wathcers = []
  }

  notify(newValue) {
    this.wathcers.forEach((watcher) => {
      watcher.update(newValue)
    })
  }

  addWatcher(watcher) {
    this.wathcers.push(watcher)
  }

  removeWatcher() {
    //TODO:
  }

}
