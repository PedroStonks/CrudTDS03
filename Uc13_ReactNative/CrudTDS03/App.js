// App.js

import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, TextInput, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { auth } from './src/firebaseConnection';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { FormUser } from './src/formUser';

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        // CORREÇÃO: O uid e email estão diretamente no objeto 'user'
        setAuthUser({
          email: user.email,
          uid: user.uid 
        });
        setLoading(false);
        return;
      }
      setAuthUser(null);
      setLoading(false);
    });
    
    // Boa prática: desligar o listener ao desmontar o componente
    return () => unsub();
  }, []);

  async function handlerCreateUser() {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // CORREÇÃO: A forma correta de limpar o estado
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log("Erro ao criar usuário:", error.code);
      alert("Não foi possível criar o usuário. Verifique os dados.");
    }
  }

  function handlerLogin() {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // CORREÇÃO: O uid e email estão diretamente no objeto 'user'
        setAuthUser({
          email: userCredential.user.email,
          uid: userCredential.user.uid
        });
        setEmail("");
        setPassword("");
      })
      .catch((err) => {
        console.log(err.code);
        if (err.code === 'auth/missing-password' || err.code === 'auth/invalid-credential') {
          alert("E-mail ou senha incorretos.");
        }
      });
  }

  async function handlerLogOut() {
    await signOut(auth);
    setAuthUser(null);
  }

  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // Se existe um usuário autenticado, mostra o formulário e a lista
  if (authUser) {
    return <FormUser handleLogout={handlerLogOut} />; // Passa a função de logout como prop
  }

  // Se não, mostra a tela de login
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#e91b1bff" barStyle="light-content" />
      
      <Text style={styles.title}>Acesse sua conta</Text>

      <Text style={styles.label}>E-mail:</Text>
      <TextInput 
        style={styles.txtinput} 
        placeholder='Digite seu e-mail'
        value={email} 
        onChangeText={(text) => setEmail(text)}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Senha:</Text>
      <TextInput 
        style={styles.txtinput} 
        placeholder='Digite sua senha'
        value={password} 
        onChangeText={(text) => setPassword(text)} 
        secureTextEntry={true}
      />

      <TouchableOpacity style={styles.button} onPress={handlerLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.buttonCreate]} onPress={handlerCreateUser}>
        <Text style={styles.buttonText}>Criar uma conta</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090909ff',
    padding: 15,
  },
  containerLoading: {
    flex: 1,
    backgroundColor: '#090909ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  label:{
    fontSize: 18,
    color:'white',
    marginBottom: 5,
    marginLeft: 5,
  },
  txtinput:{
    fontSize: 18,
    borderRadius: 8,
    color:'white',
    backgroundColor: '#303030ff',
    padding: 12,
    marginBottom: 15,
  },
  button:{
    backgroundColor:'#2ecc71',
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
  },
  buttonCreate: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2ecc71',
  },
  buttonText:{
    color:'#f7f6f6ff',
    textAlign:'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});