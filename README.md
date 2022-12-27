# schtate

## Functional Wrappers for State Management

This library offers algebraic data types for managing state.

### Motivation

Don't worry, if you aren't familiar with algebraic data types, this library is designed
to be easy to consume regardless of prior functional programming experience.

I think it's safe to say that arrays are the most heavily leaned upon
data structure we have in JavaScript/Typescript. This is because the JS language was
modified to include a rich API for arrays. This API is inspired heavily by functional programming.
You can write pure functions that act on each item of your array (if there are any)
and you get a new copy of the array with each one. Even when modeling data as
an object, it's common to convert the object to an array to iterate over it. `Schtate`
aims to make it as easy to work with other types of data as it is to work with arrays.

### Do I need to know Functional Programming to use `schtate`?

Inheriting code that uses FP can be daunting, as it can look quite different
from imperative code. Composing functions into pipelines is pretty convenient, but 
if you aren't used to seeing it, it can be daunting and hard to read.

`Schtate` is designed to be easy to read and write to anybody who is familiar with Arrays and Promises.
It is unlikely to be a full replacement for functional programming libraries like `fp-ts` or `ramda`.


## Documentation

#### [State](src/State/README.md)
#### [Maybe](src/Maybe/README.md)
#### [Bool](src/Bool/README.md)
#### [Either](src/Either/README.md)
#### [Result](src/Result/README.md)
