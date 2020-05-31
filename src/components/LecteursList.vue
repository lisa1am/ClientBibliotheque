<template>
    <div class="list row">
        <div class="col-md-6">
            <h4>Gestion de lecteurs</h4>
            <button v-on:click="addLecteur()" type="button"  class="btn btn-lg" >Ajouter</button>
            <br>
        </div>
        <br>
        <br>
        <table style="width:100%">
            <tr>
                <th>ID</th>
                <th>Genre</th>
                <th>Nom</th>
                <th>Prenom</th>
                <th>Date de naissance</th>
                <th>Adresse</th>
                <th></th>
                <th></th>
            </tr>
            <tr v-for="(lecteur, index) in lecteurs" :key="index">
                <td>
                    <!--<input type="number" v-model="lecteur.idf"><br> -->
                    <label>{{lecteur.idf}}</label>
                </td>
                <td>
                    <input type="text" v-model="lecteur.genre"><br>
                </td>
                <td>
                    <input type="text" v-model="lecteur.nom"><br>
                </td>
                <td>
                    <input type="text" v-model="lecteur.prenom"><br>
                </td>
                <td>
                    <input type="date" v-model="lecteur.date_naissance"><br>
                </td>
                <td>
                    <input type="text" v-model="lecteur.adresse"><br>
                </td>
                <td>
                    <button v-on:click="deleteLecteur(lecteur.idf)">❌</button>
                </td>
                <td>
                    <button v-on:click="updateLecteur(index)">✔</button>
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
    const BASE_URL ="http://localhost:8001";


    export default {
        name: "lecteurs-list",
        components : {
        },
        data(){
            return{
                lecteurs: []
            };
        },
        methods: {
            /* eslint-disable no-console */
            retrieveLecteurs(){
                axios
                    .get(BASE_URL+"/lecteurs")
                    .then(response => {
                        this.lecteurs = response.data; // JSON are parsed automatically.
                        console.log(response.data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            refreshList(){
                this.retrieveLecteurs();
            },
            deleteLecteur(id) {
                axios
                    .delete(BASE_URL+"/lecteurs/idf/" + id)
                    .then(response => {
                        console.log(response.data);
                        this.deletePret(id);
                        this.refreshList();
                    })
                    .catch(e => {
                        console.log(e);
                        this.refreshList();
                    });
            },
            updateLecteur(idx){
                var data = this.lecteurs[idx];
                if(data.nom=="" || data.prenom==""){
                    alert("Nom et prénom sont obligatoires !");
                }else{
                    axios
                        .put(BASE_URL+"/lecteurs/idf/" + data.idf, data)
                        .then(response => {
                            console.log(response.data);
                            this.refreshList();
                        })
                        .catch(e => {
                            console.log(e);
                        });
                }

            },
            addLecteur(){
                var new_id = this.lecteurs[this.lecteurs.length-1].idf+1;
                this.lecteurs.splice(0, 0,{
                    idf : new_id,
                    genre:"",
                    nom:"",
                    prenom:"",
                    date_naissance:"",
                    adresse:""
                });

            },
            deletePret(idf){
                axios
                    .delete("http://localhost:8002/prets/lecteur/" + idf)
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
            this.retrieveLecteurs();
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

