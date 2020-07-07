class VNode {
  tagName: string;
  props: { propName: string; propValue: any }[];
  events: { propName: string; propValue: () => void }[];
  children: VNode[];
  key: any;
  el: HTMLElement;
}

function createElement(tagName: string, props, ...children: VNode[]) {
  props = props || {};
  const vNode = new VNode();
  vNode.tagName = tagName;
  vNode.events = Object.keys(props)
    .filter((value) => value.startsWith("on"))
    .map((value) => {
      return {
        propName: value,
        propValue: props[value],
      };
    });

  vNode.props = Object.keys(props)
    .filter((value) => !value.startsWith("on") && value !== "key")
    .map((value) => {
      return {
        propName: value,
        propValue: props[value],
      };
    });
  vNode.key = props["key"];
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
    el = document.createElement(vNode.tagName);
    vNode.props.forEach((value) => {
      el.setAttribute(value.propName, value.propValue);
    });
    vNode.events.forEach((value) => {
      el.addEventListener(value.propName.replace(/^on/, ""), value.propValue);
    });
    vNode.children.forEach((value) => {
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

function Vue(this: any, params: any) {
  Object.assign(this, params.data());
  params.beforeCreate && params.beforeCreate();
  const vNodeTree = params.render.call(this, createElement);
  params.created && params.created();
  params.beforeMount && params.beforeMount();
  const el = document.querySelector(params.el);
  // TODO: diff
  mount(el, vNodeTree);
  params.mounted && params.mounted();
}

new Vue({
  el: "#el",
  data() {
    return {
      buttonText: "按钮",
      clickCount: 1,
    };
  },

  render(h) {
    return (
      <div>
        <span>hello world</span>
        <button
          onclick={() => {
            console.log("Hello World!", ++this.clickCount);
          }}
        >
          {this.buttonText}
        </button>
      </div>
    );
  },
});
