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
  const [arrHandler, setArrHandler] = useState(new ArrayHandler([1, 2]));
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
    setNumDots((Math.random() * 3) + 1)
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

  const animateDot = async (index, newStyle, localArr) => {
    setArr((localArr) => {
      const updatedArr = [...localArr];
      updatedArr[index] = (
        <div
          className="dot animated"
          key={index}
          style={{ ...circleStyles, ...newStyle }}
        />
      );
      return updatedArr; // my merge moves ... but not in the right way i think?
    });
    //
    await timer(1000)

    setArr((localArr) => {
      const updatedArr = [...localArr];
      updatedArr[index] = (
        <div className="dot" key={index} style={{ ...circleStyles, ...newStyle }} />
      );
      return updatedArr;
    });
  }

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
          backgroundColor: localArr[i].props.style.backgroundColor,
          right: localArr[i].props.style.right + (i - min) * 35 + 'px',
        }
        let tempStyle = {
          backgroundColor: localArr[min].props.style.backgroundColor,
          right: localArr[min].props.style.right + (min - i) * 35 + 'px',
        }

        localArr[i] = <div className="dot" key={i} style={{ ...circleStyles, ...newStyle }} />
        localArr[min] = <div className="dot" key={min} style={{ ...circleStyles, ...tempStyle }} />

        setVisualizer(<div className="dot-container">{localArr}</div>)

        animateDot(i, newStyle, localArr)
        animateDot(min, tempStyle, localArr)

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
            backgroundColor: localArr[j + 1].props.style.backgroundColor,
            right: localArr[j + 1].props.style.right + 35 + 'px',
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
              backgroundColor: localArr[j].props.style.backgroundColor,
              right: localArr[j].props.style.right + 35 + 'px',
            }
            let tempStyle = {
              backgroundColor: localArr[j + 1].props.style.backgroundColor,
              right: localArr[j + 1].props.style.right - 35 + 'px',
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

  function merge(left, right) {
    let sortedArr = [] // the sorted items will go here
    let rightCounter = 0; //that's what i was gonna ask u LOLLLL
    let leftCounter = 0; // do you know if + or - right moves it right?
    let rightLength = right.length;
    let leftLength = left.length;

    while (left.length && right.length) {
      // Insert the smallest item into sortedArr
      if (left[0].props.style.backgroundColor < right[0].props.style.backgroundColor) {
        //let l = left.shift(); 
        let tempStyle = {
          backgroundColor: left[0].props.style.backgroundColor,
          right: (parseInt(left[0].props.style.right, 10) + ((-(rightLength + leftCounter) * 43) + (sortedArr.length * 43))) + 'px',
    
        }
        arrHandler.change(arrHandler.indexByKey(left[0].key), tempStyle);
        setVisualizer(<div className="dot-container">{arrHandler.getArr()}</div>)
     
        leftCounter++;
        sortedArr.push(left.shift());

        // sortedArr[sortedArr.length - 1] = <div className="dot" key={sortedArr[sortedArr.length - 1].key} style={{ ...circleStyles, ...tempStyle }} />
      } else {
        // okie
        // u should do robotics next week
        let tempStyle = {
          backgroundColor: right[0].props.style.backgroundColor,
          right: parseInt(right[0].props.style.right, 10) + (((leftLength + rightCounter) * 43) - (sortedArr.length * 43)) + 'px',
          // right: right[0].props.style.right - (43 * (rightLength - rightCounter)) + 'px',
        }
        arrHandler.change(arrHandler.indexByKey(right[0].key), tempStyle);
        setVisualizer(<div className="dot-container">{arrHandler.getArr()}</div>)

        rightCounter++;
        sortedArr.push(right.shift())
        // sortedArr[sortedArr.length - 1] = <div className="dot" key={sortedArr[sortedArr.length - 1].key} style={{ ...circleStyles, ...tempStyle }} />
      }
    }
    
    return [...sortedArr, ...left, ...right]
  }

  // function mergeSort(a, n) {
  //   if (n < 2) {
  //     return;
  //   }

  //   let mid = n / 2;

  //   let leftArr = [];
  //   let rightArr = [];

  //   for (let i = 0; i < mid; i++) {
  //     leftArr[i] = a[i];
  //   }

  //   for (let i = mid; i < n; i++) {
  //     rightArr[i - mid] = a[i];
  //   }

  //   mergeSort(leftArr, mid);
  //   mergeSort(rightArr, n - mid);

  //   merge(a, leftArr, rightArr, mid, n - mid);
  // }

  // function merge(a, l, r, left, right) {
  //   let i = 0;
  //   let j = 0;
  //   let k = 0;

  //   while (i < left && j < right) {
  //     if (l[i].props.style.backgroundColor < r[j].props.style.backgroundColor) {
  //       a[k++] = l[i++];
  //     }
  //     else {
  //       a[k++] = r[j++];
  //     }
  //   }
  //   while (i < left) {
  //     a[k++] = l[i++];
  //   }
  //   while (j < right) {
  //     a[k++] = r[j++];
  //   }
  //   // return a;
  // }



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
