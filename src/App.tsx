import { useArrayState } from 'rooks'
import './App.css'
import { useState } from 'react';
import { useKey } from 'rooks';

type NewChild = {
  prev_id: string,
  current_id: string,
  id: string,
  content: string,
}


function App() {

  const [cursorAt, setCursorAt] = useState<string>('div-0');
  const [cursorFocused, setCursorFocused] = useState<boolean>(false);
  // const [display, setDisplay] = useState<string>('block');

  const updateDisplay = (display: string) => {
    if (display === 'block') {
      return 'inline';
    }
    if (display === 'inline') {
      return 'inline-block';
    }
    if (display === 'inline-block') {
      return 'flex';
    }
    if (display === 'flex') {
      return 'inline-flex';
    }
    if (display === 'inline-flex') {
      return 'grid';
    }
    if (display === 'grid') {
      return 'inline-grid';
    }
    if (display === 'inline-grid') {
      return 'flow-root';
    }
    else {
      return 'block';
    }
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

  const addParent = (ele: HTMLElement) => {
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
    
    let children = parent.children;
    for (let i = 0; i < children.length; i++) {
      const suffix = `div-${i}`;
      const childId = [id, suffix].join(':');
      children[i].setAttribute('id', childId);
    }


  }

  const onKeyDownBody = (event: any) => {
    // event.preventDefault();
    if (!cursorFocused) {
      const key = event.code;
      if (key === 'KeyA' && cursorAt) {
        const id: string | undefined = document.getElementById(cursorAt)?.parentElement?.id;
        if (id) {
          updateCursorAt(id);
        }

      }
      if (key === 'KeyJ' && cursorAt) {
        const id: string | undefined = document.getElementById(cursorAt)?.nextElementSibling?.id;
        if (id) {
          // setCurrFocused(id);
          updateCursorAt(id);
        }
      }
      if (key === 'KeyK' && cursorAt) {
        const id: string | undefined = document.getElementById(cursorAt)?.previousElementSibling?.id;
        if (id) {
          updateCursorAt(id);
        }
      }
      if (key === 'KeyL' && cursorAt) {
        const ele = document.getElementById(cursorAt);
        if (ele) {
          ele.style.display = updateDisplay(ele.style.display);
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
        }
      }


    }
    console.log(event.code)
    // event.preventDefault();
  }

  useKey(['KeyA', 'KeyJ', 'KeyK', 'KeyL', 'Enter', 'KeyD'], onKeyDownBody);
  // document.addEventListener('keydown', onKeyDownBody);


  const onKeyDown = (event: any) => {
    if (event.code === 'Enter') {
      event.preventDefault();
      let child = document.createElement('div');
      child.className = 'kid';
      child.setAttribute('contentEditable', 'true');
      child.setAttribute('data-placeholder', 'Input');

      const id = event.target.id;
      const parts = id.split('-');
      const prefix = parts.slice(0, parts.length - 1).join('-');
      const suffix = Number(parts.at(-1)) + 1;

      child.setAttribute('id', `${prefix}-${suffix}`);

      child.addEventListener('keydown', onKeyDown);
      child.addEventListener('focusin', onFocused);
      child.addEventListener('focusout', onBlur);
      event.target.parentElement.insertBefore(child, event.target.nextSibling);
      // event.target.focusout();
      child.focus();
    }
    if (event.code === 'Escape') {
      event.preventDefault();
      event.target.blur();
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
      <div id="div">
        <div
          className='kid'
          id='div-0'
          contentEditable="true"
          onKeyDown={onKeyDown}
          onFocus={onFocused}
          data-placeholder='Input'
        >
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
