import React, { Component } from 'react';
import { GithubPicker } from 'react-color';
import firebase from '@firebase/app';
import '@firebase/firestore';

var config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'pixels-711cc.firebaseapp.com',
  databaseURL: 'https://pixels-711cc.firebaseio.com',
  projectId: 'pixels-711cc',
  storageBucket: 'pixels-711cc.appspot.com',
  messagingSenderId: '121028397546'
};
firebase.initializeApp(config);

const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

const PIXEL_SIZE = 10;

class App extends Component {
  state = {
    pixels: [],
    showPicker: false
  };

  handleColorPicked = color => {
    firebase
      .firestore()
      .collection('pixels')
      .add({
        ...this.state.selectedCoords,
        color: color.hex
      });
    this.setState({
      selectedCoords: null
      // pixels: [
      //   ...this.state.pixels,
      //   {
      //     ...this.state.selectedCoords,
      //     color: color.hex
      //   }
      // ]
    });
  };

  handleClick = event => {
    if (this.state.selectedCoords) {
      this.setState({
        showPicker: false,
        selectedCoords: null
      });
      return;
    }

    this.setState({
      showPicker: true,
      selectedCoords: {
        x: Math.floor(event.clientX / PIXEL_SIZE),
        y: Math.floor(event.clientY / PIXEL_SIZE)
      }
    });
  };

  componentDidMount() {
    firebase
      .firestore()
      .collection('pixels')
      .onSnapshot(collection =>
        this.setState({
          pixels: collection.docs.map(document => document.data())
        })
      );
  }

  render() {
    return (
      <div
        className="pixels"
        onClick={this.handleClick}
        style={{
          position: 'relative',
          height: '100vh',
          width: '100vw',
          cursor: 'pointer'
        }}
      >
        {this.state.pixels.map((pixel, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              width: PIXEL_SIZE,
              height: PIXEL_SIZE,
              top: pixel.y * PIXEL_SIZE,
              left: pixel.x * PIXEL_SIZE,
              backgroundColor: pixel.color
            }}
          />
        ))}
        {this.state.showPicker && (
          <div
            style={{
              position: 'absolute',
              left: this.state.selectedCoords.x * PIXEL_SIZE,
              top: this.state.selectedCoords.y * PIXEL_SIZE
            }}
          >
            <GithubPicker triangle="hide" onChange={this.handleColorPicked} />
          </div>
        )}
      </div>
    );
  }
}

export default App;
