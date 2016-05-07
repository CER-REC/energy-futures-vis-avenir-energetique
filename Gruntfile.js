module.exports = function(grunt)
{
    "use strict";
    
    grunt.loadNpmTasks("grunt-jasmine-bundle");
 
    grunt.initConfig({
      spec: {
        unit: {
          options: {
            minijasminenode: {
              showColors: true
            }
          }
        }
      }
    });
};