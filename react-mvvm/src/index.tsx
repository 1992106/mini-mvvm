export class VNode {
  type: string;
  children: VNode[] = [];
  props: { propName: string; propValue: any }[] = [];
  events: { propName: string; propValue: () => void }[] = [];
  key: any;
  el: Node;
}

function createElement(type: string, props, ...children) {
  props = props || {};
  const vNode = new VNode();
  vNode.type = type;
  vNode.events = Object.keys(props)
    .filter(value => value.startsWith('on'))
    .map(value => {
      return {
        propName: value,
        propValue: props[value]
      }
    });

  vNode.props = Object.keys(props)
    .filter(value => !value.startsWith('on') && value !== 'key')
    .map(value => {
      return {
        propName: value,
        propValue: props[value]
      }
    });
    vNode.key = props['key'];
    vNode.children = children;
  return vNode;
}

function mount(rootElement, vNode: VNode) {
  const el = createVNode(vNode);
  if (el != null) {
    rootElement.appendChild(el);
  }
}

function createVNode(vNode: VNode): HTMLElement | Text {
  if (vNode == null) {
    return null;
  }
  if (vNode instanceof VNode) {
    let el: HTMLElement;
    el = document.createElement(vNode.type);
    vNode.props.forEach(value => {
      el.setAttribute(value.propName, value.propValue)
    });
    vNode.events.forEach(value => {
      el.addEventListener(value.propName.replace(/^on/, ''), value.propValue);
    });
    vNode.children.forEach(value => {
      const subEl = createVNode(value);
      if (subEl != null) {
        el.appendChild(subEl);
      }
    });
    vNode.el = el;
    return el;
  } else {
    return document.createTextNode(String(vNode));
  }
}


export abstract class Component {
  readonly el: HTMLElement;
  protected vNode: VNode;
  constructor(props: any) {
    if (props) {
      Object.assign(this, props);
    }
  }

  abstract render(h);
  
  protected mount() {
    this.vNode = this.render(createElement);
    const node = createVNode(this.vNode);
    this.appendToEl(node);
  }

  appendToEl(node: Node) {
    this.el && node && this.el.appendChild(node);
  }
}

export function renderDOM(componentType: {new (...args: any[]): any}, props, selector?: string) {
  const component = new componentType({...props, el: document.querySelector(selector)});
  component.beforeMount && component.beforeMount();
  component.mount();
  component.mounted && component.mounted();
  return component;
}

// 定义组件
class TestComponent extends Component {
  buttonText = 'buttonText';
  clickCount = 1;
  
  constructor(props) {
    super(props);
  }
  
  render(h) {
    return (<div>
      <span >hello world</span>
      <button onclick={() => {console.log('Hello World!', ++this.clickCount)}}>{this.buttonText}</button>
    </div>);
  }
}

// 渲染到DOM
renderDOM(TestComponent, '#el')