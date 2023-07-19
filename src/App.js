// import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { ArrayHandler } from './ArrayHandler.js';
// import * as ReactDOM from 'react-dom'

function App() {
  const [arr, setArr] = useState([])
  const [dots, setNumDots] = useState(0);
  const [selected, setSelection] = useState(null);
  const [visualizer, setVisualizer] = useState(null);
  const [colorChoice, setChoice] = useState(0);
  const [arrHandler, setArrHandler] = useState(new ArrayHandler([]));
  const circleStyles = {
    width: '30px',
    height: '30px',
    marginRight: '10px',
    display: 'inline-block',
    border: '2px solid black',
    borderRadius: '50%',
    position: 'relative', 
  }

  const showCreateArray = async () => {
    setNumDots((Math.random() * 20) + 1)
    //setNumDots(16)
    //setChoice(6)
    setChoice(Math.floor(Math.random() * 6) + 1);
    let localArr = [];
    for (let i = 0; i < dots; i++) {
      const color = getColor(i, colorChoice);

      let addStyles = {
        backgroundColor: color,
        right: '0px',
      }

      const circle = <div className="dot" key={localArr.length} style={{ ...circleStyles, ...addStyles }}></div>
      localArr.push(circle)
    }

    //const order = [1, 2, 3, 7, 9, 0, 15, 12, 11, 4, 8, 6, 13, 14, 5, 10]
    for (let i = localArr.length - 1; i > 0; i--) {
      //const j = order[i];
      const j = Math.floor(Math.random() * (i + 1));
      [localArr[i], localArr[j]] = [localArr[j], localArr[i]];
    }

    let newHandler = new ArrayHandler(localArr);
    setArrHandler(newHandler)
    setArr(localArr)

    setVisualizer(<div className="dot-container">{localArr}</div>)
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
    if (selected == "selectionSelect") {
      let localArr = arr;

      for (let i = 0; i  < arr.length - 1; i++) {
        // get value to move
        let min = i;
        for (let j  = i + 1; j < arr.length; j++) {
          if (localArr[j].props.style.backgroundColor < localArr[min].props.style.backgroundColor) {
            min = j;
          }
        }

        // define moved styles
        let currentStyle = {
          backgroundColor: localArr[i].props.style.backgroundColor,
          right: parseInt(localArr[i].props.style.right, 10) + (i - min) * 43 + 'px',
          transition: 'right 1s',
        }
        let newMinStyle = {
          backgroundColor: localArr[min].props.style.backgroundColor,
          right: parseInt(localArr[min].props.style.right, 10) + (min - i) * 43 + 'px',
          transition: 'right 1s',
        }

        // push to visualizer
        arrHandler.change(arrHandler.indexByKey(localArr[i].key), currentStyle);
        arrHandler.change(arrHandler.indexByKey(localArr[min].key), newMinStyle);
        setVisualizer(<div className="dot-container">{arrHandler.getArr()}</div>)

        // swap in array
        let temp = localArr[i].key
        localArr[i] = <div className="dot" key={localArr[min].key} style={{ ...circleStyles, ...newMinStyle}} />;
        localArr[min] = <div className="dot" key={temp} style={{ ...circleStyles, ...currentStyle}} />;

        await timer(1000);
      }
    } else if (selected == "insertionSelect") {
      let localArr = arr;
      for (let i = 1; i < arr.length; i++) {
        let key = localArr[i];
        let j = i - 1;

        while (j >= 0 && localArr[j].props.style.backgroundColor > key.props.style.backgroundColor) {
          let previousDotStyle = {
            backgroundColor: localArr[j].props.style.backgroundColor,
            right: parseInt(localArr[j].props.style.right, 10) - 43 + 'px',
            transition: 'right 1s'
          }

          arrHandler.change(arrHandler.indexByKey(localArr[j].key), previousDotStyle);
          setVisualizer(<div className="dot-container">{arrHandler.getArr()}</div>)

          localArr[j + 1] = <div className="dot" key={localArr[j].key} style={{ ...circleStyles, ...previousDotStyle }} />

          j--;
        }

        let originalDotStyle = {
          backgroundColor: key.props.style.backgroundColor,
          right: parseInt(key.props.style.right, 10) + ((i - j - 1) * 43) + 'px',
          transition: 'right 1s'
        }
        arrHandler.change(arrHandler.indexByKey(key.key), originalDotStyle);
        setVisualizer(<div className="dot-container">{arrHandler.getArr()}</div>)

        localArr[j + 1] = <div className="dot" key={key.key} style={{ ...circleStyles, ...originalDotStyle }} />;

        await timer(1000);
      }

      setArr(localArr)
    } else if (selected == "mergeSelect") {
      let localArr = arr;
      setArr(mergeSort(localArr));
    } else if (selected == "bubbleSelect") {
      let localArr = arr;
      let swapped;
      do {
        swapped = false;

        for (let j = 0; j < arr.length - 1; j++) {
          if (localArr[j].props.style.backgroundColor > localArr[j + 1].props.style.backgroundColor) {
            let leftStyle = {
              backgroundColor: localArr[j].props.style.backgroundColor,
              right: parseInt(localArr[j].props.style.right) - 43 + 'px',
              transition: 'right 1s',
            }
            let rightStyle = {
              backgroundColor: localArr[j + 1].props.style.backgroundColor,
              right: parseInt(localArr[j + 1].props.style.right) + 43 + 'px',
              transition: 'right 1s',
            }

            arrHandler.change(arrHandler.indexByKey(localArr[j].key), leftStyle);
            arrHandler.change(arrHandler.indexByKey(localArr[j + 1].key), rightStyle);
            setVisualizer(<div className="dot-container">{arrHandler.getArr()}</div>)

            let temp = localArr[j].key
            localArr[j] = <div className="dot" key={localArr[j + 1].key} style={{ ...circleStyles, ...rightStyle }} />;
            localArr[j + 1] = <div className="dot" key={temp} style={{ ...circleStyles, ...leftStyle }} />

            swapped = true;
            await timer(200);
          }
        }
      } while (swapped);

      setArr(localArr)
    } else if (selected == "heapSelect") {
      var localArr = arr;
      let N = arr.length;

      // build heap
      for (let i = Math.floor(N / 2) - 1; i >= 0; i--) {
        heapify(localArr, N, i);
      }

      // extract elements
      for (let i = N - 1; i > 0; i--) {
        // move current root to end
        let leftStyle = {
          backgroundColor: localArr[0].props.style.backgroundColor,
          right: (parseInt(localArr[0].props.style.right, 10) - (i * 43)) + 'px',
          transition: 'right 1s',
        }
        let rightStyle = {
          backgroundColor: localArr[i].props.style.backgroundColor,
          right: (parseInt(localArr[i].props.style.right, 10) + (i * 43)) + 'px',
          transition: 'right 1s',
        }
        
        arrHandler.change(arrHandler.indexByKey(localArr[0].key), leftStyle);
        arrHandler.change(arrHandler.indexByKey(localArr[i].key), rightStyle);
        
        let temp = localArr[0].key;
        localArr[0] = <div className="dot" key={localArr[i].key} style={{ ...circleStyles, ...rightStyle }} />;
        localArr[i] = <div className="dot" key={temp} style={{ ...circleStyles, ...leftStyle }} />;
    
        await timer(1000);
        // max heap?
        heapify(localArr, i, 0);
      }
    }
  }

  async function heapify(localArr, N, i) {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    // if left is larger than root
    if (l < N && localArr[l].props.style.backgroundColor > localArr[largest].props.style.backgroundColor)
      largest = l;
    
    // if right child is larger than largest so far
    if (r < N && localArr[r].props.style.backgroundColor > localArr[largest].props.style.backgroundColor)
      largest = r;
    
    if (largest != i) {
      let newStyle = {
        backgroundColor: localArr[i].props.style.backgroundColor,
        right: (parseInt(localArr[i].props.style.right, 10) + ((i - largest) * 43)) + 'px',
        transition: 'right 1s',
      }
      let largestStyle = {
        backgroundColor: localArr[largest].props.style.backgroundColor,
        right: (parseInt(localArr[largest].props.style.right, 10) + ((largest - i) * 43)) + 'px',
        transition: 'right 1s',
      }

      arrHandler.change(arrHandler.indexByKey(localArr[i].key), newStyle);
      arrHandler.change(arrHandler.indexByKey(localArr[largest].key), largestStyle);
      setVisualizer(<div className="dot-container">{arrHandler.getArr()}</div>)

      let temp = localArr[i].key;
      localArr[i] = <div className="dot" key={localArr[largest].key} style={{ ...circleStyles, ...largestStyle }} />;
      localArr[largest] = <div className="dot" key={temp} style={{ ...circleStyles, ...newStyle }} />;
      
      heapify(localArr, N, largest);
    }
  }

  async function mergeSort(arr) {
    // Base case
    if (arr.length <= 1) return arr
    let mid = Math.floor(arr.length / 2)
    // Recursive calls
    let leftArr = [];
    for (let i = 0; i < mid; i++) {
      leftArr.push(arr[i])
    }
    let left = await mergeSort(leftArr)
    let rightArr = [];
    for (let i = mid; i < arr.length; i++) {
      rightArr.push(arr[i])
    }
    let right = await mergeSort(rightArr)

    await timer(500)

    return merge(left, right)
  }

  function getIndexByKey(arr, key) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].key == key) {
          return i;
      }
    }
    return null;
  }

  function getPrintArray(arr) {
    let printableArray = [];

    for (let i = 0; i < arr.length; i++) {
      printableArray.push(arr[i].key + " : [" + arr[i].props.style.right + ", " + arr[i].props.style.backgroundColor + "]")
    }

    return printableArray;
  }

  function merge(left, right) {
    let sortedArr = []

    let fullArr = [...left,...right]

    while (left.length && right.length) {
      if (left[0].props.style.backgroundColor < right[0].props.style.backgroundColor) {
        let originalIndex = getIndexByKey(fullArr, left[0].key);

        let tempStyle = {
          backgroundColor: left[0].props.style.backgroundColor,
          right: (parseInt(left[0].props.style.right, 10) + ((originalIndex - sortedArr.length) * 43)) + 'px',
          transition: 'right 1s',
        }
        
        arrHandler.change(arrHandler.indexByKey(left[0].key), tempStyle);
        setVisualizer(<div className="dot-container">{arrHandler.getArr()}</div>)
     
        left[0] = <div className="dot" key={left[0].key} style={{ ...circleStyles, ...tempStyle }} />

        sortedArr.push(left.shift());
      } else {
        let originalIndex = getIndexByKey(fullArr, right[0].key);

        let tempStyle = {
          backgroundColor: right[0].props.style.backgroundColor,
          right: parseInt(right[0].props.style.right, 10) + ((originalIndex - sortedArr.length) * 43) + 'px',
          transition: 'right 1s',
        }

        arrHandler.change(arrHandler.indexByKey(right[0].key), tempStyle);
        setVisualizer(<div className="dot-container">{arrHandler.getArr()}</div>)

        right[0] = <div className="dot" key={right[0].key} style={{ ...circleStyles, ...tempStyle }} />
        
        sortedArr.push(right.shift())
      }
    }

    while (left.length) {
      let originalIndex = getIndexByKey(fullArr, left[0].key);

      let tempStyle = {
        backgroundColor: left[0].props.style.backgroundColor,
        right: (parseInt(left[0].props.style.right, 10) + ((originalIndex - sortedArr.length) * 43)) + 'px',
      }
        
      arrHandler.change(arrHandler.indexByKey(left[0].key), tempStyle);
      setVisualizer(<div className="dot-container">{arrHandler.getArr()}</div>)
     
      left[0] = <div className="dot" key={left[0].key} style={{ ...circleStyles, ...tempStyle }} />

      sortedArr.push(left.shift());
    }

    while (right.length) {
      let originalIndex = getIndexByKey(fullArr, right[0].key);

      let tempStyle = {
        backgroundColor: right[0].props.style.backgroundColor,
        right: (parseInt(right[0].props.style.right, 10) + ((originalIndex - sortedArr.length) * 43)) + 'px',
      }
      
      arrHandler.change(arrHandler.indexByKey(right[0].key), tempStyle);
      setVisualizer(<div className="dot-container">{arrHandler.getArr()}</div>)
     
      left[0] = <div className="dot" key={right[0].key} style={{ ...circleStyles, ...tempStyle }} />

      sortedArr.push(right.shift());
    }
    
    return sortedArr
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
          <option value="heapSelect">Heap Sort</option>
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