import { useArrayState } from 'rooks'
import './App.css'

type NewChild = {
  prev_id: string,
  current_id: string,
  id: string,
  content: string,
}


function App() {
  const [children, controls] = useArrayState<NewChild>([
    {
      prev_id: 'div-0',
      current_id: '0',
      id: 'div-0-0',
      content: 'ABC',
    }
  ]);
  
  const onKeyDown = (event: any) => {
        if (event.code === 'Enter') {
          event.preventDefault();
          controls.push({
            prev_id: event.target.id, 
            current_id: '0',
            id: `${event.target.id}-0`,
            content: ''
          });
        }
        // console.log(key.target);
      };

  return (
    <div id="div-0">
      {children.map((child, i) =>
        <div className='kid' id={`${child.prev_id}-${i + 1}`} contentEditable="true" onKeyDown={onKeyDown}>
          {child.content}
        </div>
      )
      }
    </div>
  )
}

export default App
