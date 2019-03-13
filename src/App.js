import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIg from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import './App.css';


const particlesOptions = {
  "particles": {
    "number": { 
        "value": 100
    },
    "size": {
        "value": 3
    }
  } 
};

const initialState = {
  input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',        
        entries: 0,
        joined: ''
      }
}

class App extends Component {

  constructor() {
    super();
    this.state = initialState;
  }
  

  /*componentDidMount() { //aqui foi para testar se o localhost estava respondendo
    fetch('http://localhost:3000')
      .then(response => response.json())
      .then(data => console.log(data));
  }*/

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }});
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;    
    const image = document.getElementById('inputimage');
    const width = (image.clientWidth);
    const heigth = (image.clientHeight);
    /*console.log(clarifaiFace);
    console.log(image);
    console.log('largura',width,'altura',heigth);*/
    return {
      //aqui faz o calculo das "bordas" para pegar os rostos na foto!
      leftCol   : clarifaiFace.left_col * width,
      topRow    : clarifaiFace.top_row * heigth,
      rightCol  : width - (clarifaiFace.right_col * width),
      bottomRow : heigth - (clarifaiFace.bottom_row * heigth)
    };
  };

  displayFaceBox = (box) => {    
    this.setState({box:box});    
  }

  //pega o valor do textfield e guarda no this.state.input
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    
    fetch('https://evening-journey-21143.herokuapp.com/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    //recupera as regioes detectadas das faces nas fotos
    .then( response => {
      if(response) {
        fetch('https://evening-journey-21143.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count }));
          })
          .catch(console.log());
      };
      this.displayFaceBox( this.calculateFaceLocation(response) ) })
    .catch( err => console.log(err) )     
  };

  onRouteChange = (route) => {    
    if( route === 'signout' ) {      
      this.setState(initialState);
    } else if( route === 'home') {      
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route, box} = this.state; //destructing
    return (
      <div className="App">
        <Particles params={particlesOptions} className='particles'/>        
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home' 
          ? <div>  
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}          
              />  
              <FaceRecognition box={box} imageUrl={imageUrl}/>
            </div>
          : ( 
              route === 'signin'
              ? <SignIg loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>             
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }  
      </div>
    );
  }
}

export default App;
