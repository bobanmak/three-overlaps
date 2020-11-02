import * as THREE from '../node_modules/three/build/three.module.js';
import { Overlaps  } from './three-overlaps.es.js';


/**
 * newEL = { width, height, deepth }; // Object3D
 * 
 * opts = {
 *      neighbour: object3D,
 *      entangled: object3D
 * }
 * 
 * findFreeSpace( scene, newEl, opts );
 */

const defaults = {

    poolPosition: new THREE.Vector3( 100, 0, 100 ),
    poolRotation: new THREE.Euler( 0, 45, 0 ),
    forceStop: 200

};

const PoolPosition = function( opts )
{
    this.info = "Pool-Position";
    this.options = Object.assign( {}, defaults, opts );
    this.overlap = new Overlaps();
    this.limit   = [];
};

Object.assign( PoolPosition.prototype, {
    
    constructor: PoolPosition,

    /** Make Vertecies Validation mesh/geometry/vertices
     * 
     * https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
     * 
     * @param {* Ground Mesh - Polygon } availableSpace 
     * @param {* List with Constraints - Meshes} constraints 
     * @param {* Element to place} el 
     * @param {* Additional Options} opts 
     * 
     * opts : axis-aligned, separating-axis, default: axis-aligned
     */
    findFreeSpace: function( availableSpace, constraints, element, opts ){

        // Gives Object back

        let scope = this;
        let loops = 0;
        let isValid = false;
        this.limits = [];

        let res = {} ;



        // Validation        
        if ( !availableSpace ) {
              return {
                position: this.options.poolPosition,
                source: "default_values"
            }
        };

        if ( !element ){
            console.error( "The Element is not defined!", element );
            return;
        }
          
        if ( opts && opts.neighbour ){
            
            // check right, check left and check monteCarlo

            let v = this.getVertices( opts.neighbour );
            
            res.source    = "neighbour_right";
            res.position  = new THREE.Vector3(v[2].x+.5, v[2].y , v[2].z)  ; // default right vertice 
            res.rotationY = 1.54;
            isValid = this.hasValidPosition( element, res.position, availableSpace, constraints );
            
            if ( opts.side === "left" || !isValid ){
                
                res.source = "neighbour_left";

                let shiftAmmount = this.getMeshSize( element );
                res.position     = this.shiftPosition( new THREE.Vector3(v[0].x-.5, v[0].y , v[0].z), -shiftAmmount.width, element.rotation.y ); // left vertices shifted on bbox width
        
                isValid = this.hasValidPosition( element, res.position, availableSpace, constraints );
                if ( !isValid ) recursiveSearch();

                // test bounce back - newPositon = this.shiftPosition( v[0], shift, element.rotation.y ); // left vertices shifted on bbox width
            
            } 

            if ( opts.side === "top" ){
                
                res.source = "neighbour_top";

                let shiftAmmount = this.getMeshSize( opts.neighbour );
                res.position     = new THREE.Vector3(v[0].x, v[0].y +shiftAmmount.height , v[0].z) 
        
                

                // test bounce back - newPositon = this.shiftPosition( v[0], shift, element.rotation.y ); // left vertices shifted on bbox width
            
            } 

            return res;
        }
       
        else {
            recursiveSearch();
            return res;
        }

        function recursiveSearch(){
            res.source = "random_search";
    
            while( !isValid ){
                
                if ( loops > defaults.forceStop){
                    res.source = "random_search_stopped";
                    res.position = null; 
                    break;
                }
            
                res.position = scope.generateRandomPosition( availableSpace );
                isValid      = scope.hasValidPosition( element,  res.position, availableSpace, constraints );
                
                loops++;
                if ( !isValid ) continue;
            }
        }

    },

    hasValidPosition: function ( element, newPosition, availableSpace, constraints ) {
       
        element.position.copy( newPosition );

        let onGround        = this.overlap.onGround( element, availableSpace );
        let csIntersection  = this.overlap.testIntersectList( element, constraints );

        return onGround && !csIntersection;
    },

    generateRandomPosition: function( availableSpace ){
        
        // get limit of the available space
        let limits = this.limits.length === 0 ? this.getLimits( availableSpace ) : this.limits;   

        return new THREE.Vector3( this.getRndInteger( limits[0].x ), 0, this.getRndInteger( limits[0].z ) );
    
    },

    getLimits: function( availableSpace ){
        // limit available space to the boundingBox
        let boundingBox;
        let limits = [];
       
        availableSpace.updateMatrixWorld();
        availableSpace.geometry.computeBoundingBox();
        
        boundingBox = availableSpace.geometry.boundingBox.clone() ;
        boundingBox.applyMatrix4( availableSpace.matrixWorld );

        limits.push({
            x: [ boundingBox.min.x, boundingBox.max.x ],
            z: [ boundingBox.min.z, boundingBox.max.z ]
        });
           
        this.limits = limits;
            
        return limits;

    },

    getRndInteger: function( arr ) {
    
        //return Math.floor( Math.random() * (arr[1] - arr[0] + 1) ) + arr[0];
        return Math.floor(arr[0] + Math.random()*(arr[1] + 1 - arr[0]))

    },

    getVertices: function( mesh ) {
        return this.overlap.getVerticesList( mesh );
    },

    getMeshSize: function( objMesh ){
        objMesh.geometry.computeBoundingBox();
        let boundingBox = objMesh.geometry.boundingBox.clone() ;

        let width = Math.abs( boundingBox.max.x - boundingBox.min.x );
        let depth = Math.abs( boundingBox.max.z - boundingBox.min.z );
        let height = Math.abs( boundingBox.max.y - boundingBox.min.y );

        return { width, depth, height };
    },

    shiftPosition: function ( startVector, length, angle ) {

        let c = Math.cos( angle );
        let s = Math.sin( angle );

        let result = [
            startVector.x + c*length,
            startVector.y,
            startVector.z - s*length
        ];

        return new THREE.Vector3().fromArray( result );
    }


});


export default PoolPosition;
export { PoolPosition };
