import React from 'react';
import { StyleSheet, Text, View, Button, Dimensions } from 'react-native';
import Axios from 'axios';
import { createStackNavigator, createAppContainer } from "react-navigation";
import Jogar from './Jogar';
import Loader from './Components/Loader';
 class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      address: ''
    }
  }

  handlePega = async() => {

    try{
      let response = await Axios.get('https://backendinglesfap.herokuapp.com/api/pegar');
      if(response.status > 400){
        return {};
      } else {  
        return await response.data;
      }
    } catch(e) {
      return {};
    }
  };

  async getCoordinates() {
    this.setState({
      loading: true
    });

    let coords = await this.handlePega();

    await  this.setState({
      loading: false,
    });

    this.props.navigation.navigate('Jogar', {
        data: coords
      });
  };

  render() {
    return (
      <View style={styles.container}>
      <Loader
          loading={this.state.loading} />
        <Text>Teste</Text>
        <Text>Loko</Text>
        <Button title="API" onPress={() => this.getCoordinates()}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const AppNavigator = createStackNavigator(
  {
      Home: App,
      Jogar: Jogar
  },
  {
    initialRouteName: "Home"
  }
);

export default createAppContainer(AppNavigator);
