import * as THREE from '../node_modules/three/build/three.module.js';

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
};

Object.assign( PoolPosition.prototype, {
    
    constructor: PoolPosition,

    findFreeSpace: function( scene, el, opts ){

        if ( !el ){
            console.error( "The Element is not defined!", el );
            return;
        }

        if ( !scene ) return this.options.poolPosition;
     
     
        if ( opts && opts.neighbour ){

        }
        
        if ( opts && opts.entagled ){

        }

        return this.options.poolPosition;

    }

});


export default PoolPosition;
export { PoolPosition };
