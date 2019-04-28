import React from 'react';
import { StyleSheet, Text, View, Button, Modal, TextInput } from 'react-native';
import TimerCountdown from "react-native-timer-countdown";
import Loader from './Components/Loader';
import Axios from 'axios';
import { set } from 'react-native/Libraries/Utilities/Dimensions';

export default class Jogar extends React.Component {

  constructor(props) {
      super(props);

      this.state = {
          loading: false,
          data: [],
          url: 'https://backendinglesfap.herokuapp.com/api/pegar',
          palavraCerta: [],
          palavras: [],
          numeroCerto: 0,
          tentativa: 0,
          time: 45,
          pontos: 0,
          nome: "Sem Nome",
          modalVisible: false
      }
  }

  componentDidMount = async() => {
    //
    let {  data  } = this.props.navigation.state.params;
    //alert(JSON.stringify(data));
    //alert(JSON.stringify(palavra1.palavra));
    await this.setState({data, tentativa: 0 });
    await this.jogar();
    
  };

  jogar = async() => {
    let tentativa = this.state.tentativa;
    let palavras = [];
    let palavraCerta = this.state.data[tentativa];
    do{
        palavras.push(this.state.data[tentativa]);
        tentativa++;
    }while(tentativa % 5 !== 0);
    
    await this.setState({
      palavras,
      palavraCerta,
      tentativa,
      time: 45
    });
      //await this.getCoordinates();
    
  };

  tentar = async(escolha) => {
    if(this.state.palavraCerta.id === escolha){
      await this.setState({pontos: this.state.pontos + 5})
      
    }else {
      this.setState({modalVisible: true})
    }

    if(this.state.pontos > 99){
      this.setState({modalVisible: true})
    }

    this.jogar();
  }

   getCoordinates = async() => {
    this.setState({
      loading: true,
      time: 99
    });

    let coords = await this.handlePega();

    await  this.setState({
      loading: false,
      data: coords.data,
      tentativa: 1
    });

    this.jogar();
  };

  salvarPontos = async() => {
    this.setState({
      loading: true,
      time: 99
    });
    let coords = await this.salvarPontos2();
    await this.setState({
      loading: false
    });

    this.props.navigation.popToTop();
  
  };

  handlePega = async() => {
    try{
      let response = await Axios.get(this.state.url);
      if(response.status > 400){
        return {};
      } else {  
        return await response;
      }
    } catch(e) {
      return {};
    }
  };

  salvarPontos2 = async() => {
    try{
      let response = await Axios.post('http://backendinglesfap.herokuapp.com/api/pontos', {
        nome: this.state.nome,
        pontos: this.state.pontos
      });
      if(response.status > 400){
        return {};
      } else {  
        return await response.data;
      }
    } catch(e) {
      return {};
    }
  };

  handleRender = () => {

      return <View>
        <Text>{ this.state.palavraCerta.palavra  }</Text>
        { this.state.palavras.map( item => {
          return (
          <Button key={item.id} title={item.traducao} onPress={() => this.tentar(item.id)}/>
          )
        })}
        <Text>{ this.state.palavraCerta.traducao + "  " + this.state.numeroCerto }</Text>
        </View>
    
  };

  
  render() {
    return (
      <View style={styles.container}>
      <View style={{marginTop: 22}}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => 
            this.salvarPontos()
          }
          >
          <View style={{marginTop: 22}}>
            <View>
              <Text>Parabens, voce atingiu { this.state.pontos} pontos</Text>
              <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                onChangeText={(nome) => this.setState({nome})}
                value={this.state.nome}
              />
              <Button title="Salvar" onPress={() => this.salvarPontos()}/>

            </View>
          </View>
        </Modal>
      </View>
      <Loader
          loading={this.state.loading} />
        <TimerCountdown
        initialMilliseconds={1000 * this.state.time}
        onTick={(milliseconds) => console.log("tick", milliseconds)}
        onExpire={() => console.log("complete")}
        formatMilliseconds={(milliseconds) => {
            const remainingSec = Math.round(milliseconds / 1000);
            const seconds = parseInt((remainingSec % 60).toString(), 10);
            const minutes = parseInt(((remainingSec / 60) % 60).toString(), 10);
            const hours = parseInt((remainingSec / 3600).toString(), 10);
            const s = seconds < 10 ? '0' + seconds : seconds;
            const m = minutes < 10 ? '0' + minutes : minutes;
            let h = hours < 10 ? '0' + hours : hours;
            h = h === '00' ? '' : h + ':';
            return s;
        }}
        allowFontScaling={true}
        style={{ fontSize: 20 }}
        />
        <Text>Pontos: { this.state.pontos }</Text>
        { this.handleRender() }
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