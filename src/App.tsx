import { useArrayState } from 'rooks'
import './App.css'
import { useRef, useState } from 'react';
import { useKey } from 'rooks';
import { PropertyPanel,  propertiesMeta } from './PropertySidebar'
import { addSibling, createNewSibling, onClick, onDragEnd, onDragEnter, onDragExit, onDragStart, onFocused, updateAttribute, } from './content/utils';
import { onKeyDownBody } from './keyNav';


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

  const updateCursorAt = (id: string) => {
    document.getElementById(cursorAt)?.classList.remove('focused');
    setCursorAt(id);
    document.getElementById(id)?.classList.add('focused');
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
  
  const KeyDownBodyProps = {
        cursorFocused,
        setCursorFocused,
        cursorAt,
        setCursorAt,
        updateCursorAt,
        styleIdx,
        setStyleIdx,
        styleValueIdx,
        cursorIn,
        setCursorIn,
        register,
        updateMode,
        styleValueIdxControls,
    };

  useKey(['KeyA', 'KeyC', 'KeyU', 'KeyB', 'KeyY', 'KeyM', 'KeyI', 'KeyP', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Enter', 'KeyD'], (event) => onKeyDownBody(event, KeyDownBodyProps));
  // document.addEventListener('keydown', onKeyDownBody);


  const onKeyDown = (event: any) => {
    if (event.code === 'Enter') {
      event.preventDefault();

      const sibling = createNewSibling(setCursorAt, setCursorFocused, mode, colorRegister, setColorRegister, onKeyDown);
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
              onFocus={(event) => onFocused(event, setCursorAt, setCursorFocused)}
              onClick={(event) => onClick(event, mode, colorRegister, setColorRegister)}
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
