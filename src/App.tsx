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
  
  const [cursorAt, setCursorAt] = useState<string>('div-0-0');
  
  const updateCursorAt = (id: string) => {
    document.getElementById(cursorAt)?.classList.remove('focused');
    setCursorAt(id);
    document.getElementById(id)?.classList.add('focused');
  }
  
  const onKeyDownBody = (event: any) => {
    // event.preventDefault();
    const key = event.code;
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
    if (key === 'Enter' && cursorAt) {
      event.preventDefault();
      document.getElementById(cursorAt)?.focus();
    }

      // console.log(event.code)
    // event.preventDefault();
  }

  useKey(['KeyJ', 'KeyK', 'Enter'], onKeyDownBody);
  // document.addEventListener('keydown', onKeyDownBody);
  
  const onFocused = (event: any) => {
    setCursorAt(event.target.id)
  }
  

  const onKeyDown = (event: any) => {
    if (event.code === 'Enter') {
      event.preventDefault();
      let child = document.createElement('div');
      child.className = 'kid';
      child.setAttribute('contentEditable', 'true');
      child.setAttribute('data-placeholder', 'Input');

      const id = event.target.id;
      const parts = id.split('-');
      const prefix = parts.slice(0,parts.length - 1).join('-');
      const suffix = Number(parts.at(-1)) + 1;

      child.setAttribute('id', `${prefix}-${suffix}`);
      
      child.addEventListener('keydown', onKeyDown);
      child.addEventListener('focusin', onFocused);
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
      <div id="div-0">
        <div 
        className='kid' 
        id='div-0-0' 
        contentEditable="true" 
        onKeyDown={onKeyDown}
        onFocus={onFocused}
        data-placeholder='Input'
        > 
        </div>
      </div>
      <button onClick={() => {}}>
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
