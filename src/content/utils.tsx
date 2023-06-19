import { MutableRefObject, Ref } from "react";
import { properties, propertiesMeta } from "../PropertySidebar";


export const onDragStart = (event: any) => {
    // @ts-ignore
    console.log('onDragStart', event.target?.id);
}

export const onDragEnter = (event: any) => {
    // @ts-ignore
    let target = event.target;
    target.classList.add('welcome');
    target.classList.add('welcome::before');
    console.log('onDragEnter', event.target?.id);
}

export const onDragExit = (event: any) => {
    // @ts-ignore
    let target = event.target;
    target.classList.remove('welcome');
    target.classList.remove('welcome::before');
    console.log('onDragExit', event.target?.id);
}

export const onDragEnd = (event: any) => {
    // @ts-ignore
    console.log('onDragEnd', event.target?.id);
}

type SetCursorAt = (id: string) => void;
type SetCursorFocused = (value: boolean) => void;
type SetColorRegister = (color: string) => void;
type Mode = MutableRefObject<string>;
type ColorRegister = MutableRefObject<string | null>;
  type OnKeyDown = (event: any) => void;


export const onFocused = (event: any, setCursorAt: SetCursorAt, setCursorFocused: SetCursorFocused) => {
    setCursorAt(event.target.id);
    setCursorFocused(true);
}

export const onBlur = (event: any, setCursorFocused: SetCursorFocused) => {
    setCursorFocused(false);
}

export const reindex = (parent: Element) => {

    let children = parent.children;
    for (let i = 0; i < children.length; i++) {
        const suffix = `${i}`;
        const childId = [parent.id, suffix].join(':');
        children[i].setAttribute('id', childId);
        reindex(children[i]);
    }
}

export const onClick = (event: any, mode: Mode, colorRegister: ColorRegister, setColorRegister: SetColorRegister) => {
    event.preventDefault();
    if (mode.current === 'ColorBucket') {
        event.target.style.backgroundColor = colorRegister.current;
    }
    if (mode.current === 'ColorPicker') {
        // event.preventDefault();
        setColorRegister(event.target.style.backgroundColor);
    }
    console.log(event.target.id, colorRegister.current, mode.current, event.target.style.backgroundColor)
}


export const addParent = (ele: Element, setCursorAt: SetCursorAt, setCursorFocused: SetCursorFocused) => {
    // reindex all children

    // take parent call it grand parent
    let grandParent = ele.parentElement;

    let parent = document.createElement('div');
    parent.className = 'kid';
    parent.addEventListener('focusin', (event) => onFocused(event, setCursorAt, setCursorFocused));

    const id = ele.id;
    parent.setAttribute('id', id);
    grandParent?.replaceChild(parent, ele);

    parent.appendChild(ele);

    reindex(parent);
    return parent;
}

export const createNewSibling = (setCursorAt: SetCursorAt, setCursorFocused: SetCursorFocused, mode: Mode, colorRegister: ColorRegister, setColorRegister: SetColorRegister, onKeyDown: OnKeyDown) => {
    let child = document.createElement('div');
    child.className = 'kid';
    child.setAttribute('contentEditable', 'true');
    child.setAttribute('draggable', 'false');
    child.setAttribute('data-placeholder', 'Input');
    child.addEventListener('click', (event) => onClick(event, mode, colorRegister, setColorRegister));
    child.addEventListener('keydown', (event) => onKeyDown(event));
    child.addEventListener('focusin', (event) => onFocused(event, setCursorAt, setCursorFocused));
    child.addEventListener('focusout', (event) => onBlur(event, setCursorFocused));
    child.addEventListener('dragstart', onDragStart);
    child.addEventListener('dragenter', onDragEnter);
    child.addEventListener('dragexit', onDragExit);
    child.addEventListener('dragend', onDragEnd);
    return child
}

export const addSibling = (target: Element, sibling: Element) => {

    const id: string = target.id;
    const nextElementId: string | undefined = target.nextElementSibling?.id;
    let id2 = '';

    if (!nextElementId || id.length > nextElementId.length) {
        const posLastColon = id.lastIndexOf(':');
        const posLastHyphen = id.lastIndexOf('*');
        const posLast = Math.max(posLastColon, posLastHyphen);
        const prefix = id.slice(0, posLast + 1);
        const suffix = Number(id.slice(posLast + 1, id.length)) + 1;
        id2 = `${prefix}${suffix}`;
    }
    else if (id.length < nextElementId.length) {
        const posLastColon = nextElementId.lastIndexOf(':');
        const posLastHyphen = nextElementId.lastIndexOf('*');
        const posLast = Math.max(posLastColon, posLastHyphen);
        const prefix = nextElementId.slice(0, posLast + 1);
        const suffix = Number(nextElementId.slice(posLast + 1, nextElementId.length)) - 1;
        id2 = `${prefix}${suffix}`;
    }
    else if (id.length === nextElementId.length) {
        id2 = `${id}*${0}`;
    } else {
        alert('Error in onKeyDown, could not calculate id, given conditions were not met')
    }

    sibling.setAttribute('id', id2);
    reindex(sibling);
    target.parentElement?.insertBefore(sibling, target.nextSibling);
}

export const addClassToLeaves = (element: HTMLElement, cls: string) => {
    if (element.isContentEditable) {
        element.classList.add(cls);
    }

    const children = element.childNodes;
    for (let i = 0; i < children.length; i++) {
        // @ts-ignore
        addClassToLeaves(children[i], cls);
    }
}

export const updateAttribute = (element: HTMLElement, attr: string, value: string) => {
    if (element.hasAttribute(attr)) {
        element.setAttribute(attr, value);
    }

    const children = element.children;
    for (let i = 0; i < children.length; i++) {
        // @ts-ignore
        updateAttribute(children[i], attr, value);
    }
}


export const cloneElement = (element: Element, setCursorAt: SetCursorAt, setCursorFocused: SetCursorFocused) => {
    let clone = element.cloneNode(true);

    const addListeners = (element: Element, onKeyDown: OnKeyDown) => {
        // @ts-ignore
        if (element.isContentEditable) {
            element.addEventListener('keydown', onKeyDown);
            element.addEventListener('focusin', (event) => onFocused(event, setCursorAt, setCursorFocused));
            element.addEventListener('focusout', (event) => onBlur(event, setCursorFocused));
        } else {
            element.addEventListener('focusin', (event) => onFocused(event, setCursorAt, setCursorFocused));
        }

        const children = element.childNodes;
        for (let i = 0; i < children.length; i++) {
            // @ts-ignore
            addListeners(children[i]);
        }

    }

    // @ts-ignore
    addListeners(clone);
    return clone;
}

export const clearContent = (element: HTMLElement) => {

    if (element.isContentEditable) {
        element.textContent = '';
    }

    const children = element.childNodes;
    for (let i = 0; i < children.length; i++) {
        // @ts-ignore
        clearContent(children[i]);
    }
}
// const [display, setDisplay] = useState<string>('block');
export const styleCursorAt = (i: number, j: number, cursorAt: string) => {
  const ele = document.getElementById(cursorAt);
  if (ele) {
    computeStyle(i, j).map((item) => {
      console.log('computed result', item.styleName, item.styleValue);
      ele.style[item.styleName] = item.styleValue;
      // ele.style.
    });
  } else {
    console.log('no element!')
  }
}

export const computeStyle = (i: number, j: number) => {
  const styleName = propertiesMeta[i].item;
  const styleValue = properties[styleName][j];
  // console.log('in compute',styleName, styleValue);
  if (styleName === 'spacing' || styleName === '') {
    return []
  } else {
    return [{styleName: styleName, styleValue: styleValue}]
  }  
}

