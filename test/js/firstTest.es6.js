import * as THREE from '../../node_modules/three/build/three.module.js';
import Viewport from "../../node_modules/three-viewport/dist/viewport.es.js";
import WoodBox from "./WoodBox.js";
import Grassground from "./Grassground.es.js";
import { TransformControls  } from'../../node_modules/three/examples/jsm/controls/TransformControls.js';
import { Overlaps  } from'../../src/three-overlaps.es.js';



(function () {
    
    let VP;
    VP = new Viewport();

    VP.init();
    VP.start();

    let test = new Overlaps();
    let controls = [];
    let objects  = [];

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
    makeInteractive( mesh1 );

    //box number two
    let mesh2 = new WoodBox(110, 80, 65);
    mesh2.name = "box_2";
    mesh2.position.set(-300, 50, 0);

    VP.scene.add( mesh2 );
    makeInteractive( mesh2 );


   let ground = new Grassground({
        width		: 2000,
        height		: 2000,
        repeatX		: 10,
        repeatY		: 10,
        "image" : "big"
    });

    VP.scene.add( ground );   

    function makeInteractive( mesh ){

        objects.push( mesh );

        let ctr = new TransformControls( VP.camera, VP.renderer.domElement );
       
        ctr.attach( mesh );
        
        ctr.addEventListener( 'dragging-changed', function( e ){
            VP.control.enabled = ! e.value 
        });
        
        // on change position
        ctr.addEventListener( 'change', function(){
            test.testIntersect( mesh, objects ) 
        });

        controls.push( ctr );
        VP.scene.add( ctr );

    }

   
})();




