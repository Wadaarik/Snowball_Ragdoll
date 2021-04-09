import * as THREE from "./lib/three.module.js";
import Global from "./global.js";

import { GLTFLoader } from '/lib/GLTFLoader.js';

export default class Objects extends THREE.Object3D{
    constructor(callback) {
        super();
        this.update = this.update.bind(this);
        this.callback = callback;

        const ballMaterial = new THREE.MeshToonMaterial( { color: 0xffffff  } );//créer le material de la snowball
        this.snowball = new THREE.SphereGeometry(1, 8, 6);//la boule de neige
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
        this.snowballMesh.name = 'snowball';
        this.snowballMesh.interaction = true;
        this.snowballMesh.position.y -= 1;

        this.planeGround = new THREE.BoxGeometry(9, 1, 1000);//sol
        const groundMaterial = new THREE.MeshToonMaterial( {color: 0xDDDDDD } );
        this.groundMesh = new THREE.Mesh( this.planeGround, groundMaterial );
        this.groundMesh.castShadow = true; //le sol cast les ombres
        this.groundMesh.receiveShadow = true; //le sol accepte de recevoir les ombres
        this.groundMesh.position.z = -420;
        this.groundMesh.position.y = -199;
        this.groundMesh.rotation.x = THREE.Math.degToRad(-25);
        this.groundMesh.name = 'Ground';

        // Skieurs
        var scene = this;
        const loader = new GLTFLoader();

        function skieur(positionZ, positionX){
            loader.load('./assets/skieur2.glb', function(gltf){
                //console.log(scene);
                //console.log(gltf.scene);
                //console.log(gltf.scene.children[0]);
                var skieur = gltf.scene.children[0];
                var skieurMesh = gltf.scene.children[0].children[0];
                skieurMesh.material = new THREE.MeshToonMaterial( {color: 0xFF4500} );
                skieur.rotation.y = 3.14;
                skieur.rotation.x = THREE.Math.degToRad(-25);
                console.log(positionX);
                skieur.position.x = positionX;
                skieur.position.y = -(positionZ*0.25);
                console.log(positionZ);
                skieur.position.z = positionZ;
                scene.add(skieur);
                scene.callback();
                //console.log(scene);
            });
        }

        for(let nombre = 0; nombre <= 5; nombre++){
            skieur(Math.floor(Math.random() * -50), Math.floor(Math.random() * 3)-3);
        }

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

    get ground(){
        return this.groundMesh;
    }

    update(){
        this.snowballMesh.rotation.x -= 0.01;

        if(this.snowballMesh.rotation.x > -60){
            this.snowballMesh.rotation.x *= 1.001;
        } else {
            this.snowballMesh.rotation.x -= 0.0619;
        }


        // console.log(this.snowballMesh.rotation.x);
        // this.snowballMesh.position.z -= 1;
    }
}