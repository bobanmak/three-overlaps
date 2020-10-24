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
    forceStop: 20

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

        let freeSpaceFound = false;
        let newPositon;
        let loops = 0;
        this.limits = [];

        // Validation        
        if ( !availableSpace ) return this.options.poolPosition;
        if ( !element ){
            console.error( "The Element is not defined!", element );
            return;
        }
        // Validation ends
          
        if ( opts && opts.neighbour ){ 
            // left, right
            let v = this.getVertices( opts.neighbour );
            
            if ( opts.side && opts.side === "left" ){

                let shiftAmmount = this.getMeshSize( element );

                return this.shiftPosition( v[0], -shiftAmmount.width, element.rotation.y );
            } 

            return v[2]; // default right
        }
       
        else {

            // without rules or other limitation, random method
            while( !freeSpaceFound ){

                if ( false && loops > defaults.forceStop ){
                    console.log("loops: ", loops);
                    freeSpaceFound = true;
                } 
            
                newPositon = this.generateRandomPosition( availableSpace );

                element.position.copy( newPositon );

                let onGround        = this.overlap.onGround( element, availableSpace );
                let csIntersection  = this.overlap.testIntersectList( element, constraints );
                loops++;
    
                if ( !onGround || csIntersection ){
                    continue;
                } else {
                    console.log("loops: ", loops);

                    freeSpaceFound = true;
                }

                 
            }
        }

        return newPositon;

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

        return { width, depth };
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
