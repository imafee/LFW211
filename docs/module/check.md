# Knowledge Check

## Question 7.1

A package folder has a package installed named foo, but there is also a foo.js file in the package folder. Another file called bar.js is in the package folder, bar.js is a sibling
to foo.js. The bar.js file contains a require('foo') statement. Which module does bar.js load?

- A. The index.js file of the foo package
- B. The main file of the foo package
- C. The foo.js file

## Question 7.2

Given a function named func, how can func be exposed from a CJS module such that when the file that func is in is loaded by another module, the result of
the require statement is func?

- A. `module.exports = func`
- B. `export func`
- C. `module.exports = { func }`

## Question 7.3

Given a function named func, how can func be exposed from an ESM module such that when the file that func is in is loaded by another module, the myModule reference of the statement import myModule from './path/to/func/file.js' statement
is func?

- A. `module.exports = func`
- B. `export const func = () => { ... }`
- C. `export default function func () {...}`
