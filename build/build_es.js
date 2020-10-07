const rollup  = require('rollup');
const resolve =require('rollup-plugin-node-resolve');
const buble = require('rollup-plugin-buble');
const replace = require("./replace.js");

const build_overlapsES = function( done ){
   
    rollup.rollup({
        input : 'src/three-overlaps.es.js',
        external: ['../node_modules/three/build/three.module.js', '../../node_modules/three/build/three.module.js'],
        
        plugins:[
            
            resolve(),
            
            buble({
				transforms: {
					arrow: false,
					classes: true
				}
            })
        ]
    }).then(( bundle ) => { 
        bundle.write({
            file: './dist/three-overlaps.es.js',
            plugins:[
                replace({
                    "../node_modules/three/" : "../../three/"
                })
            ],
            
            format: 'es',
            name: 'three',
            exports: 'named',
            sourcemap: true
          });
    }).catch(
        (err)=>{console.error(err);}
    );
};

module.exports = build_overlapsES;