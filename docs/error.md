# Commom exit
- Short 
- Use the erroe filter inside global/shortErrorFilter
```
{
  "message": "Password must be between 4 and 12 characters",
  "statusCode": 400,
  "path": "/auth/signup"
}
```

# Ultra exit

```
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "A senha deve ter entre 4 e 12 caracteres",
  "details": [
    {
      "field": "password",
      "message": "A senha deve ter entre 4 e 12 caracteres"
    }
  ],
  "timestamp": "2024-03-22T12:34:56.789Z",
  "path": "/auth/register"
}
```