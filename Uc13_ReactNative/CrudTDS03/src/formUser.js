
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View,TouchableOpacity, TextInput, Alert, Keyboard, FlatList, SafeAreaView,StatusBar } from 'react-native';
import { db } from './firebaseConnection'; // Caminho corrigido
import { onSnapshot, collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { UsersList } from './users'; // Caminho corrigido

// Recebe 'handleLogout' como uma prop do App.js
export function FormUser({ handleLogout }) {
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [idade, setIdade] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(null); // Usar null como valor inicial
  const idadeInputRef = useRef(null);
  const cargoInputRef = useRef(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersRef = collection(db, "users");
    const unsub = onSnapshot(usersRef, (snapshot) => {
      let lista = [];
      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          nome: doc.data().Nome,
          idade: doc.data().Idade,
          cargo: doc.data().Cargo,
        });
      });
      setUsers(lista);
    });
    return () => unsub(); // Desliga o listener ao sair da tela
  }, []);

  function resetForm() {
    setNome('');
    setIdade('');
    setCargo('');
    setIsEditing(null);
    Keyboard.dismiss();
    setFormVisible(false);
  }

  async function handlerSubmit() {
    if (nome.trim() === '' || idade.trim() === '' || cargo.trim() === '') {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }
    
    // Se isEditing tiver um ID, estamos editando.
    if (isEditing) {
      const docRef = doc(db, 'users', isEditing);
      await updateDoc(docRef, {
        Nome: nome,
        Idade: idade,
        Cargo: cargo
      });
    } else {
      // Senão, estamos adicionando um novo.
      await addDoc(collection(db, "users"), {
        Nome: nome,
        Idade: idade,
        Cargo: cargo
      });
    }

    resetForm();
  }

  function handleEdit(data) {
    setNome(data.nome);
    setIdade(data.idade);
    setCargo(data.cargo);
    setIsEditing(data.id);
    setFormVisible(true);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciar Usuários</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.toggleButton, { backgroundColor: formVisible ? '#e74c3c' : '#2ecc71' }]}
        onPress={() => { setFormVisible(!formVisible); if (isEditing) resetForm(); }}
      >
        <Text style={styles.toggleButtonText}>{formVisible ? 'Fechar Formulário' : 'Adicionar Usuário'}</Text>
      </TouchableOpacity>

      {formVisible && (
        <View>
          <Text style={styles.formTitle}>{isEditing ? 'Editando Usuário' : 'Novo Cadastro'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do usuário"
            value={nome}
            onChangeText={setNome}
            returnKeyType="next"
            onSubmitEditing={() => idadeInputRef.current.focus()}
          />
          <TextInput
            ref={idadeInputRef}
            style={styles.input}
            placeholder="Idade"
            value={idade}
            onChangeText={setIdade}
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() => cargoInputRef.current.focus()}
          />
          <TextInput
            ref={cargoInputRef}
            style={styles.input}
            placeholder="Cargo"
            value={cargo}
            onChangeText={setCargo}
            returnKeyType="done"
            onSubmitEditing={handlerSubmit}
          />
          <TouchableOpacity style={styles.button} onPress={handlerSubmit}>
            <Text style={styles.buttonText}>{isEditing ? 'Salvar Alterações' : 'Adicionar'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        style={styles.lista}
        data={users}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <UsersList data={item} handlerEdit={handleEdit} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 15, paddingTop: StatusBar.currentHeight },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: 'bold' },
  logoutText: { color: '#e74c3c', fontSize: 16 },
  toggleButton: { padding: 12, borderRadius: 8, width: '100%', alignItems: 'center', marginBottom: 20 },
  toggleButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  formTitle: { color: "#fff", fontSize: 20, textAlign: 'center', marginBottom: 10 },
  button: { backgroundColor: "#fff", alignItems: 'center', marginTop: 10, borderRadius: 8, padding: 12 },
  buttonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  input: { backgroundColor: '#FFF', borderRadius: 8, padding: 10, fontSize: 16, marginBottom: 10 },
  lista: { marginTop: 10 }
});