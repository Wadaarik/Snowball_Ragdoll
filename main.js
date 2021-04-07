import * as THREE from "./lib/three.module.js";
import Objects from "./objects.js";
import Global from "./global.js";

import { OutlineEffect } from '/lib/OutlineEffect.js';


export default class Main{
    constructor() {
        this.update = this.update.bind(this);
        this.onResize = this.onResize.bind(this);
        this.initEvents = this.initEvents.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

        this.scene;
        this.camera;
        this.renderer;
        this.particleLight;

        this.init();
    }
    init(){
        this.scene = new THREE.Scene();//scene

        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );//camera

        this.scene.add( new THREE.AmbientLight( 0xFFFFFF ) );

        this.renderer = new THREE.WebGLRenderer({antialias: true});//renderer
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.shadowMap.enabled = true; //active l'ombre
        this.renderer.setSize(window.innerWidth, window.innerHeight);//initialise la taille de la scene

        // creation d'un cube
        // const geometry = new THREE.BoxGeometry();
        // const material = new THREE.MeshBasicMaterial({ color: 0xff000 });
        // this.cube = new THREE.Mesh(geometry, material);
        // this.cube.name = "snowball";
        // this.scene.add(this.cube);


        this.skyTexture= new THREE.TextureLoader().load("./assets/background.jpg", ()=>{//créer le background
            this.skyEquipMap = new THREE.WebGLCubeRenderTarget(1024).fromEquirectangularTexture(this.renderer, this.skyTexture);
            Global.instance.envMap = this.skyEquipMap;//instancie les futurs materiaux via singleton
            this.scene.background = this.skyEquipMap;

            // this.initPhysics();
            this.initObjects();
            this.sphere = this.objects.children[0];
        });

        this.camera.position.z = 5;
        this.camera.position.y = 2;

        window.addEventListener('resize', this.onResize, false);
        document.body.appendChild(this.renderer.domElement);
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.effect = new OutlineEffect( this.renderer );

        this.update();
        this.initEvents();
    }
    initEvents(){
        document.body.addEventListener("keydown", this.onKeyDown);
    }

    onKeyDown (event){
        var keyCode = event.keyCode;
        if (keyCode == 37) {
            if(this.sphere.position.x > -3){
                this.sphere.position.x -= 3;
            }
        } else if (keyCode == 39) {
            if(this.sphere.position.x < 3){
                this.sphere.position.x += 3;
            }
        }

    }
    initObjects(){

        this.objects = new Objects();
        // console.log(this.objects);
        this.scene.add(this.objects);

    }
    onResize(){//permet de resizer automatiquement la scene en fonction de la taille de la fenêtre
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    update(){
        requestAnimationFrame(this.update);

        this.objects && this.objects.update();


        this.camera.position.z -= 1;
        this.effect.render(this.scene, this.camera);
    }
}
new Main();