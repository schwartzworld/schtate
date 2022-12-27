### Result

`Result` is a convenient abstraction over `Either<Data, Error>`. It's a 
`sum type` that is either a result of some kind or an error message.

```typescript
type MyAPIType = {
    age: number,
    name: string,
    posts: Post[]
}

const res: Result<MyAPIType>= await Result.fromFunction(async () => {
    const response = await fetch('http://example.com');
    const data: MyAPIType = await response.json();
    return data;
});
```

Like all the other `sum types` in this library, `Result` includes methods
for conditionally interacting with the inner value or error state as needed.

```typescript
const lengthOfName: Result<number> = res.data(({ name }) => {
    return name.length
}).error((e) => {
    return 'No data'
});
```

There is a `map` function for doing both of these at once. The following snippet is identical to the one above.

```typescript
const lengthOfName: Result<number> = res.map({
    data: ({ name }) => name.length,
    error: (e) => 'No data'
})
```
Ideally you should always interact with the inner value within the scope of one of these
callbacks, but if you need to extract the value at some point, you can use `Result.prototype.match`.
I like to use a React component as an example:

```typescript
const MyComponent: FC<{ result: Result<{ name: string }> }> = ({ result }) => {
    return result.match({
        data: ({ name }) => {
            return <WelcomeMessage name={name} />
        },
        error: (e) => {
            return <ErrorMessage message={e} />
        }
   });
}
```


