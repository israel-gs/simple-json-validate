# Simple JSON Validate

Simple JSON validator.

## Installing

Using local file:

```html
<script src="js/sjv.js"></script>
```

## Example
```js
let user_validator = new Sjv({
  rules: [
    { name: 'dni', required: true, max_length: 8 },
    { name: 'name', required: true, max_length: 20 }
  ]
})

let user= {
  dni: '705644127'
}

user_validator.validate(user)

// print in console -> ["The value of dni exceeds the set length in rule.", "name is required but not found in object."]
```