/**
 * 之后的功能， 采用React来实现。
 * 在这里引用新的功能， 之前早起的功能， 可以重写一下
 */
import React, { Component } from 'react';

class Demo extends Component {
  constructor(props) {
    super(props);
    console.log('constructor')
  }
  handleClick() {
    alert('xxxx')
  }
  render() {
    return (
      <div>
        <h1>This is a Demo</h1>
        <button onClick={this.handleClick}>这个是 一个按钮</button>
      </div>
    )
  }
}


var div = document.createElement('div')
document.body.appendChild(div)
ReactDOM.render(<Demo />, div)


