// users.js

import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { db } from './firebaseConnection';
import { deleteDoc, doc } from "firebase/firestore";

export function UsersList({ data, handlerEdit }) {
  async function handlerDeleteItem() {
    const docRef = doc(db, "users", data.id);
    await deleteDoc(docRef);
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.item}>Nome: {data.nome}</Text>
        <Text style={styles.item}>Idade: {data.idade}</Text>
        <Text style={styles.item}>Cargo: {data.cargo}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonEditar} onPress={() => handlerEdit(data)}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonDelete} onPress={handlerDeleteItem}>
          <Text style={styles.buttonText}>Deletar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  item: {
    color: "#000", // CORRIGIDO
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  buttonText: {
    textAlign: 'center',
    color: "#fff",
    fontWeight: 'bold',
  },
  buttonDelete: {
    backgroundColor: "red",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonEditar: {
    backgroundColor: "green",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  }
});