### Bool - Saving you from your own conditional logic
#### What's wrong with Booleans?

In JS, we have a built in `Boolean` type that can wrap any value.
There are a few problems with them though.

For one, JS Booleans have a typecasting problem. `Boolean(0)` evaluates to `false`.
This is a problem in cases where we are expecting a number and 0 is a valid
input. The same problem exists with `Boolean('')`, is an empty
string necessarily a falsy value?

Type coercion aside, JS Booleans also encourage the use of conditional
logic. `If/else` and ternary statements and Boolean operators. If you have
never written a "one-liner" like below, congratulations, you win.

```typescript
const headerText = userIsLoggedIn
    ? user.age === undefined
        ? `You are ${user.age} years old'
        : someOtherVariable || 'defaultValue
    : isFirstTime
        ? 'Welcome stranger'
        : props.message || 'Welcome';
```

Which brings us to `Bool`. `Bool` hides its internal value, much like
`Maybe` above. You can only get to it in the body of the `map` method.
The `map` method is the way to compound booleans. You can't just string
together a bunch of `||` and `&&` and `? : ;`. Sure it's a little wordy,
but that verboseness is better than mishmoshing everything together in
a single expression.

```typescript
const coinFlip = () => Math.random() > 0.5;
const result = Bool.of(coinFlip());
const compoundedResult = result.map((value: boolean) => {
  return value && coinFlip();
});
const alwaysFalse = compoundedResult.map(value => value && false);
```

You don't need to actually access the value to operate on it. Just like
`Maybe`, `Bool` includes callback functions that will execute if the value
is truthy or falsy. The functions can be easily chained.

```typescript
Bool.of(coinFlip())
    .true(() => console.log('i won')) // will execute if true
    .false(() => console.log('i lost')); // will execute if false
```

Eventually, you might need to access the value of a `Bool`. `Bool` has
a pattern-matching function on it, just like `Maybe`. You should
avoid unwrapping them if you don't need to.

```typescript
return coinFlip({
    true: () => <Redirect to="/winner" />
    false: () => <div>You lose</div>
})
```
