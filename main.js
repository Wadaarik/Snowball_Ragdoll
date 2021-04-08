import * as THREE from "./lib/three.module.js";
import Objects from "./objects.js";
import Global from "./global.js";


export default class Main{
    constructor() {
        this.update = this.update.bind(this);
        this.onResize = this.onResize.bind(this);
        this.initEvents = this.initEvents.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

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

        this.temp = new THREE.Vector3;
        this.dir = new THREE.Vector3;
        this.a = new THREE.Vector3;
        this.b = new THREE.Vector3;

        this.skyTexture= new THREE.TextureLoader().load("./assets/background.jpg", ()=>{//créer le background
            this.skyEquipMap = new THREE.WebGLCubeRenderTarget(1024).fromEquirectangularTexture(this.renderer, this.skyTexture);
            Global.instance.envMap = this.skyEquipMap;//instancie les futurs materiaux via singleton
            this.scene.background = this.skyEquipMap;

            // this.initPhysics();
            this.initObjects();
            this.sphere = this.objects.children[0];
        });

        this.camera.position.z = 5;
        this.camera.position.y = 5;
        this.camera.position.x = 0;
        this.camera.lookAt( this.scene.position );

        this.goal = new THREE.Object3D;
        this.follow = new THREE.Object3D;

        this.goal.add( this.camera );

        window.addEventListener('resize', this.onResize, false);
        document.body.appendChild(this.renderer.domElement);

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

        this.dlight = new THREE.DirectionalLight();//creer une directional light
        this.dlight.position.z = 5;
        this.dlight.position.x = 5;
        this.dlight.position.y = 5;
        this.dlight.castShadow = true;//active l'ombre pour la light
        this.dlight.shadow.mapSize.width = 2048;
        this.dlight.shadow.mapSize.height = 2048;
        this.dlight.shadow.bias = -0.0001;
        this.scene.add(this.dlight);

        this.helper = new THREE.DirectionalLightHelper(this.dlight, 1);//permet de voir où se trouve la directional light
        this.scene.add(this.helper);

        this.alight = new THREE.AmbientLight();
        this.alight.intensity = .4;
        this.scene.add(this.alight);

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

        if (this.sphere){
            this.a.lerp(this.sphere.position, 0.4);//permet de fixer la camera sur la position de la sphere
            this.b.copy(this.goal.position);//Copie les valeurs des propriétés x, y et z du vecteur3 pour la position du goal (la caméra est fixé dans le goal)

            this.dir.copy( this.a ).sub( this.b ).normalize();//Soustrait this.dir.copy(this.a) de this.b et prend la même direction
            const dis = this.a.distanceTo( this.b );//Calcule la distance du vecteur a au vecteur b.
            this.goal.position.addScaledVector( this.dir, dis );//Ajoute le multiple de this.dir et dis à la position de this.goal

            this.camera.lookAt( this.sphere.position );//la camera "regarde" la position de la sphere
        }

        // this.camera.position.z -= 1;
        this.renderer.render(this.scene, this.camera);

    }
}
new Main();