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

    const reindex = (parent: Element) => {

      let children = parent.children;
      for (let i = 0; i < children.length; i++) {
        const suffix = `${i}`;
        const childId = [parent.id, suffix].join(':');
        children[i].setAttribute('id', childId);
        reindex(children[i]);
      }
    }

    reindex(parent);

  }
  
  const addSibling = (target: Element) => {
      let child = document.createElement('div');
      child.className = 'kid';
      child.setAttribute('contentEditable', 'true');
      child.setAttribute('data-placeholder', 'Input');

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
      else if ( id.length < nextElementId.length ) {
        const posLastColon = nextElementId.lastIndexOf(':');
        const posLastHyphen = nextElementId.lastIndexOf('*');
        const posLast = Math.max(posLastColon, posLastHyphen);
        const prefix = nextElementId.slice(0, posLast + 1);
        const suffix = Number(nextElementId.slice(posLast + 1, nextElementId.length)) - 1;
        id2 = `${prefix}${suffix}`;
      }
      else if ( id.length === nextElementId.length ) {
        id2 = `${id}*${0}`;
      } else {
        alert('Error in onKeyDown, could not calculate id, given conditions were not met')
      }

      child.setAttribute('id', id2);

      child.addEventListener('keydown', onKeyDown);
      child.addEventListener('focusin', onFocused);
      child.addEventListener('focusout', onBlur);
      return child;
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
          addParent(ele);
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
      
      const child = addSibling(event.target);
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
          id='div*0'
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
