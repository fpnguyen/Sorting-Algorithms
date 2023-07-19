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
    // marginBottom: '0px',
    border: '2px solid black',
    borderRadius: '50%',
    position: 'relative',

  }

  const showCreateArray = async () => {
    setNumDots((Math.random() * 20) + 1)
    //setNumDots(16)
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


      const circle = <div className="dot" key={localArr.length} style={{ ...circleStyles, ...addStyles }}></div>
      localArr.push(circle)
    }

    for (let i = localArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [localArr[i], localArr[j]] = [localArr[j], localArr[i]];
    }
    console.log(localArr)
    let newHandler = new ArrayHandler(localArr);
    setArrHandler(newHandler)
    console.log(arrHandler)
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
    console.log(arrHandler)// its back to 0 here
    if (selected == "selectionSelect") {
      let localArr = arr;
      for (let i = 0; i < arr.length - 1; i++) {
        let min = i;
        for (let j = i + 1; j < arr.length; j++) {

          if (localArr[j].props.style.backgroundColor < localArr[min].props.style.backgroundColor) {
            min = j;
          }
        }

        let newStyle = {
          transition: 'right 1s',
          backgroundColor: localArr[i].props.style.backgroundColor,
          right: (parseInt(localArr[i].props.style.right, 10) + (i - min) * 44) + 'px',
        }
        let tempStyle = {
          transition: 'right 1s',
          backgroundColor: localArr[min].props.style.backgroundColor,
          right: (parseInt(localArr[min].props.style.right, 10) + (min - i) * 44) + 'px',
        }

        localArr[i] = <div className="dot" key={i} style={{ ...circleStyles, ...newStyle }} />
        localArr[min] = <div className="dot" key={min} style={{ ...circleStyles, ...tempStyle }} />

        setVisualizer(<div className="dot-container">{localArr}</div>)

        let temp = localArr[i];
        localArr[i] = localArr[min];
        localArr[min] = temp;

        await timer(1000);
      }
      setArr(localArr)
      // setVisualizer(<div style={{backgroundColor: '#bbb'}}>{localArr}</div>)
    } else if (selected == "insertionSelect") {
      let localArr = arr;
      for (let i = 1; i < arr.length; i++) {
        let key = localArr[i];
        let j = i - 1;

        while (j >= 0 && localArr[j].props.style.backgroundColor > key.props.style.backgroundColor) {
          localArr[j + 1] = localArr[j];

          let tempStyle = {
            transition: 'right 1s',
            backgroundColor: localArr[j + 1].props.style.backgroundColor,
            right: (parseInt(localArr[j + 1].props.style.right, 10) + 44) + 'px',
          }
          localArr[j + 1] = <div className="dot" key={localArr[j + 1].key} style={{ ...circleStyles, ...tempStyle }} />

          setVisualizer(<div className="dot-container">{localArr}</div>)
          j--;
        }

        localArr[j + 1] = key;

        await timer(1000);
      }

      setArr(localArr)
    } else if (selected == "mergeSelect") {
      let localArr = arr;
      console.log(arrHandler)
      setArr(mergeSort(localArr));
    } else if (selected == "bubbleSelect") {
      let localArr = arr;
      let swapped;
      do {
        swapped = false;

        for (let j = 0; j < arr.length - 1; j++) {
          if (localArr[j].props.style.backgroundColor > localArr[j + 1].props.style.backgroundColor) {
            let newStyle = {
              transition: 'right 1s',
              backgroundColor: localArr[j].props.style.backgroundColor,
              right: (parseInt(localArr[j].props.style.right, 10) + 44) + 'px',
              // position: 'absolute',
            }
            let tempStyle = {
              transition: 'right 1s',
              backgroundColor: localArr[j + 1].props.style.backgroundColor,
              right: (parseInt(localArr[j + 1].props.style.right, 10) - 44) + 'px',
              // position: 'absolute',
            }
            localArr[j] = <div className="dot" key={localArr[j].key} style={{ ...circleStyles, ...newStyle }} />
            localArr[j + 1] = <div className="dot" key={localArr[j + 1].key} style={{ ...circleStyles, ...tempStyle }} />

            setVisualizer(<div className="dot-container">{localArr}</div>)
            let temp = localArr[j];
            localArr[j] = localArr[j + 1];
            localArr[j + 1] = temp;

            swapped = true;
            await timer(200);
          }
        }
      } while (swapped);

      setArr(localArr)
    }
  }

  function mergeSort(arr) {
    // Base case
    if (arr.length <= 1) return arr
    let mid = Math.floor(arr.length / 2)
    // Recursive calls
    let leftArr = [];
    for (let i = 0; i < mid; i++) {
      leftArr.push(arr[i])
    }
    let left = mergeSort(leftArr)
    let rightArr = [];
    for (let i = mid; i < arr.length; i++) {
      rightArr.push(arr[i])
    }
    let right = mergeSort(rightArr)
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
    console.log(getPrintArray(fullArr))

    while (left.length && right.length) {
      if (left[0].props.style.backgroundColor < right[0].props.style.backgroundColor) {
        let originalIndex = getIndexByKey(fullArr, left[0].key);

        let tempStyle = {
          transition: 'right 1s',
          backgroundColor: left[0].props.style.backgroundColor,
          right: (parseInt(left[0].props.style.right, 10) + ((originalIndex - sortedArr.length) * 44)) + 'px',
        }
        
        console.log(left[0].key + " : " + originalIndex  + " - " + sortedArr.length)

        arrHandler.change(arrHandler.indexByKey(left[0].key), tempStyle);
        setVisualizer(<div className="dot-container">{arrHandler.getArr()}</div>)
     
        left[0] = <div className="dot" key={left[0].key} style={{ ...circleStyles, ...tempStyle }} />

        sortedArr.push(left.shift());
      } else {
        let originalIndex = getIndexByKey(fullArr, right[0].key);

        let tempStyle = {
          transition: 'right 1s',
          backgroundColor: right[0].props.style.backgroundColor,
          right: parseInt(right[0].props.style.right, 10) + ((originalIndex - sortedArr.length) * 44) + 'px',
        }

        console.log(right[0].key + " : " + originalIndex  + " - " + sortedArr.length)

        arrHandler.change(arrHandler.indexByKey(right[0].key), tempStyle);
        setVisualizer(<div className="dot-container">{arrHandler.getArr()}</div>)

        right[0] = <div className="dot" key={right[0].key} style={{ ...circleStyles, ...tempStyle }} />
        
        sortedArr.push(right.shift())
      }
    }

    console.log(getPrintArray([...sortedArr, ...left, ...right]))

    while (left.length) {
      let originalIndex = getIndexByKey(fullArr, left[0].key);

      let tempStyle = {
        transition: 'right 1s',
        backgroundColor: left[0].props.style.backgroundColor,
        right: (parseInt(left[0].props.style.right, 10) + ((originalIndex - sortedArr.length) * 44)) + 'px',
      }
        
      console.log(left[0].key + " : " + originalIndex  + " - " + sortedArr.length)

      arrHandler.change(arrHandler.indexByKey(left[0].key), tempStyle);
      setVisualizer(<div className="dot-container">{arrHandler.getArr()}</div>)
     
      left[0] = <div className="dot" key={left[0].key} style={{ ...circleStyles, ...tempStyle }} />

      sortedArr.push(left.shift());
    }

    while (right.length) {
      let originalIndex = getIndexByKey(fullArr, right[0].key);

      let tempStyle = {
        transition: 'right 1s',
        backgroundColor: right[0].props.style.backgroundColor,
        right: (parseInt(right[0].props.style.right, 10) + ((originalIndex - sortedArr.length) * 44)) + 'px',
      }
        
      console.log(right[0].key + " : " + originalIndex  + " - " + sortedArr.length)

      arrHandler.change(arrHandler.indexByKey(right[0].key), tempStyle);
      setVisualizer(<div className="dot-container">{arrHandler.getArr()}</div>)
     
      left[0] = <div className="dot" key={right[0].key} style={{ ...circleStyles, ...tempStyle }} />

      sortedArr.push(right.shift());
    }

    console.log(getPrintArray(sortedArr))
    
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
