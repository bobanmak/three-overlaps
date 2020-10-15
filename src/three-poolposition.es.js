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

    poolPosition: new THREE.Vector3( 100, 0, 100 )

};

const PoolPosition = function( opts )
{
    this.info = "Pool-Position";
    this.options = Object.assign( {}, defaults, opts );
    this.overlap = new Overlaps();
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
    findFreeSpace: function( availableSpace, constraints, element, opts, scene ){

        let freeSpaceFound = false;
        let newPositon;

        // Validation        
        if ( !availableSpace ) return this.options.poolPosition;
        if ( !element ){
            console.error( "The Element is not defined!", element );
            return;
        }
        // Validation ends
          
        if ( opts && opts.neighbour ){ }
        
        else if ( opts && opts.entagled ){ }

        else {

            // without rules or other limitation, random method
            while( !freeSpaceFound ){
            
                newPositon = this.generateRandomPosition( availableSpace );

                element.position.copy( newPositon );

                let onGround        = this.overlap.onGround( element, availableSpace );
                let csIntersection  = this.overlap.testIntersectList( element, constraints );

    
                if ( !onGround || csIntersection  ){
                    continue;
                } else {
                    freeSpaceFound = true;
                }

                 
            }
        }

        return newPositon;

    },

    generateRandomPosition: function( limit ){
        // limit available space to the boundingBox
       
        limit.updateMatrixWorld();
        limit.geometry.computeBoundingBox();
        let boundingBox = limit.geometry.boundingBox.clone() ;
        boundingBox.applyMatrix4( limit.matrixWorld );


        let x = [ boundingBox.min.x, boundingBox.max.x ];
        let z = [ boundingBox.min.z, boundingBox.max.z ];


        return new THREE.Vector3( this.getRndInteger(x), 0, this.getRndInteger(z));
    
    },

    getRndInteger: function( arr ) {
    
        //return Math.floor( Math.random() * (arr[1] - arr[0] + 1) ) + arr[0];
        return Math.floor(arr[0] + Math.random()*(arr[1] + 1 - arr[0]))

    },

    getVertices: function( mesh ) {
        return this.overlap.getVerticesList( mesh );
    }


});


export default PoolPosition;
export { PoolPosition };
