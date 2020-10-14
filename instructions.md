The package has been configured successfully. Make sure to add the following line of code to `env.ts` file.

```ts
Env.rules({
	// ... other rules
	CACHE_VIEWS: Env.schema.boolean()
})
```

- Here we ensure that `CACHE_VIEWS` environment is always defined.
- And it is using a boolean value. 
