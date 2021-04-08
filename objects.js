import * as THREE from "./lib/three.module.js";
import Global from "./global.js";

import { GLTFLoader } from '/lib/GLTFLoader.js';

export default class Objects extends THREE.Object3D{
    constructor() {
        super();
        this.update = this.update.bind(this);

        this.snowball = new THREE.SphereGeometry(1, 8, 6);//la boule de neige
        const ballMaterial = new THREE.MeshToonMaterial( { color: 0xffffff  } );//créer le material de la snowball
        // ballMaterial.envMap = Global.instance.envMap;
        // ballMaterial.envMapIntensity = .4;
        // ballMaterial.map = new THREE.TextureLoader().load("./assets/snow_jpg/snow_field_aerial_AO_1k.jpg");
        // ballMaterial.map.anisotropy = 12;
        // ballMaterial.map.wrapS = ballMaterial.map.wrapT = THREE.RepeatWrapping;//repete la texture
        // ballMaterial.map.repeat.set(3, 1);
        // ballMaterial.normalMap = new THREE.TextureLoader().load("./assets/snow_png/snow_field_aerial_nor_1k.png");
        // ballMaterial.normalMap.wrapS = ballMaterial.map.wrapT = THREE.RepeatWrapping;//repete la texture
        // ballMaterial.normalMap.repeat.set(3, 1);
        this.snowballMesh = new THREE.Mesh( this.snowball, ballMaterial );
        this.snowballMesh.castShadow = true; //la sphere cast les ombres
        this.snowballMesh.receiveShadow = true; //la sphere accepte de recevoir les ombres
        // this.snowballMesh.position.x = -1;//position de la sphere
        // this.snowballMesh.position.y = .4;
        this.snowballMesh.name = 'snowball';
        this.snowballMesh.interaction = true;


        this.ground = new THREE.BoxGeometry(9, 1, 1000);//sol
        const groundMaterial = new THREE.MeshToonMaterial( {color: 0xDDDDDD } );
        this.groundMesh = new THREE.Mesh( this.ground, groundMaterial );
        this.groundMesh.position.z = -480;
        this.groundMesh.position.y = -1;


        // Skieurs
        var scene = this;
        const loader = new GLTFLoader();
        loader.load('./assets/skieur2.glb', function(gltf){
            console.log(scene);
            console.log(gltf.scene);
            console.log(gltf.scene.children[0]);
            gltf.scene.children[0].children[0].material = new THREE.MeshToonMaterial( {color: 0xFF4500} );
            gltf.scene.children[0].rotation.y = 3.14;
            gltf.scene.children[0].position.z = -150;
            scene.add(gltf.scene.children[0]);
            console.log(scene);
        });

        // loader.load(
        //     "./assets/skieur.glb",
        //     ( glb ) => {
        //         // called when the resource is loaded
        //         this.position.x = 0;
        //         this.position.y = 1;
        //         this.position.z = 50;
        //         this.add( glb.scene );
        //     },
        //     ( xhr ) => {
        //         // called while loading is progressing
        //         console.log( `${( xhr.loaded / xhr.total * 100 )}% loaded` );
        //     },
        //     ( error ) => {
        //         // called when loading has errors
        //         console.error( 'An error happened', error );
        //     },
        // );
        //    function(glb){
        //    glb.scene.traverse(function(child){
        //        var instancedMesh = new THREE.InstancedMesh(child.geometry, child.material, 1);
        //        instancedMesh.setMatrixAt(0, skieur.matrix);
        //        scene.add(instancedMesh);
        //    });
        //    scene.add( glb.scene);
        //});


        
        this.add( this.snowballMesh );
        this.add( this.groundMesh );
    }
    update(){
        this.snowballMesh.rotation.x -= 0.01;

        if(this.snowballMesh.rotation.x > -60){
            this.snowballMesh.rotation.x *= 1.001;
        } else {
            this.snowballMesh.rotation.x -= 0.0619;
        }

        // console.log(this.snowballMesh.rotation.x);
        this.snowballMesh.position.z -= 1;
    }
}