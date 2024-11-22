import { EventDispatcher } from 'three'
import ThreeApp from '../webgl/ThreeApp'

let app: ThreeApp

//

function noop(): void {}

interface SizeData {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface EventData extends SizeData {
  type: string;
  id?: number;
  data?: any;
  preventDefault?: () => void;
  stopPropagation?: () => void;
}

class ElementProxyReceiver extends EventDispatcher {
  style: Record<string, any> = {};
  left: number = 0;
  top: number = 0;
  width: number = 0;
  height: number = 0;

  get clientWidth(): number {
    return this.width;
  }

  set clientWidth(value: number) {
    this.width = value;
  }

  get clientHeight(): number {
    return this.height;
  }

  set clientHeight(value: number) {
    this.height = value;
  }

  // OrbitControls call these as of r132. Implementing as no-ops
  setPointerCapture(): void {}
  releasePointerCapture(): void {}

  getBoundingClientRect(): DOMRect {
    return {
      x: this.left,
      y: this.top,
      left: this.left,
      top: this.top,
      width: this.width,
      height: this.height,
      right: this.left + this.width,
      bottom: this.top + this.height,
      toJSON: () => ({}) // Satisfies the DOMRect interface
    };
  }

  handleEvent(data: EventData): void {
    if (data.type === 'size') {
      this.left = data.left;
      this.top = data.top;
      this.width = data.width;
      this.height = data.height;
      return;
    }

    // Extend event data to include preventDefault and stopPropagation as no-ops
    data.preventDefault = noop;
    data.stopPropagation = noop;
    // @ts-ignore
    this.dispatchEvent(data);
  }

  focus(): void {
    // No-op
  }

  getRootNode(): any {
    return this
  }
}

class ProxyManager {
  targets: Record<number, ElementProxyReceiver> = {};

  constructor() {
    this.handleEvent = this.handleEvent.bind(this);
  }

  makeProxy(data: { id: number }): void {
    const { id } = data;
    const proxy = new ElementProxyReceiver();
    this.targets[id] = proxy;
  }

  getProxy(id: number): ElementProxyReceiver {
    return this.targets[id];
  }

  handleEvent(data: { id: number; data: EventData }): void {
    this.targets[data.id]?.handleEvent(data.data);
  }
}

const proxyManager = new ProxyManager();

function makeProxy(data: { id: number }): void {
  proxyManager.makeProxy(data);
}

//

function createApp(data: any) {
  const canvas = data.canvas as HTMLCanvasElement
  if (!(canvas instanceof OffscreenCanvas)) {
    console.log(`Doesn't support offscreen`)
    return
  }

  const proxy = proxyManager.getProxy(data.canvasId);
  // @ts-ignore
  proxy.ownerDocument = proxy; // HACK!
  (self as any).document = {}; // HACK!

  app = new ThreeApp(canvas, proxy, data)
  app.play()
}

self.onmessage = (event) => {
  const type = event.data.type
  switch (type) {
    case 'init':
      createApp(event.data)
      break
    case 'loadComplete':
      app.onLoad(event.data.data)
      break
    case 'event':
      proxyManager.handleEvent(event.data)
      break
    case 'makeProxy':
      makeProxy(event.data)
      break
  }
}
