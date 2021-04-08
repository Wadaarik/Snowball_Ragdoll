import * as THREE from "./lib/three.module.js";
import Global from "./global.js";


export default class Objects extends THREE.Object3D{
    constructor() {
        super();
        this.update = this.update.bind(this);

        this.snowball = new THREE.SphereGeometry(1, 32, 32);//la boule de neige
        const ballMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide  } );//créer le material de la snowball
        ballMaterial.metalness = .1;
        ballMaterial.roughness = .4;
        ballMaterial.map = new THREE.TextureLoader().load("./assets/snow_jpg/snow_field_aerial_AO_1k.jpg");
        ballMaterial.map.anisotropy = 12;
        ballMaterial.map.wrapS = ballMaterial.map.wrapT = THREE.RepeatWrapping;//repete la texture
        ballMaterial.map.repeat.set(3, 1);
        this.snowballMesh = new THREE.Mesh( this.snowball, ballMaterial );
        this.snowballMesh.castShadow = true; //la sphere cast les ombres
        this.snowballMesh.receiveShadow = true; //la sphere accepte de recevoir les ombres
        this.snowballMesh.name = 'snowball';
        this.snowballMesh.interaction = true;


        this.ground = new THREE.BoxGeometry(9, 1, 1000);//sol
        const groundMaterial = new THREE.MeshBasicMaterial( {color: 0xCECECE, side: THREE.DoubleSide } );
        this.groundMesh = new THREE.Mesh( this.ground, groundMaterial );
        this.groundMesh.position.z = -420;
        this.groundMesh.position.y = -245;
        this.groundMesh.rotation.x = THREE.Math.degToRad(-30);

        this.add( this.snowballMesh );
        this.add( this.groundMesh );
    }
    update(){
        this.snowballMesh.rotation.x -= 0.01;

        if(this.snowballMesh.rotation.x > -60){
            this.snowballMesh.rotation.x *= 1.001;
        } else {
            this.snowballMesh.rotation.x -= 1.0619;
        }

        // console.log(this.snowballMesh.rotation.x);
        // this.snowballMesh.position.z -= 1;
    }
}