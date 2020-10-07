import * as THREE from '../node_modules/three/build/three.module.js';


const Overlaps = function()
{
    this.info = "Overlaps";
};

Object.assign( Overlaps.prototype, {
    constructor: Overlaps,

    testIntersect: function( mesh, objects ){

        let list = objects.filter( function( o ) {
            return o.uuid !== mesh.uuid;
        });

        let res = this.testIntersectList( mesh, list );
        console.log("Intersects: ", res);
    },

    testIntersectList: function( mesh, list ){
                                
        if ( !mesh.geometry.boundingBox ) mesh.geometry.computeBoundingBox();
        mesh.updateMatrixWorld();

        let bbox2 = mesh.geometry.boundingBox.clone() ;
        bbox2.applyMatrix4( mesh.matrixWorld );

        for ( let i = 0; i < list.length; i++ ) {

            let obj = list[i];
            // get BoundingBox innerWall
            obj.updateMatrixWorld();

            if ( !obj.geometry.boundingBox ) obj.geometry.computeBoundingBox();
            
            let bbox1 = obj.geometry.boundingBox.clone();
            bbox1.applyMatrix4( obj.matrixWorld );
            
            // get BoundingBox intersection
            let intersects = bbox1.intersectsBox( bbox2 );

            if ( intersects ) return true;
        } 
        
        return false;
      
    }
});


export default Overlaps;
export { Overlaps };
