<template>
    <div class="list row">
        <div class="col-md-6">
            <h4>Gestion des emprunts de livres</h4>
            <button v-on:click="addPret()" type="button"  class="ajouter">+</button>
            <button v-on:click="retrievePrets()" type="button"  class="click">Tout l'historique</button>
            <br>
        </div>
        <div class="filtre">
            <br><br>
            <label class="filtre_elem">Filtre</label>
            <select class="filtre_elem" v-model="selected">
                <option>ISBN</option>
                <option>Titre</option>
                <option>ID</option>
                <option>Nom</option>
                <option>En cours</option>
                <option>Periode</option>
            </select>
            <input type="text" class="filtre_elem" id="in">
            <button v-on:click="filtrer()" type="button" name="btn_filtre">→</button>
            <br><br>
            <label>Du : </label>
            <input type="date"  id="debut">
            <br>
            <label>Au : </label>
            <input type="date"  id="fin">
        </div>
        <br>
        <br>
        <table style="width:100%">
            <tr>
                <th>ID</th>
                <th>ISBN*</th>
                <th>Titre*</th>
                <th>ID lecteur*</th>
                <th>Nom lecteur*</th>
                <th>Emprunté le*</th>
                <th>Rendu le</th>
                <th></th>
                <th></th>
            </tr>
            <tr v-for="(info, index) in infos" :key="index">
                <td>
                    <div class="contains_label">
                        <label>{{info.id}}</label><br>
                    </div>
                </td>
                <td>
                    <input type="text" v-model="info.isbn" disabled="disabled" class="from" id="isbn">
                    <br>
                </td>
                <td>
                    <input v-if="info.id !=''" type="text" v-model="info.titre" disabled="disabled" class="from" id="titre">
                    <select v-else class="filtre_elem" v-model="info.titre">
                        <option v-for="(livre, indexLivre) in livres" :key="indexLivre" v-on:click="synchroLivre(index, indexLivre)">
                            {{ livre.titre }}
                        </option>
                    </select>
                    <br>
                </td>
                <td>
                    <input type="text" v-model="info.id_lecteur" disabled="disabled" class="from" id="idf"><br>
                </td>
                <td>
                    <input v-if="info.id !=''" type="text" v-model="info.nom_lecteur" disabled="disabled" class="from" id="nom">
                    <select v-else class="filtre_elem" v-model="info.nom_lecteur">
                        <option v-for="(lecteur, indexLecteur) in lecteurs" :key="indexLecteur" v-on:click="synchroLecteur(index, indexLecteur)">
                            {{ lecteur.nom }}
                        </option>
                    </select>
                    <br>
                </td>
                <td>
                    <input type="date" v-model="info.date_pret"><br>
                </td>
                <td>
                    <input type="date" v-model="info.date_retour"><br>
                </td>
                <td>
                    <button v-on:click="updatePret(index)">✔</button>
                </td>
                <td></td>
            </tr>
        </table>


    </div>
</template>

<script>
    import axios from "axios";
    const BASE_URL ="http://localhost:8002";


    export default {
        name: "lecteurs-list",
        components : {
        },
        data(){
            return{
                prets:[],
                selected: '',
                infos:[],
                livre:{},
                lecteurs:[],
                temp:[]
            };
        },
        methods: {
            /* eslint-disable no-console */
            retrievePrets(){
                axios
                    .get(BASE_URL+"/prets")
                    .then(response => {
                        this.prets = response.data; // JSON are parsed automatically.
                        console.log(response.data);
                        this.getAllInfo();
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            refreshList(){
                this.retrievePrets();
            },
            filtrer(){
                var arg = document.getElementById("in").value;
                if(this.selected!=""){
                    if(arg!=""){
                        if(this.selected=="ISBN"){
                            this.refreshList();
                            axios
                                .get(BASE_URL+"/prets/isbn/"+arg)
                                .then(response => {
                                    this.prets = response.data; // JSON are parsed automatically.
                                    console.log(response.data);
                                    this.getAllInfo();
                                })
                                .catch(e => {
                                    console.log(e);
                                });
                        }
                        else if(this.selected=='ID'){
                            this.refreshList();
                            axios
                                .get(BASE_URL+"/prets/lecteur/"+arg)
                                .then(response => {
                                    this.prets = response.data; // JSON are parsed automatically.
                                    console.log(response.data);
                                    this.getAllInfo();
                                })
                                .catch(e => {
                                    console.log(e);
                                });
                        }
                        else if(this.selected=='Titre'){
                            this.refreshList();
                            axios
                                .get("http://localhost:8003/livres/titre/"+arg)
                                .then(response => {
                                    this.livre=response.data;
                                    console.log(response.data);
                                    axios
                                        .get(BASE_URL + "/prets/isbn/" + this.livre.isbn)
                                        .then(response => {
                                            this.prets = response.data; // JSON are parsed automatically.
                                            console.log(response.data);
                                            this.getAllInfo();
                                        })
                                        .catch(e => {
                                            console.log(e);
                                        });
                                })
                                .catch(e => {
                                    console.log(e);
                                });
                        }
                        else if(this.selected=='Nom'){
                            var i=0;
                            while(i<this.infos.length) {
                                if(this.infos[i].nom_lecteur==arg){
                                    this.temp.push(this.infos[i]);
                                }
                                i++;
                            }
                            this.infos=[];
                            this.infos=this.temp;
                        }
                    }
                    if(this.selected=='En cours'){
                        this.refreshList();
                        axios
                            .get(BASE_URL+"/prets/encours/")
                            .then(response => {
                                this.prets = response.data; // JSON are parsed automatically.
                                console.log(response.data);
                                this.getAllInfo();
                            })
                            .catch(e => {
                                console.log(e);
                            });
                    }
                    else if(this.selected=='Periode'){
                        this.refreshList();
                        var deb = document.getElementById("debut").value;
                        var fin = document.getElementById("fin").value;
                        axios
                            .get(BASE_URL+"/prets/start/"+ deb+"/end/"+fin )
                            .then(response => {
                                this.prets = response.data; // JSON are parsed automatically.
                                console.log("HEREEE"+response.data);
                                this.getAllInfo();
                            })
                            .catch(e => {
                                console.log(e);
                            });
                    }

                }

            },
            addPret(){
                //var new_id = this.prets[this.prets.length-1].id+1;
                this.infos.splice(0, 0,{
                    id:"",
                    id_lecteur: "",
                    nom_lecteur: "",
                    isbn:"",
                    titre:"",
                    date_pret:"",
                    date_retour:""

                });
                document.getElementById("nom").disabled=false;
                document.getElementById("titre").disabled=false;


            },
            retrieveLivres(){
                axios
                    .get("http://localhost:8003/livres")
                    .then(response => {
                        this.livres = response.data; // JSON are parsed automatically.
                        console.log(response.data);
                        this.retrievePrets();
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            retrieveLecteurs(){
                axios
                    .get("http://localhost:8001/lecteurs")
                    .then(response => {
                        this.lecteurs = response.data; // JSON are parsed automatically.
                        console.log(response.data);
                        this.retrieveLivres();
                    })
                    .catch(e => {
                        console.log(e);
                    });

            },
            getAllInfo(){
                this.infos=[];
                for(var i=0; i<this.prets.length; i++){
                    var titre="";
                    for(var j=0; j<this.livres.length; j++){
                        if(this.prets[i].isbn==this.livres[j].isbn){
                            titre=this.livres[j].titre;
                        }
                    }
                    var nom="";
                    for(j=0; j<this.lecteurs.length; j++){
                        if(this.prets[i].lecteur==this.lecteurs[j].idf){
                            nom=this.lecteurs[j].nom;
                        }
                    }
                    this.infos.push({
                        id : this.prets[i].id,
                        isbn : this.prets[i].isbn,
                        id_lecteur : this.prets[i].lecteur,
                        titre : titre,
                        nom_lecteur : nom,
                        date_pret : this.prets[i].date_pret,
                        date_retour : this.prets[i].date_retour
                    })
                    console.log(i);
                }
            },
            updatePret(id){
                var today = new Date();
                var date = today.getFullYear()+'-0'+(today.getMonth()+1)+'-'+today.getDate();
                var data = {
                    id : this.infos[id].id,
                    lecteur : this.infos[id].id_lecteur,
                    isbn : this.infos[id].isbn,
                    date_pret : date,
                    date_retour : this.infos[id].date_retour
                };
                if(data.isbn=="" ||
                    data.nom_lecteur=="" ||
                    data.titre=="" ||
                    data.date_pret==""){
                    alert("Veuillez remplir les champs obligatoires (*) !");
                }else{
                    axios
                        .put(BASE_URL+"/prets/lecteur/" + data.lecteur+"/isbn/"+data.isbn, data)
                        .then(response => {
                            console.log(response.data);
                            this.refreshList();
                        })
                        .catch(e => {
                            console.log(e);
                        });
                }
                document.getElementById("isbn").disabled=true;
                document.getElementById("idf").disabled=true;
                document.getElementById("nom").disabled=true;
                document.getElementById("titre").disabled=true;
            },
            synchroLecteur(id, idl){
                this.infos[id].id_lecteur=this.lecteurs[idl].idf;
            },
            synchroLivre(id, idl){
                this.infos[id].isbn=this.livres[idl].isbn;
            }
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

    .ajouter{
        width:50px;
        height:50px;
        background:darkred;
        border-radius:50%;
        border:none;
        color:#fff;
        font-size: 25px;

    }

    .click {
        border:none;
        padding:6px 10px 6px 10px;
        border-radius:8px;
        background:#d34836;
        font:bold 13px Arial;
        color:#fff;
        margin-left : 100px;
        font-size: 15px;
    }

    .filtre{
        margin-right : 10px;
        justify-content: space-between
    }

    .filtre_elem{
        width: 100px;
        display: inline-block;
        vertical-align: middle;
        margin-left: 10px;
        margin-right: 10px;
    }

    input{
        width: 150px;
    }

    btn_filtre{
        width : 5px;
    }

    .contains_label{
        text-align: center;
        border: 2px solid gainsboro;
        background-color: beige;
        border-radius: 5px;
        width: 150px;
    }

    debut, fin{
        margin : 10px 10px 10px 10px;
    }

</style>

