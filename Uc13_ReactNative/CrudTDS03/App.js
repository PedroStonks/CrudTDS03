import { useState } from 'react';
import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar, TextInput, Text, TouchableOpacity } from 'react-native';
import {auth} from './src/firebaseConnection';

import { FormUser } from './src/formUser';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function App() {

const [email,setEmail]= useState("")
const [password,setPassword]= useState("")
const [authUser, setAuthUser] = useState(null)


async function handlerCreateUser(){
  const user = await createUserWithEmailAndPassword (auth,email,password)
  alert("Usuario Criado")
  setEmail=""
  setPassword=""
  // console.log(user)

}
// async function handlerLogin() {
//   const user = await createUserWithEmailAndPassword (auth,email,password)
//   alert("Usuario Logado")
//   setEmail=""
//   setPassword=""
//   setAuthUser({
//     email: user.user.email,
//     uid: user.user.uid
//   })
// console.log(user)
  

function handlerLogin() {
 signInWithEmailAndPassword (auth,email,password)
.then((user)=>{
  console.log(user)
  setAuthUser({
  email: user.user.email,
  uid: user.user.uid

   })
  
  setEmail("")
  setPassword("")
})
.catch((err)=>{
  console.log(err.code)
    if(err.code === 'auth/missing-password'){
    alert("A senha é obrigatória")
  }

 })

}


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#e91b1bff" barStyle="light-content" />

      {/* <FormUser /> */}

      {authUser && <Text style={styles.input}>Usuario Logado: {authUser.email}</Text>}
  

      <Text style={styles.input}>E-mail:</Text>
      <TextInput style={styles.txtinput} placeholder='Digite seu e-mail'
      value={email} onChangeText={(text)=>setEmail(text)}
      ></TextInput>     

      <Text style={styles.input}>Senha:</Text>
      <TextInput style={styles.txtinput} placeholder='Digite sua senha'
      value={password} onChangeText={(text)=>setPassword(text)} secureTextEntry={true}
      ></TextInput>


      <TouchableOpacity  style={styles.button} onPress={handlerLogin}>
      <Text style={styles.buttonText}>Criar Login</Text>
      </TouchableOpacity>

      <TouchableOpacity  style={styles.button} onPress={handlerCreateUser}>
        <Text style={styles.buttonText}>Criar uma conta</Text>
      </TouchableOpacity>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090909ff',
  },

  input:{
    marginTop:25,
    marginLeft:1,
    marginRight:10,
    borderWidth:1,
    padding:5,
    fontSize:18,
    color:'white'

  },

  txtinput:{
    fontSize:18,
    marginLeft:5,
    borderWidth:1,
     borderRadius:23,
    color:'green',
    backgroundColor: '#303030ff',

  },

  button:{
    backgroundColor:'#323030ff',
    marginRight:10,
    marginLeft:10,
    marginTop:20,
    padding:10,
    borderRadius:23,
  },

  buttonText:{
    color:'#f7f6f6ff',
    textAlign:'center'
  },

});