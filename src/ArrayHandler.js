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

const timer = ms => new Promise(res => setTimeout(res, ms))

export class ArrayHandler {
    constructor(arr) {
        this.arr = [];
        for (let i = 0; i < arr.length; i++) {
            this.arr[i] = arr[i];
        }
    }

    // the use state?
    //ye i put 1, 2 in the use state
    change(index, newStyle) {
        this.arr[index] = <div className="dot" key={this.arr[index].key} style={{ ...circleStyles, ...newStyle }} />
    }
    // ...
    // setArray(obj, arr) {
    //     obj.arr = [];
    //     for (let i = 0; i < arr.length; i++) {
    //         obj.arr[i] = arr[i]
    //     }
    //     console.log(obj.arr)
    //     // obj.arr = arr;
    // }

    getArr() {
        return this.arr;
    }

    indexByKey(key) {
        for (let i = 0; i < this.arr.length; i++) {
            if (this.arr[i].key == key) {
                return i;
            }
        }
        return null;
    }
}