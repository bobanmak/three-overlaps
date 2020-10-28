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
        interval: false,
        intervalTime: 1000,
        visualise: true
    };

    let Helper  = new PoolPosition();
    let constraints = [];
    let p, mesh, lastInserted;
    
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
        size        : [300, 300, 300], 
        position    : [650, 0, 0],
        name: "box1" 
    });

    constraints.push( box1 );
    lastInserted = box1;

    let fillSpace = setInterval( ()=>{
        //console.log("lastInserted; ", lastInserted );
        let newBox = createBox({ 
            size        : [300, 300, 300], 
            name: "newBox"  
        });

        let freeSpace = Helper.findFreeSpace( ground, constraints, newBox, { neighbour: lastInserted } );
        console.log( freeSpace );
        if ( !freeSpace.position ) {
            VP.scene.remove( mesh );
            clearInterval(fillSpace);
        } 
        else{
            newBox.position.copy( freeSpace.position );
            constraints.push( newBox );
            lastInserted = newBox;

            if ( config.visualise ) visualiseVertices( Helper.getVertices( newBox ) );
        }

        
    }, 1000 );

    

  

    

    
  
    
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




