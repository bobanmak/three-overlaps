import * as THREE from '../../node_modules/three/build/three.module.js';
import Viewport from "../../node_modules/three-viewport/dist/viewport.es.js";
import WoodBox from "./WoodBox.js";
import Grassground from "./Grassground.es.js";


(function () {
    
    let VP;

    VP = new Viewport();

    VP.init();
    VP.start();

    VP.camera.position.z = 500;

    // add a ambient light
    VP.scene.add( new THREE.AmbientLight( 0x020202 ) );

    // add a light in front
    let light	= new THREE.DirectionalLight('white', 2);
    light.position.set(100, 100, 300);
    VP.scene.add( light );

    //box number one
    let mesh1 = new WoodBox(100, 100, 100);
    mesh1.name = "box_1";
    mesh1.position.set(-200, 50, 0);

    VP.scene.add( mesh1 );

/*
    let box = new THREE.Mesh( new THREE.BoxGeometry(40,40,40),new THREE.MeshBasicMaterial({color:"yellow"}) );
    box.name = "box_yellow_1.1";
    box.position.set(0, 50, 0);
    */

   let ground = new Grassground({
        width		: 2000,
        height		: 2000,
        repeatX		: 10,
        repeatY		: 10,
        "image" : "big"
    });

    VP.scene.add( ground );
   
})();

