# Lab

## Lab 7.1 - Creating a Module

The labs-1 folder has an index.js file. Write a function that takes two numbers and adds them
together, and then export that function from the index.js file.

Run npm test to check whether index.js was correctly implemented. If it was the output
should contain "passed!":
![07.Lab.7.1a](/assets/image/07.Lab.7.1a.png)
By default, the labs-1 folder is set up as a CJS project, but if desired, the package.json can be modified to convert to an ESM module (by either setting the type field to module or renaming index.js to index.mjs and setting the type field accordingly). The exercise can be completed either with the default CJS or with ESM or both.

## Lab 7.2 - Loading a Module

The labs-2 is a sibling to labs-1.In the index.js file of labs-2, load the module that was
created in the previous lab task and use that module to console.log the sum of 19 and 23.

The labs-2 folder is set up as a CJS project. Recall that ESM can load CJS but CJS cannot load ESM during initialization. If the prior exercise was completed as an ESM module it cannot be synchronously loaded into a CJS module. Therefore if the prior exercise was completed in the form of an ESM module, this exercise must also be similarly converted to ESM.

When index.js is executed with node it should output 42.
then run npm test to check whether index.js was correctly implemented. If it was, the output should contain "passed!":
![07.Lab.7.2a](/assets/image/07.Lab.7.2a.png)
