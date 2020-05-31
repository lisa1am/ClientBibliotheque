<template>
    <div class="list row">
        <div class="col-md-6">
            <h4>Gestion de livres</h4>
            <button v-on:click="addLivre()" type="button"  class="btn btn-lg">Ajouter</button>
            <br>
        </div>
        <br>
        <br>
        <table style="width:100%">
            <tr>
                <th>ISBN</th>
                <th>Titre</th>
                <th>Auteur</th>
                <th>Editeur</th>
                <th>Edition</th>
                <th></th>
                <th></th>
            </tr>
            <tr v-for="(livre, index) in livres" :key="index">
                <td>
                    <input type="text" v-model="livre.isbn"><br>
                </td>
                <td>
                    <input type="text" v-model="livre.titre"><br>
                </td>
                <td>
                    <input type="text" v-model="livre.auteur"><br>
                </td>
                <td>
                    <input type="text" v-model="livre.editeur"><br>
                </td>
                <td>
                    <input type="text" v-model="livre.edition"><br>
                </td>
                <td>
                   <button v-on:click="deleteLivre(livre.isbn)">❌</button>
                </td>
                <td>
                   <button v-on:click="updateLivre(index)">✔</button>
                </td>
            </tr>
        </table>

        <div class="col-md-6">
            <router-view @refreshData="refreshList"></router-view>
        </div>

    </div>
</template>

<script>
    import axios from "axios";
    const BASE_URL ="http://localhost:8003";


    export default {
        name: "livres-list",
        components : {
        },
        data(){
            return{
                livres: []
            };
        },
        methods: {
            /* eslint-disable no-console */
            retrieveLivres(){
                axios
                    .get(BASE_URL+"/livres")
                    .then(response => {
                        this.livres = response.data; // JSON are parsed automatically.
                        console.log(response.data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            refreshList(){
                this.retrieveLivres();
            },
            deleteLivre(isbn) {
                axios
                    .delete(BASE_URL+"/livres/isbn/" + isbn)
                    .then(response => {
                        console.log(response.data);
                        this.refreshList();
                        this.deletePret(isbn);
                    })
                    .catch(e => {
                        console.log(e);
                        this.refreshList();
                    });
            },
            updateLivre(id){
                var data = this.livres[id];
                if(this.livres[id].titre==""){
                    alert("Impossible d'ajouter un livre sans titre !");
                }else{
                    axios
                        .put(BASE_URL+"/livres/isbn/" + data.isbn, data)
                        .then(response => {
                            console.log(response.data);
                            this.refreshList();
                        })
                        .catch(e => {
                            console.log(e);
                        });
                }

            },
            addLivre(){
                this.livres.splice(0, 0,{
                    isbn:"",
                    titre:"",
                    auteur:"",
                    editeur:"",
                    edition:null
                })
            },
            deletePret(isbn){
                axios
                    .delete("http://localhost:8002/prets/isbn/" + isbn)
                    .then(response => {
                        console.log(response.data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
            /* eslint-enable no-console */
        },
        mounted(){
            this.retrieveLivres();
        }
    };


</script>


<style>

    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap');

    .list {
        text-align: left;
        max-width: 450px;
        margin : 10px;
    }

    h4{
        font-size: 25px;
    }

    *{
        font-family: "Montserrat", sans serif;
    }

    th{
        text-align: center
    }
</style>

