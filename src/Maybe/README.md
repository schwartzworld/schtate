### Nothing - A saner way of declaring non-existence

There is only one `nothing` in any project. It's not undefined or null. It's just nothing. You should
never have to interact with `nothing` directly as it's an implementation
detail of `Maybe` but it's good to know about, nevertheless. If you need to create a `Maybe` of nothing
consider using `Maybe.nothing`. Don't forget to type it!

```typescript
const nothing = Maybe.nothing<string>();
```

### Maybe - For things that may or may not exist

#### Defining the problem

Some things exist, and some don't. Whether it's an API response, a database query or whatever, we often need to
account for things not being there. The average developer writes a lot of code to account for nothingness. There are
a lot of ways to do this.

```typescript
const user = response?.user; // nullable chaining
const name = user ? user.name : null; // ternary

let letters;
if (name) {
  letters = name.split(''); // if / else
} else {
  letters = [];
}
```

This is fine. It's totally fine. It works, and as a result, most code bases are littered with conditional checks and
fallback values. Totally fine. But what if there's a better way?

#### Enter the `Maybe`

`Maybe` lets you write code that operates on your data without worrying
if the data is actually present. There is already precedent for this in JavaScript promises.

```typescript
someAsyncFunction().then((data) => doSomething(data));
```

In the above example, `.then` only gets called after the Promise resolves. If the promise never
resolves, `.then` never gets called. Once you internalize this pattern, it becomes very powerful, because you
can describe a sequence of actions, without any checks, and know that the steps will execute in the order you
describe.

`Maybe` works more or less the same way. You can wrap a variable or the output of a function in `Maybe`,
and you can write code that operates on that data as if it were present (or not present) without ever checking
what the actual value is.

```typescript
// Maybe you get a string, maybe not?
const optionalString = Math.random() > 0.5 ? "words go here" : null;
const maybeString = Maybe.of<string>(optionalString); // Wrap the value in a Maybe

// If the string exists, returns a Maybe with the string's length as its value
const length: Maybe<number> = maybeString.map((value) => {
  return value.length;
});

length.something((value) => {
  console.log(value); // only executes if value is present
}).nothing(() => {
  console.log('value missing') // only executes if value is missing
});
```

#### Matching the JavaScript `Array` API

`Maybe` implements the `schtate` interface, meaning it has methods that match the JS Array API, namely `Map` and `Reduce`.

```typescript
const user = Maybe.fromFunction<User>(getUser);
const firstPost = user.map<string>(u => u.posts[0]);
const total = firstPost.reduce<number>((total, post) => {
  return total + post.length;
}, 0);
```

#### Creating a `Maybe`

`Maybe` can be created from a value or a callback. If the value is `null` or `undefined`, you'll get a
`Maybe` of `nothing`. If the value itself is a `Maybe`, it'll get flattened (no `Maybe<Maybe<string>>`)

There are also utility method for creating a typed `Maybe` of nothing. This is useful for testing.

```typescript
const m = Maybe.of<string>('hello') // Maybe of string
const n = Maybe.of(undefined) // nothing
const o = Maybe.of<string>(Math.random() > 0.5 ? 'hello' : null); // could be either one
const p = Maybe.nothing<string>();

const q = Maybe.fromFunction<string>(() => queryFromDB());
```

#### Getting the value out of a `Maybe`

At a certain point, you are inevitably going to need to interact with code that doesn't expect a `Maybe`.
Maybe you need to post your value to the API or the DB, maybe you want to update a DOM node with the value.
Because this is JavaScript you _could_ inspect the value of the `Maybe` directly, but you shouldn't because
that brings us right back to If-ville. This is one of the many reasons why this library is easier to use with
TypeScript.

```typescript
const m = Maybe.of(whatever);
const v = m.value; // TypeScript won't like this
if (v) {
  postToAPI(v);
} else {
  console.log("value is not present");
}
```

Instead, `Maybe` includes 3 methods.

##### `Maybe.prototype.something` and `Maybe.prototype.nothing`

`something`: You provide a callback that executes if something is there.

`nothing`: You provide a callback that executes if nothing is there.

Both methods return the same `Maybe` they were called on, meaning you can endlessly chain them. See how
the above example works with these methods.

```typescript
const m = Maybe.of(whatever);
m.something((value) => {
  postToAPI(value);
}).nothing(() => console.log("value is not present"));
```

##### `Maybe.prototype.match`

This is the escape hatch, the only "right" way of extracting the value from a Maybe. This gets you out of your endless
`Maybe` chain and back into If-ville. In the example below, `notAMaybe` will either be your value times 2, or it will be zero.

```typescript
const m = Maybe.of<number>(whatever);

const notAMaybe = m.match({
  something: (value: number) => value * 2,
  nothing: () => 0
});
```

A less contrived example, in ReactJS:

```typescript
type UserData = { username: string, age: number }
const Component: FC<{user: Maybe<UserData>> = ({ user }) => {
  return user.match({
    something: (u) => <Greeting name={u.name} />
    nothing: () => <Redirect to="/login" />
  });
};
```
