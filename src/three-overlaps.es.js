import * as THREE from '../node_modules/three/build/three.module.js';


const Overlaps = function()
{
    this.info = "Overlaps";
    this.raycaster = new THREE.Raycaster();

};

Object.assign( Overlaps.prototype, {
    constructor: Overlaps,

    testIntersect: function( mesh, objects ){

        let list = objects.filter( function( o ) {
            return o.uuid !== mesh.uuid;
        });

        let res = this.testIntersectList( mesh, list );

        /* test custom event
        let eventName = res ? "Intersection" : "NoIntersection";
        
        mesh.intersection = function(){
            this.dispatchEvent( "intersection"  );
        };
        */
        
        if ( res ) console.log("Intersects: ", res);
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
      
    },

    onGround: function( object, target ){
        
        let direction = new THREE.Vector3(0,-1,0);
        let points =  this.getVerticesList( object );
        let intersects = [];


        for( let i = 0; i < points.length; i++){
            this.raycaster.set( points[i], direction );
            intersects = this.raycaster.intersectObject( target ) ;
            
            if ( intersects.length === 0 )  return false;
        }

        return true;

    },

    getVerticesList: function( objMesh ){

        objMesh.geometry.computeBoundingBox();
        let boundingBox = objMesh.geometry.boundingBox.clone() ;
        let shiftY = 10;

        let width = Math.abs( boundingBox.max.x - boundingBox.min.x );
        let depth = Math.abs( boundingBox.max.z - boundingBox.min.z );

        let rotY = objMesh.rotation.y;
        let c = Math.cos(rotY);
        let s = Math.sin(rotY);
        let c1 = Math.cos(rotY + Math.PI/2);
        let s1 = Math.sin(rotY + Math.PI/2);

        let p0 = new THREE.Vector3( objMesh.position.x, objMesh.position.y + shiftY, objMesh.position.z  ); // left
        let p1 = new THREE.Vector3( p0.x + width*s , p0.y + shiftY, p0.z + depth*c ); // right
        let p2 = new THREE.Vector3( p0.x + width*s1, p0.y + shiftY, p0.z + depth*c1 ); // right down
        let p3 = new THREE.Vector3( p1.x + width*s1, p1.y + shiftY, p1.z + depth*c1 ); // left down

        return [ p0, p1, p2, p3 ];
    }
});


export default Overlaps;
export { Overlaps };
