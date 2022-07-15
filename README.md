# schtate
## Functional Wrappers for State Management

This library offers data containers for managing state.

### Nothing - A saner way of declaring non-existence

There is only one `nothing` in any project. It's not undefined or null. It's just nothing.

### Maybe - For things that may or may not exist

Maybe is a container that can hold a value or `nothing`. You can write functionality to shape the data in the Maybe without ever having to write an `if` statement.

There is no way of extracting the value from a Maybe. I mean, it's JavaScript so you can do it, but TS will not allow you to hack the type that way. You are meant to work within callbacks, not directly inspect the value.

Usage:

```
	interface User { firstname: string, lastname: string }
    
	// Maybe it's a user? Maybe it's the nothing!
	const user: Maybe<User> = Maybe.create(Math.random() > 0.5 ?
    	{ firstname: 'henry', lastname: "schwartz" } 
        : nothing);
        
    const capitalized = user.map(({firstname, lastname}) => {
    	return { firstname: firstname.toUpperCase(), lastname: lastname.toUpperCase() };
    });
   
    const fullnameLength: Maybe<number> = user.reduce((total, usr) => {
    	return total + (usr.firstname + usr.lastname).length;
    }, 0).map(total => total * 2); 
```

API:

- `Maybe.create(value: T | nothing)`: returns a Maybe containing the supplied value
- `Maybe.prototype.something(callback: (arg: Something) => void)`: If something is there, do a thing. If it's nothing, do nothing
- `Maybe.prototype.nothing(callback: (arg: nothing) => void)`: If nothing is there, do a thing. If it's something, do nothing
- `Maybe.prototype.map(callback: (arg: Something) => Something)`: Returns a new Maybe with the value of the callback function similar to how `Array.prototype.map` works. If the Maybe is nothing, it returns a Maybe of nothing.
- `Maybe.prototype.reduce<T>(callback: (accumulator: T, arg: Something)`: Same as `map` but allows you to change the type of the returned Maybe. 