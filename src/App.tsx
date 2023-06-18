import { useArrayState } from 'rooks'
import './App.css'
import { useRef, useState } from 'react';
import { useKey } from 'rooks';
import { PropertyPanel, properties, propertiesMeta } from './PropertySidebar'

const displayMatrix: Map<string, string> = new Map([
  ['block', 'inline'],
  ['inline', 'inline-block'],
  ['inline-block', 'flex'],
  ['flex', 'inline-flex'],
  ['inline-flex', 'grid'],
  ['grid', 'inline-grid'],
  ['inline-grid', 'flow-root'],
  ['flow-root', 'block]'],
]);

const colorMatrix = new Map([
  ['rgb(170, 17, 221)',
    '#842'],
  ['rgb(136, 68, 34)',
    '#484'],
  ['rgb(68, 136, 68)',
    '#3a4'],
  ['rgb(51, 170, 68)',
    '#386'],
  ['rgb(51, 136, 102)',
    '#36a'],
  ['rgb(51, 102, 170)',
    '#a1d'],
]);


function App() {

  // content-wrapper, right-sidebar, cmd-line
  const [cursorIn, setCursorIn] = useState<string>('content-wrapper');
  // stores idx of items in the right sidebar
  const [styleIdx, setStyleIdx] = useState<number>(0);
  // for scrolling into view
  const rightSidebarRef = useRef(null);
  const [styleValueIdx, styleValueIdxControls] = useArrayState<number>(Array(propertiesMeta.length).fill(0));
  // stores div ids in the content-wrapper
  const [cursorAt, setCursorAt] = useState<string>('div*0');
  // focused means being edited
  const cursorFocused = useRef<boolean>(false);
  // to copy nodes
  const register = useRef<(Element | null)[]>([null, null, null, null, null]);
  // to copy color
  const colorRegister = useRef<string | null>(null);
  // Insert, Move, ColorPicker, ColorBucket
  const mode = useRef<string>('Insert');

  const setCursorFocused = (value: boolean) => {
    cursorFocused.current = value;
  }

  const setColorRegister = (color: string) => {
    colorRegister.current = color;
  }

  const setMode = (value: string) => {
    mode.current = value;
  }

  const updateMode = (mode: string) => {
    setMode(mode);
    let element = document.getElementById('div');
    if (mode === 'Insert') {
      if (element) {
        updateAttribute(element, 'contentEditable', 'true');
        updateAttribute(element, 'draggable', 'false');
      }
    }
    if (mode === 'Move' || mode === 'ColorPicker' || mode === 'ColorBucket') {
      if (element) {
        updateAttribute(element, 'contentEditable', 'false');
        updateAttribute(element, 'draggable', 'false');
      }
    }
    if (mode === 'Move') {
      if (element) {
        updateAttribute(element, 'draggable', 'true');
      }

    }
  }
  // const [display, setDisplay] = useState<string>('block');
  const styleCursorAt = (i: number, j: number) => {
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
  
  const computeStyle = (i: number, j: number) => {
    const styleName = propertiesMeta[i].item;
    const styleValue = properties[styleName][j];
    // console.log('in compute',styleName, styleValue);
    if (styleName === 'spacing' || styleName === '') {
      return []
    } else {
      return [{styleName: styleName, styleValue: styleValue}]
    }  
  }

  const updateDisplay = (display: string) => {
    if (displayMatrix.has(display)) {
      return displayMatrix.get(display);
    }
    else {
      return 'block';
    }
  }

  const updateBgColor = (color: string) => {
    const newColor = colorMatrix.get(color);
    console.log(color, newColor);
    return newColor ? newColor : '#842';
  }

  const onClick = (event: any) => {
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

  const onDragStart = (event: any) => {
    // @ts-ignore
    console.log('onDragStart', event.target?.id);
  }

  const onDragEnter = (event: any) => {
    // @ts-ignore
    let target = event.target;
    target.classList.add('welcome');
    target.classList.add('welcome::before');
    console.log('onDragEnter', event.target?.id);
  }

  const onDragExit = (event: any) => {
    // @ts-ignore
    let target = event.target;
    target.classList.remove('welcome');
    target.classList.remove('welcome::before');
    console.log('onDragExit', event.target?.id);
  }

  const onDragEnd = (event: any) => {
    // @ts-ignore
    console.log('onDragEnd', event.target?.id);
  }

  const updateCursorAt = (id: string) => {
    document.getElementById(cursorAt)?.classList.remove('focused');
    setCursorAt(id);
    document.getElementById(id)?.classList.add('focused');
  }

  const onFocused = (event: any) => {
    setCursorAt(event.target.id);
    setCursorFocused(true);
  }

  const onBlur = (event: any) => {
    setCursorFocused(false);
  }

  const reindex = (parent: Element) => {

    let children = parent.children;
    for (let i = 0; i < children.length; i++) {
      const suffix = `${i}`;
      const childId = [parent.id, suffix].join(':');
      children[i].setAttribute('id', childId);
      reindex(children[i]);
    }
  }


  const addParent = (ele: Element) => {
    // reindex all children

    // take parent call it grand parent
    let grandParent = ele.parentElement;

    let parent = document.createElement('div');
    parent.className = 'kid';
    parent.addEventListener('focusin', onFocused);

    const id = ele.id;
    parent.setAttribute('id', id);
    grandParent?.replaceChild(parent, ele);

    parent.appendChild(ele);

    reindex(parent);
    return parent;
  }

  const createNewSibling = () => {
    let child = document.createElement('div');
    child.className = 'kid';
    child.setAttribute('contentEditable', 'true');
    child.setAttribute('draggable', 'false');
    child.setAttribute('data-placeholder', 'Input');
    child.addEventListener('click', onClick);
    child.addEventListener('keydown', onKeyDown);
    child.addEventListener('focusin', onFocused);
    child.addEventListener('focusout', onBlur);
    child.addEventListener('dragstart', onDragStart);
    child.addEventListener('dragenter', onDragEnter);
    child.addEventListener('dragexit', onDragExit);
    child.addEventListener('dragend', onDragEnd);
    return child
  }

  const addSibling = (target: Element, sibling: Element) => {

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

  const addClassToLeaves = (element: HTMLElement, cls: string) => {
    if (element.isContentEditable) {
      element.classList.add(cls);
    }

    const children = element.childNodes;
    for (let i = 0; i < children.length; i++) {
      // @ts-ignore
      addClassToLeaves(children[i], cls);
    }
  }

  const updateAttribute = (element: HTMLElement, attr: string, value: string) => {
    if (element.hasAttribute(attr)) {
      element.setAttribute(attr, value);
    }

    const children = element.children;
    for (let i = 0; i < children.length; i++) {
      // @ts-ignore
      updateAttribute(children[i], attr, value);
    }
  }


  const cloneElement = (element: Element) => {
    let clone = element.cloneNode(true);

    const addListeners = (element: Element) => {
      // @ts-ignore
      if (element.isContentEditable) {
        element.addEventListener('keydown', onKeyDown);
        element.addEventListener('focusin', onFocused);
        element.addEventListener('focusout', onBlur);
      } else {
        element.addEventListener('focusin', onFocused);
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

  const clearContent = (element: HTMLElement) => {

    if (element.isContentEditable) {
      element.textContent = '';
    }

    const children = element.childNodes;
    for (let i = 0; i < children.length; i++) {
      // @ts-ignore
      clearContent(children[i]);
    }
  }

  const onKeyDownBody = (event: any) => {
    // event.preventDefault();
    if (!cursorFocused.current) {
      const key = event.code;
      if (key === 'KeyA' && cursorAt) {
        const id: string | undefined = document.getElementById(cursorAt)?.parentElement?.id;
        if (id && id != 'content-wrapper') {
          updateCursorAt(id);
        }

      }
      if (key === 'KeyJ' && cursorAt) {
        event.preventDefault();
        // setCurrFocused(id);
        if (cursorIn === 'right-sidebar') {
          const newIdx = (styleIdx + 1) % propertiesMeta.length;
          setStyleIdx(newIdx);
          // @ts-ignore
          rightSidebarRef.current?.children[newIdx].scrollIntoView();
          
          styleCursorAt(newIdx, styleValueIdx[newIdx]);
        } else {

          const ele = document.getElementById(cursorAt)?.nextElementSibling;
          ele?.scrollIntoView();
          const id: string | undefined = ele?.id;
          if (id) {
            updateCursorAt(id);
          }
        }
      }
      if (key === 'KeyK' && cursorAt) {
        event.preventDefault();
        if (cursorIn === 'right-sidebar') {
          const newIdx = (styleIdx - 1 + propertiesMeta.length) % propertiesMeta.length;
          setStyleIdx(newIdx);
          // @ts-ignore
          rightSidebarRef.current?.children[newIdx].scrollIntoView();

          styleCursorAt(newIdx, styleValueIdx[newIdx]);
        } else {
          const ele = document.getElementById(cursorAt)?.previousElementSibling;
          ele?.scrollIntoView();
          const id: string | undefined = ele?.id;
          if (id) {
            updateCursorAt(id);
          }
        }
      }
      if (key === 'KeyH' && cursorAt) {
        event.preventDefault();
        if (cursorIn === 'right-sidebar') {
          const newIdx = (styleValueIdx[styleIdx] - 1 + propertiesMeta[styleIdx].length) % propertiesMeta[styleIdx].length;
          styleValueIdxControls.replaceItemAtIndex(styleIdx, newIdx);
          styleCursorAt(styleIdx, newIdx);
        } 
      }
      if (key === 'KeyL' && cursorAt) {
        event.preventDefault();
        if (cursorIn === 'right-sidebar') {
          const newIdx = (styleValueIdx[styleIdx] + 1) % propertiesMeta[styleIdx].length;
          styleValueIdxControls.replaceItemAtIndex(styleIdx, newIdx);
          styleCursorAt(styleIdx, newIdx);
        } 
      }
      if (key === 'KeyC' && cursorAt) {
        event.preventDefault();
        // const ele = document.getElementById(cursorAt);
        if (cursorIn === 'content-wrapper') {

          setCursorIn('right-sidebar');
          // ele.style.display = updateDisplay(ele.style.display);
        } else {
          setCursorIn('content-wrapper')
        }

      }
      if (key === 'KeyY' && cursorAt) {
        event.preventDefault();
        const ele = document.getElementById(cursorAt);
        if (ele) {
          register.current = [ele, ...register.current.slice(1)]
          // registerControls.replaceItemAtIndex(0, ele);
        }
      }
      if (key === 'KeyP' && cursorAt) {
        // behaviour of paste ??
        // lets experiment with only layout
        event.preventDefault();
        const ele = document.getElementById(cursorAt);
        if (ele && register.current[0]) {
          let sibling = cloneElement(register.current[0]);

          // @ts-ignore
          clearContent(sibling);
          // @ts-ignore
          addClassToLeaves(sibling, 'empty');
          // @ts-ignore
          addSibling(ele, sibling);
          // @ts-ignore
          updateCursorAt(sibling.id);
        }
      }
      if (key === 'Enter' && cursorAt) {
        event.preventDefault();
        document.getElementById(cursorAt)?.focus();
      }
      if (key === 'KeyD' && cursorAt) {
        event.preventDefault();
        let ele = document.getElementById(cursorAt);
        if (ele) {
          const parent = addParent(ele);
          // @ts-ignore
          updateCursorAt(ele.id);
        }
      }
      if (key === 'KeyM' && cursorAt) {
        event.preventDefault();
        updateMode('Move');
      }
      if (key === 'KeyI' && cursorAt) {
        event.preventDefault();
        updateMode('Insert');
      }
      if (key === 'KeyU' && cursorAt) {
        event.preventDefault();
        updateMode('ColorPicker');
      }
      if (key === 'KeyB' && cursorAt) {
        event.preventDefault();
        updateMode('ColorBucket');
      }
      // if (key === 'KeyC' && cursorAt) {
      //   event.preventDefault();
      //   const ele = document.getElementById(cursorAt);
      //   if (ele) {
      //     console.log(ele.style.backgroundColor);
      //     ele.style.backgroundColor = updateBgColor(ele.style.backgroundColor);
      //     // ele.style.backgroundColor = '#484';
      //     console.log(ele.style.backgroundColor);
      //   }

      // }


    }
    console.log(event.code)
    // event.preventDefault();
  }

  useKey(['KeyA', 'KeyC', 'KeyU', 'KeyB', 'KeyY', 'KeyM', 'KeyI', 'KeyP', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Enter', 'KeyD'], onKeyDownBody);
  // document.addEventListener('keydown', onKeyDownBody);


  const onKeyDown = (event: any) => {
    if (event.code === 'Enter') {
      event.preventDefault();

      const sibling = createNewSibling();
      addSibling(event.target, sibling);
      // event.target.focusout();
      sibling.focus();
    }
    if (event.code === 'Escape') {
      event.preventDefault();
      event.target.blur();
    } else {
      event.target.classList.remove('empty');
    }
    // console.log(document.activeElement);
  };

  return (
    <>
      <div id='commandLine'
        className='cmd'
        contentEditable='true'
        data-placeholder='CMD'
      >

      </div>

      <div id='right-sidebar' className='right-sidebar' ref={rightSidebarRef}>
         {<PropertyPanel styleIdx={styleIdx} styleValueIdx={styleValueIdx} />}
      </div>

      <div id='content-screen' className='content-screen'>
        <div id='content-wrapper' className='content-wrapper'>

          <div id="div" className='kid'>
            <div
              className='kid'
              id='div*0'
              contentEditable="true"
              draggable="false"
              onKeyDown={onKeyDown}
              onFocus={onFocused}
              onClick={onClick}
              onDragStart={onDragStart}
              onDragEnter={onDragEnter}
              onDragExit={onDragExit}
              onDragEnd={onDragEnd}
              data-placeholder='Input'
            >
            </div>
          </div>

        </div>


      </div>
      <button onClick={() => { }}>
        Button
      </button>
      <div id='abc'>
        {
          document.getElementById(cursorAt)?.innerText
        }
      </div>
    </>
  )
}

export default App
