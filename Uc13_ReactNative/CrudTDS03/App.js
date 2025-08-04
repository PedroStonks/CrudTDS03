import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import {db} from './src/firebaseConnection';
import {doc,getDoc,onSnapshot} from 'firebase/firestore';

export default function App() {

  const[nome,setNome]= useState("Carregando...")

  useEffect(()=>{
    async function getDados() {

      /*const docref = doc(db,"users", "2")
      await getDoc(docref)
      .then((snapshot)=>{
        console.log(snapshot.data())
        setNome(snapshot.data()?.Nome)
      })
      .catch((err)=>{
        console.log("erro:")
        console.log(err)
      })*/

        onSnapshot(doc(db,"users", "2"), (doc)=>{
          setNome(doc.data()?.Nome)
        })
    }
    getDados();

  },[])

  return (
    <View style={styles.container}>
      <Text>Nome:{nome}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
