### Either
#### I really don't want you to write `if` statements

Either is an algebraic data structure for describing sum types. This is simpler than it sounds.

You will reach for `Either` when your data is one of two distinct types. Either it's
a dog or a cat. Either it's a foo or a bar. Either it's a logged-in user or an anonymous one. This is
also pretty much the definition of sum types: things that can be one of multiple things.

Normally, when data can be either of two things, the solution is to pepper your app with `if/else` statements.
If you are conscientious, you may hide these within functions so you don't have to inline them.

```typescript
type User = {
    username?: string;
    age?: number;
    firstName?: string;
    lastName?: string;
}

const getUserFullName = (user: User): string => {
    if (user.firstName && user.lastName) {
        return `${user.firstName} ${user.lastName}`;
    }
    return "Not logged in"
}
```

This is fine. We've all written that code, but `Either` offers a different way to think about it.
The `User` type I defined above does a poor job of describing the possible states a user can be in. According
to the type definition `{ age: 40 }` would be valid, but we are operating under
the assumption that a logged-in user will have a username and a first and last name.
In reality, there are only two valid states:
one where the user is logged-in (and therefore has all required properties) and one where the user is not
logged-in and all properties are undefined.

```typescript
type LoggedInUser = {
    username: string;
    age: number;
    firstName: string;
    lastName: string;
}
type LoggedOutUser = {
    loggedOut: true;
}
```

Every `Either` has two sides. You can create one side or the other directly with 
built-in static methods.

```typescript
const l: Either<string, unknown> = Either.left('a string'); 
const r: Either<unknown, number> = Either.right(100); 
```

Of course, if you're using an either it's because you don't know which of the two you're going to get.
For this, you can use `Either.fromFunction`. In the case of our user, it might look like this.

```typescript
const user = await getUserDetails();
const u: Either<LoggedInUser, LoggedOutUser> = Either.fromFunction(() => {
    if (user.username) return Left(user); // yes I know this is an If, but it's just the one
    return Right({ loggedOut: true });
});
```

The goal of this library is to make these types as easy to use as regular JS arrays. To that end, it includes
methods for mapping over the value. These functions are the only valid way of interacting with the Either's
inner value. TypeScript will not let you access the inner value directly.

`Either.prototype.left` and `Either.protoype.right` each take a callback
that maps over the indicated side.

```typescript
const userFullName = u.left((user: LoggedInUser) => {
    return `${user.firstName} ${user.lastName}`;
}).right((loggedOutUser: LoggedOutUser) => {
    return "Not logged in";
});
```

There's also `Either.prototype.map` which conveniently allows you to define callbacks for both the 
right and left side at the same time. The following code is equivalent to the above snippet.

```typescript
const userFullName: Either<string, "Not logged in"> = u.map({
    left: (user: LoggedInUser) => {
        return `${user.firstName} ${user.lastName}`;
    },
    right: (rightVal: number) => {
        return "Not logged in";
    }
})
```

At some point you may need to get the value back out of an `Either`. If this happens use `Either.prototype.match`.
If our app is a React app, there might be a component that looks like this:

```typescript
const UserHeader: FC<{ user: Either<LoggedInUser, LoggedOutUser> }> = ({ user }) => {
    return user.match({
        left: (loggedInUser) => {
            return <UserHeader>
                Hello, {loggedInUser.firstName} {loggedInUser.lastName}!
                You are logged in as {loggedInUser.username};
            </UserHeader>
        },
        right: (loggedOutUser) => {
            return <UserHeader>
                <a href="/login">
                    Click here to login.
                </a>
            </UserHeader>
        }   
    })
};
```
