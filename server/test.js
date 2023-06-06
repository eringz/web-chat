
const jwt = require('jwt-then');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NzgzOTZjYTcwMGU2YzdiMTQyMzNkNyIsImlhdCI6MTY4NTYwNTM0Mn0.cvurCqOqs9vyWZ4CGYxxCt0kMSlPHiFwLUWPU536_1Y'.split('.')[1];
console.log(token);
// const payload = HMACSHA256(token, process.env.SECRET);

// console.log(payload);
// HMACSHA256(
//     base64UrlEncode(header) + "." +
//     base64UrlEncode(payload),
    
//   your-256-bit-secret
  
//   )
// eyJpZCI6IjY0NzgzOTZjYTcwMGU2YzdiMTQyMzNkNyIsImlhdCI6MTY4NTYwNTM0Mn0