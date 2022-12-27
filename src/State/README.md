
### State - An all-purpose algebraic container

Most of the job I do as a professional dev involves retreiving, modifying and storing data. 
`State` is an all-purpose box to stick your data into. It's immutable, but offers methods for working with 
the data.

#### Matching the JavaScript `Array` API

Seasoned JS devs use arrays a lot, because they have a great API for interacting with them. Methods like
`map`, `reduce` and `filter` allow functional programming techniques that give you a great deal of certainty
in your code, and are chainable because each returns a new array. They work just as well on empty arrays as
they do on ones with values. These methods are often applied to regular objects
by converting the objects to arrays with `Object.keys`, `Object.values` and `Object.entries`. `State` implements the
`schtate` interface, offering `map` and `reduce` methods to give you the same easy language for describing your data changes.

State is at the heart of all the other algebraic data types in this library.

```typescript
const score: State<number> = State.of(0);
const mapped: State<number> = score.map(value => value + 1);
const reduced: State<string> = mapped.reduce((outputStr, value) => {
    return outputStr + String(value);
}, 'The final score is ');
```

#### State.prototype.match

The `match` instance method is the only valid way to access or retrieve the value from a `State`.
Almost all your interaction with the inner value should be within the context
of one of its callbacks, but sometimes you need to get the value out.

```typescript
const word: State<string> = State.of("hello");
const length: State<number> = word.map(str => str.length);
const unwrapped: string[] = length.match(num => {
    return new Array(num).fill('hello');
});
``` 

Or in the context of a React app:

```typescript
type Post = { author: string; wordCount: number, writtenAt: Date, tags: string[] }; 
const ByLine: FC<{ post: State<Post> }> = ({ post }) => {
    return post.match(({ author, writtenAt }) => {
        return <div>
            <h3>{author}</h3>
            <small>{writtenAt.toLocaleString()}</small>
        </>
    })
}
```
