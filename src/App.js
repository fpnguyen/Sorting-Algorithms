// import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
// import * as ReactDOM from 'react-dom'

function App() {
  const [arr, setArr] = useState([])
  const [dots, setNumDots] = useState(0);
  const [selected, setSelection] = useState(null);
  const [visualizer, setVisualizer] = useState(null);
  const [colorChoice, setChoice] = useState(0);
  const circleStyles = {
    width: '30px',
    height: '30px',
    marginRight: '10px',
    display: 'inline-block',
    // marginBottom: '0px',
    border: '2px solid black',
    borderRadius: '50%',
    position: 'relative',
    
  }

  const showCreateArray = () => {
    setNumDots((Math.random() * 25) + 1)
    // setNumDots(16)
    setChoice(Math.floor(Math.random() * 6) + 1);
    let localArr = [];
    for (let i = 0; i < dots; i++) {
      const color = getColor(i, colorChoice);

      let addStyles = {
        backgroundColor: color,
        // left: '0px',
        // top: '0px',
        right: '0px',
        // bottom: '0px',
      }
      

      const circle = <div className="dot" style={{...circleStyles, ...addStyles}}></div>
      localArr.push(circle)
    }
    for (let i = localArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [localArr[i], localArr[j]] = [localArr[j], localArr[i]];
    }

    setArr(localArr)

    setVisualizer(<div className="dot-container">{localArr}</div>)
    // return <div className="dot-container">{arr}</div>;
  }

  function getColor(i, choice) {
    // const letters = '0123456789ABCDEF';
    // let color = '#';
    // for (let i = 0; i < 6; i++) {
    //   color += letters[Math.floor(Math.random() * 16)];
    // }
    let red = '00';
    let green = '00';
    let blue = '00';
    let color = '#';
    let colorChange = i * Math.round(255 / (dots + 1));
    if (colorChange < 16) {
      colorChange = '0' + colorChange.toString(16);
    } else if (colorChange == 0) {
      colorChange = '00';
    } else {
      colorChange = colorChange.toString(16);
    }
    if (choice == 1) {
      red = 'FF';
      blue = colorChange;
    } else if (choice == 2) {
      red = colorChange;
      blue = 'FF';
    } else if (choice == 3) {
      green = colorChange;
      blue = 'FF';
    } else if (choice == 4) {
      green = 'FF';
      blue = colorChange;
    } else if (choice == 5) {
      red = colorChange;
      green = 'FF';
    } else if (choice == 6) {
      red = 'FF';
      green = colorChange;
    }
    color += red;
    color += green;
    color += blue; 
    return color;
  }

  const handleSortChange = (event) => {
    setSelection(event.target.value);
  }

  const timer = ms => new Promise(res => setTimeout(res, ms))

  const startSort = async () => {
    let localArr = arr;
    if (selected == "selectionSelect") {
      for (let i = 0; i < arr.length - 1; i++) {
        let min = i;
        for (let j = i + 1; j < arr.length; j++) {

          if (localArr[j].props.style.backgroundColor < localArr[min].props.style.backgroundColor) {
            min = j;
          }
        }

        let newStyle =  {
          backgroundColor: localArr[i].props.style.backgroundColor,
          right: localArr[i].props.style.right + (i - min)*35 +'px',
        }
        let tempStyle =  {
          backgroundColor: localArr[min].props.style.backgroundColor,
          right: localArr[min].props.style.right + (min - i)*35 +'px',
        }
      
        localArr[i] = <div className="dot" style={{...circleStyles, ...newStyle}}/>
        localArr[min] = <div className="dot" style={{...circleStyles, ...tempStyle}}/>
  
        setVisualizer(<div className="dot-container">{localArr}</div>) 
        
        let temp = localArr[i];
        localArr[i] = localArr[min];
        localArr[min] = temp;
        
        await timer(1000);
      }
      setArr(localArr)
      // setVisualizer(<div style={{backgroundColor: '#bbb'}}>{localArr}</div>)
    } else if (selected == "insertionSelect") {
      for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j].props.style.backgroundColor > key.props.style.backgroundColor) {
          arr[j + 1] = arr[j];
          j--;
        }
        arr[j + 1] = key;
      }
      
    } else if (selected == "mergeSelect") {
      mergeSort(arr, arr.length);
    } else if (selected == "bubbleSelect") {
      for (let i = 0; i < arr.length - 1; i++) {
        let swapped = false;
        for (let j = 0; j < arr.length - i - 1; j++) { ///right here what is size?
          if (arr[j].props.style.backgroundColor > arr[j + 1].props.style.backgroundColor) {
            let temp = arr[i];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;

            swapped = true;
          }
        }
        if (!swapped) {
          break;
        }
      }
    }
  }

  function mergeSort(a, n) {
    if (n < 2) {
      return;
    }

    let mid = n / 2;

    let leftArr = [mid];
    let rightArr = [n - mid];

    for (let i = 0; i < mid; i++) {
      leftArr[i] = a[i];
    }

    for (let i = mid; i < n; i++) {
      rightArr[i - mid] = a[i];
    }

    mergeSort(leftArr, mid);
    mergeSort(rightArr, n - mid);

    merge(a, leftArr, rightArr, mid, n - mid);
  }

  function merge(a, l, r, left, right) {
    let i = 0;
    let j = 0;
    let k = 0;
    while (i < left && j < right) {
      if (l[i].props.style.backgroundColor <= r[j].props.style.backgroundColor) {
        a[k++] = l[i++];
      }
      else {
        a[k++] = r[j++];
      }
    }
    while (i < left) {
      a[k++] = l[i++];
    }
    while (j < right) {
      a[k++] = r[j++];
    }
  }



  return (
    <div className="App">
      <div className="selection">
        <button onClick={() => showCreateArray()} className="newArray">Create New Array</button>
        <select className="sortType" onChange={handleSortChange}>
          <option disabled selected value>-- Select an algorithm --</option>
          <option value="selectionSelect">Selection Sort</option>
          <option value="insertionSelect">Insertion Sort</option>
          <option value="mergeSelect">Merge Sort</option>
          <option value="bubbleSelect">Bubble Sort</option>
        </select>
        <button onClick={() => startSort()} className="start">Start</button>
      </div>
      <div className="visualizer">
        {visualizer}
      </div>
    </div>
  );
}

export default App;
