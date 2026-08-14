// A tiny pub/sub store to share scroll progress between the DOM (AuthShell/CameraRig) and the 3D environments.

type Listener = (progress: number) => void

class ScrollStore {
  private progress: number = 0
  private listeners: Set<Listener> = new Set()

  set(progress: number) {
    if (this.progress !== progress) {
      this.progress = progress
      this.notify()
    }
  }

  get() {
    return this.progress
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener)
    listener(this.progress)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.progress)
    }
  }
}

export const scrollStore = new ScrollStore()
