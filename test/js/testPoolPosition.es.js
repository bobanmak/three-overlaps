import * as THREE from '../../node_modules/three/build/three.module.js';
import Viewport from "../../node_modules/three-viewport/dist/viewport.es.js";
import WoodBox from "./WoodBox.js";
import Grassground from "./Grassground.es.js";
import { TransformControls  } from'../../node_modules/three/examples/jsm/controls/TransformControls.js';
import { PoolPosition  } from'../../src/three-poolposition.es.js';

(function () {

    // Viewport starts ---
    let VP = new Viewport();

    VP.init();
    VP.start();


    // add a ambient light
    VP.scene.add( new THREE.AmbientLight( 0x020202 ) );

    // add a light in front
    let light	= new THREE.DirectionalLight('white', 2);
    light.position.set(100, 100, 300);
    VP.scene.add( light );
   
    VP.camera.position.copy( new THREE.Vector3( 120, 2000, 2400) );
    VP.camera.rotation.copy( new THREE.Euler( -0.67, -2.8, -2.3 ) ) ;
    // Viewport ends ---

    const config = {
        interval: true,
        intervalTime: 1000,
        visualise: true
    };

    let Helper  = new PoolPosition();
    let constraints = [];
    let p, mesh;
    
    // available space
    let ground = new Grassground({
        width		: 2500,
        height		: 2500,
        repeatX		: 10,
        repeatY		: 10,
        "image" : "big"
    });

    VP.scene.add( ground );

    let box1 = createBox({ 
        size        : [500, 500, 500], 
        rotationY   : .33, 
        position    : [-800, 0, 0],
        name: "box1" 
    });

    let box2 = createBox({ 
        size        : [400, 500, 500], 
        rotationY   : .63, 
        position    : [-100, 0, -800],
        name: "box2" 
    });

    let box3 = createBox({ 
        size        : [100, 500, 1500], 
        rotationY   : -.63, 
        position    : [-200, 0, -100],
        name: "box3"  
    });

    //makeInteractive( box3 );

    constraints.push( box1, box2, box3 );

    let newBox = createBox({ 
        size        : [500, 500, 500], 
        rotationY   : -.33, 
        name: "newBox"  
    });

    let newPosition = Helper.findFreeSpace( ground, constraints, newBox, {} );
    newBox.position.copy( newPosition );
    
    if ( config.visualise ) visualiseVertices( Helper.getVertices( newBox ) );
    if ( config.interval ){
        setInterval( () => {

            newPosition = Helper.findFreeSpace( ground, constraints, newBox, {} );
            newBox.position.copy( newPosition );
            if ( config.visualise ) visualiseVertices( Helper.getVertices( newBox ) );

        }, config.intervalTime );
    }
        
    
    function visualiseVertices( list ){ 
        // add cubes on List of Points

        let deletable = VP.scene.getObjectByName( "deletable" );

        if ( typeof deletable === "undefined" ){
            deletable = new THREE.Group();
            deletable.name = "deletable";
            VP.scene.add( deletable );
        } 

        // delete old markers
        for (let i = deletable.children.length - 1; i >= 0; i--) {
            deletable.remove(deletable.children[i]);
        }

        let geometry = new THREE.BoxGeometry( 50, 50, 50 );
        let material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );

        for ( let i= 0; i < list.length ; i++ ){
            let cube = new THREE.Mesh( geometry, material );
            cube.position.copy( list[i] );
            
            deletable.add( cube );
        }
        
    };

    function createBox( param ){
        // createBox with parameter and add to scene
        mesh = new WoodBox( ...param.size );
        
        if ( param.rotationY ) mesh.rotation.y = param.rotationY;  
        if ( param.position ) mesh.position.set( ...param.position );

        p = mesh.geometry.parameters;
        mesh.geometry.applyMatrix4( new THREE.Matrix4().makeTranslation(  p.depth/2, p.width/2,  p.height/2 ) );
        mesh.name = "box";

        VP.scene.add( mesh );
        return mesh;
    };

    function makeInteractive( mesh ){


        let ctr = new TransformControls( VP.camera, VP.renderer.domElement );
       
        ctr.attach( mesh );
        
        ctr.addEventListener( 'dragging-changed', function( e ){
            VP.control.enabled = ! e.value 
        });
    

        VP.scene.add( ctr );

    };
   
})();




