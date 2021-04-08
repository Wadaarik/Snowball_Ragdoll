import * as THREE from "./lib/three.module.js";
import Objects from "./objects.js";
import Global from "./global.js";

import { OutlineEffect } from '/lib/OutlineEffect.js';

// Score
var score = 0;

export default class Main {
    constructor() {
        this.update = this.update.bind(this);
        this.onResize = this.onResize.bind(this);
        this.initEvents = this.initEvents.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.initPhysics = this.initPhysics.bind(this);

        this.scene;
        this.camera;
        this.renderer;
        this.particleLight;

        // Score
        this.score = 0;

        this.init();

        this.scaleMax = 2;
        this.currentScale = 1;
    }

    init() {
        this.scene = new THREE.Scene();//scene

        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);//camera

        //this.scene.add(new THREE.AmbientLight(0xFFFFFF));

        this.renderer = new THREE.WebGLRenderer({antialias: true});//renderer
        this.renderer.setPixelRatio(window.devicePixelRatio);
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

        this.skyTexture = new THREE.TextureLoader().load("./assets/background.jpg", () => {//créer le background
            this.skyEquipMap = new THREE.WebGLCubeRenderTarget(1826).fromEquirectangularTexture(this.renderer, this.skyTexture);
            Global.instance.envMap = this.skyEquipMap;//instancie les futurs materiaux via singleton
            this.scene.background = this.skyEquipMap;

            this.initPhysics();
            this.initObjects();

            this.sphere = this.objects.children[0];
        });

        this.camera.position.z = 2;
        this.camera.position.y = 5;
        this.camera.rotation.x = THREE.Math.degToRad(-45);
        this.camera.lookAt(this.scene.position);

        this.goal = new THREE.Object3D;
        this.follow = new THREE.Object3D;

        this.scene.add(this.camera);

        window.addEventListener('resize', this.onResize, false);
        document.body.appendChild(this.renderer.domElement);
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.effect = new OutlineEffect(this.renderer);

        this.update();
        this.initEvents();
    }

    initEvents() {
        document.body.addEventListener("keydown", this.onKeyDown);
    }

    onKeyDown(event) {
        var keyCode = event.keyCode;
        if (keyCode == 37) {
            if (this.SphereBody.position.x > -3) {
                this.SphereBody.position.x -= .2;
            }
        } else if (keyCode == 39) {
            if (this.SphereBody.position.x < 3) {
                this.SphereBody.position.x += .2;
            }
        }

    }

    initPhysics(){
        this.meshes = [];
        this.bodys = [];
        this.world = new CANNON.World();
        this.world.gravity.set(0, - 9.8, 0);// m/s²
        this.world.broadphase = new CANNON.SAPBroadphase(this.world);
        this.frameRate = 60.0; //fps
        this.fixedTimeStep = 1.0 / this.frameRate; // seconds
    }


    initObjects() {

        this.dlight = new THREE.DirectionalLight();//creer une directional light
        this.dlight.position.z = 0;
        this.dlight.position.x = 5;
        this.dlight.position.y = 5;
        this.dlight.castShadow = true;//active l'ombre pour la light
        this.dlight.shadow.mapSize.width = 2048;
        this.dlight.shadow.mapSize.height = 2048;
        this.dlight.shadow.bias = -0.0001;
        this.scene.add(this.dlight);

        //this.helper = new THREE.DirectionalLightHelper(this.dlight, 1);//permet de voir où se trouve la directional light
        //this.scene.add(this.helper);

        this.alight = new THREE.AmbientLight();
        this.alight.intensity = .15;
        this.scene.add(this.alight);

        this.objects = new Objects();
        // console.log(this.objects);

        this.scene.add(this.objects);

        this.addToWorld(this.objects.ground, 0, new CANNON.Box(new CANNON.Vec3(9/2, 1/2, 1000/2)));//ajoute le ground dans le monde

        this.SphereBody = this.addToWorld(this.objects.children[0], 5, new CANNON.Sphere(1));
        this.SphereBody.name = "snowballBody";
        console.log(this.objects.ground);

    }

    addToWorld(mesh, mass, shape){
        var position = new CANNON.Vec3();
        position.copy(mesh.position);

        var quaternion = new CANNON.Quaternion();
        quaternion.copy(mesh.quaternion);

        var body = new CANNON.Body({//creer un body, donne une position et une quaterion du dessus, une shape et une masse
            position: position,
            quaternion: quaternion,
            shape: shape,
            mass: mass
        });

        this.world.addBody(body);
        this.meshes.push(mesh);
        this.bodys.push(body);

        return body;
    }

    onResize() {//permet de resizer automatiquement la scene en fonction de la taille de la fenêtre
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }



    update(time) {
        requestAnimationFrame(this.update);

        

        this.objects && this.objects.update();

        if (this.sphere) {
            // this.a.lerp(this.sphere.position, 0.4);//permet de fixer la camera sur la position de la sphere
            // this.b.copy(this.goal.position);//Copie les valeurs des propriétés x, y et z du vecteur3 pour la position du goal (la caméra est fixé dans le goal)
            //
            // this.dir.copy( this.a ).sub( this.b ).normalize();//Soustrait this.dir.copy(this.a) de this.b et prend la même direction
            // const dis = this.a.distanceTo( this.b );//Calcule la distance du vecteur a au vecteur b.
            // this.goal.position.addScaledVector( this.dir, dis );//Ajoute le multiple de this.dir et dis à la position de this.goal

            this.effect.render(this.scene, this.camera);

            // this.camera.target = this.SphereBody.position;
            this.camera.position.z = this.SphereBody.position.z +2;
            this.camera.position.y = this.SphereBody.position.y +10;
            // this.camera.lookAt( this.sphere.position );
        }

        //CANNONJS
        if (this.bodys){
            for (let i=0; i<this.bodys.length; i++){//parcours le tableau body
                if (this.bodys[i].world){//verifie que le body a un world (intégré à l'univers cannonjs)
                    this.meshes[i].position.copy(this.bodys[i].position);//copy toutes les propriétés de son vecteur positions en mesh
                    this.meshes[i].quaternion.copy(this.bodys[i].quaternion);//copy toutes les propriétés de son vecteur rotation (quaterion) en mesh
                }
            }
            if (this.lastTime !== undefined){//met à jour cannonjs
                var delta = (time - this.lastTime) / 1000;
                this.world.step(this.fixedTimeStep, delta, this.frameRate);
            }
            this.lastTime = time;
        }


        // setInterval(()=>{
        if (this.objects){
            if (this.currentScale < this.scaleMax){
                this.currentScale += .001;

                this.objects.children[0].scale.set(this.currentScale, this.currentScale, this.currentScale);

                this.SphereBody.shapes[0].radius = .25 * this.currentScale;
                console.log(this.currentScale);
                this.SphereBody.shapes[0].boudingSphereRadius = .25 * this.currentScale;
                this.SphereBody.updateBoundingRadius();

                // console.log("spherebody : ", this.SphereBody.shapes);

            }
        }

        // }, 2000);

    }
}

document.getElementById("start").addEventListener('click', event => {
    score = 0;
    new Main();
    document.getElementById("start").remove();
    document.querySelector("h1").remove();
    document.getElementById("restart").style.display = "block";
    document.getElementById("score").style.display = "block";
});

document.getElementById("restart").addEventListener('click', event => {
    document.querySelector("canvas").remove();
    score = 0;
    new Main();
});

// Update du score chaque seconde
setInterval(function(){
    score++;
    document.getElementById("score").innerHTML = score;
}, 1000);