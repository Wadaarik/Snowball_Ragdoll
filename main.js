import * as THREE from "./lib/three.module.js";
import Objects from "./objects.js";
import Global from "./global.js";


export default class Main{
    constructor() {
        this.update = this.update.bind(this);
        this.onResize = this.onResize.bind(this);
        this.initEvents = this.initEvents(this);
        this.onKeyDown = this.onKeyDown(this);

        this.scene;
        this.camera;
        this.renderer;

        this.init();
    }
    init(){
        this.scene = new THREE.Scene();//scene

        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );//camera

        this.renderer = new THREE.WebGLRenderer({antialias: true});//renderer
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
        });

        this.camera.position.z = 5;
        this.camera.position.y = 2;

        window.addEventListener('resize', this.onResize, false);
        document.body.appendChild(this.renderer.domElement);

        this.update();
    }
    initEvents(){
        document.body.addEventListener("keydown", this.onKeyDown, false);
    }
    onKeyDown (event){
        var keyCode = event.which;
        var sphere = this.snowballMesh;
        if (keyCode == 37) {
            if(sphere.position.x > -3){
                sphere.position.x -= 3;
            }
        } else if (keyCode == 39) {
            if(sphere.position.x < 3){
                sphere.position.x += 3;
            }
        }

    }
    initObjects(){

        this.objects = new Objects();
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
        this.renderer.render(this.scene, this.camera);
    }
}
new Main();