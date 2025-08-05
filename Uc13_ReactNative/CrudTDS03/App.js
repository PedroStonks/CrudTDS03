import { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TouchableOpacity, TextInput, Alert, Keyboard } from 'react-native';

import {db} from './src/firebaseConnection';
import {doc,onSnapshot,collection, addDoc} from 'firebase/firestore';

export default function App() {

  const[nome, setNome]= useState("")
  const[cargo, setCargo]= useState("")
  const[idade, setIdade]= useState("")

  const [formVisible, setFormVisible] = useState(false);

  const idadeInputRef = useRef(null);
  const cargoInputRef = useRef(null);

  useEffect(()=>{
    async function getDados() {
        onSnapshot(doc(db,"users", "3"), (doc)=>{
          setNome(doc.data()?.Nome)
        })
    }
    getDados();
  },[])

  async function handlerRegistrer() {
    if(nome.trim() === '' || idade.trim() === '' || cargo.trim() === ''){
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return; 
    }
    
    Keyboard.dismiss();
    
    await addDoc(collection(db, "users"),{
      Nome: nome,
      Idade: idade,
      Cargo: cargo
    })
    .then(()=>{
      console.log("Cadastrado com Sucesso")
      setNome('');
      setIdade('');
      setCargo('');
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  return (
    <View style={styles.container}>
      


      {formVisible && (
        <>
          <Text style={styles.nome}> Cadastro</Text>

          <Text style={styles.label}>Nome</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Digite seu Nome (só letras)" 
            value={nome} 
            onChangeText={(text)=>setNome(text)}
            returnKeyType="next"
            onSubmitEditing={() => idadeInputRef.current.focus()}
            blurOnSubmit={false}
          />

          <Text style={styles.label}>Idade</Text>
          <TextInput 
            ref={idadeInputRef}
            style={styles.input} 
            placeholder="Digite sua Idade (só numeros)" 
            value={idade} 
            onChangeText={(text)=>setIdade(text)} 
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() => cargoInputRef.current.focus()}
            blurOnSubmit={false}
          />

          <Text style={styles.label}>Cargo</Text>
          <TextInput 
            ref={cargoInputRef}
            style={styles.input} 
            placeholder="Digite seu Cargo (só letras)" 
            value={cargo} 
            onChangeText={(text)=>setCargo(text)}
            returnKeyType="done"
            onSubmitEditing={handlerRegistrer}
          />

          <TouchableOpacity style={styles.button} onPress={handlerRegistrer} >
            <Text style={styles.buttonText}>Adicionar</Text>
          </TouchableOpacity>
        </>
      )}


      <View style={styles.toggleContainer}>
        {formVisible ? (
          // Se formVisible for TRUE, mostra o botão de ESCONDER
          <TouchableOpacity 
            style={[styles.toggleButton, {backgroundColor: '#e74c3c'}]} // Botão vermelho
            onPress={() => setFormVisible(false)}
          >
            <Text style={styles.toggleButtonText}>Esconder Formulário</Text>
          </TouchableOpacity>
        ) : (
          // Se formVisible for FALSE, mostra o botão de MOSTRAR
          <TouchableOpacity 
            style={[styles.toggleButton, {backgroundColor: '#2ecc71'}]} // Botão verde
            onPress={() => setFormVisible(true)}
          >
            <Text style={styles.toggleButtonText}>Mostrar Formulário</Text>
          </TouchableOpacity>
        )}
      </View>



    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingTop:'28'
  },
  toggleContainer: {
    // Este container agora só centraliza o botão que estiver ativo
    marginBottom: 20,
    marginTop: 20,
    alignItems: 'center', 
  },
  toggleButton: {
    padding: 12, // Aumentei um pouco o padding
    borderRadius: 28,
    width: '80%', // Ocupa uma boa parte da tela
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  nome:{
    color:"#fff",
    margin:5,
    textAlign:'center'
  },
  label: {
    color: '#fff',
    marginLeft: 8,
    marginBottom: 5,
  },
  button:{
    backgroundColor:"#fff",
    alignItems:'center',
    marginTop:'20',
    borderRadius:20,
    margin:5
  },
  buttonText:{
    padding:10,
    color:'#000',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 30,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    margin:7,
    height:48
  },
});