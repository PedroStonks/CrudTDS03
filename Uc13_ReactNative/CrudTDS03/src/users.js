import { View,StyleSheet,Text,TouchableOpacity } from "react-native";
import {db} from './firebaseConnection';
import { deleteDoc, doc } from "firebase/firestore";

export function UsersList({data, handlerEdit}){
  async function handlerDeleteItem(){
    //console.log(data)
    const docRef = doc(db,"users", data.id)
    await deleteDoc (docRef)
  }

  function handlerEditUser(){
    //console.log(data)
    handlerEdit(data);
  }
    return(
            <View style= {styles.container}>

                <Text style= {styles.item}>Nome: {data.nome}</Text>
                <Text style= {styles.item}>Idade: {data.idade}</Text>
                <Text style= {styles.item}>Cargo: {data.cargo}</Text>
                <TouchableOpacity style= {styles.buttonDelete}  onPress={handlerDeleteItem}
              ><Text style= {styles.buttonText} >Deletar</Text></TouchableOpacity>

              <TouchableOpacity style= {styles.buttonEditar} onPress={handlerEditUser}
              ><Text style= {styles.buttonText} >Editar</Text></TouchableOpacity>

            </View>
    )

}


const styles = StyleSheet.create({
    container:{
        width:'100%',
        backgroundColor:'#f0f0f0',
        padding:10,
        borderRadius:15,
        marginTop:20,
        marginBottom:15,
        marginRight:180
    },

    item:{
        color:"000",
        fontSize:16,
    },

        buttonText:{
          textAlign:'center',
          color:"#fff",
   
    },

    buttonDelete:{
        backgroundColor:"red",
        width:55,
        borderRadius:10,
        marginTop:5,
        padding:2
    },

        buttonEditar:{
        backgroundColor:"green",
        width:55,
        borderRadius:10,
        marginTop:5,
        padding:2,
    }
})