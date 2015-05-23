# protocommand
A NodeJS module for parsing fixed sized protocol commands from a Buffer. This is useful for implementing protocol commands such as that of **MAIL**, **RCPT** for the SMTP protocol.

## Options
Options define the format of the specific protocol.
- size:Integer   -> Fixed Command Size e.g. AUTH = 4
- delimiter:String    -> Delimiter e.g. AUTH|USERNAME|PASSWORD = '|'
- criteria:Regex -> Test, defaults to /^([a-zA-Z0-9 _-]+)$/
You can set options using
```javascript
var protocommand = require('protocommand');
protocommand.size = 5;
protocommand.delimiter = ',';
```

## Methods
A protocol buffer is required for all methods. You can slightly manipulate the format using the **Size, Next and Criteria (REGEX)** options. e.g. AUTH username password
#### get(buffer)
returns either **false** or String **command**.
```javascript
var protocommand = require('protocommand');
var buffer = new Buffer(15);
buffer.write('AUTH admin test');

if(protocommand.get(buffer) === 'AUTH') {
  /* Do Something */
}
```
#### params(buffer)
parses all parameters following the command and returns in Array format.
```javascript
var protocommand = require('protocommand');
var buffer = new Buffer(15);
buffer.write('AUTH admin test');

if(protocommand.get(buffer) === 'AUTH') {
  var params = protocommand.params(buffer);
  console.log(params);
  // logs: ['admin', 'test']
}
```
#### make(command, param1, param2, ...)
creates a new protocol command and returns in Buffer format.
```javascript
var protocommand = require('protocommand');
var buffer = protocommand.make('INIT', 'HELLO SERVER', 'FROM CLIENT');
```
