const http = require('http');

const data = JSON.stringify({ email: 'admin@arlantoph.com', password: 'admin123' });
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const loginData = JSON.parse(body);
    console.log('Login Token:', loginData.token ? 'Success' : 'Failed');
    
    if (loginData.token) {
        http.get('http://localhost:5000/api/admin/users', { headers: { Authorization: 'Bearer ' + loginData.token } }, (res2) => {
            let body2 = '';
            res2.on('data', d => body2 += d);
            res2.on('end', () => {
                const users = JSON.parse(body2);
                console.log('Users:', users.length);
                if (users.length > 0) {
                    const req3 = http.request({
                        hostname: 'localhost',
                        port: 5000,
                        path: '/api/admin/users/' + users[0]._id,
                        method: 'DELETE',
                        headers: { Authorization: 'Bearer ' + loginData.token }
                    }, (res3) => {
                        let body3 = '';
                        res3.on('data', d => body3 += d);
                        res3.on('end', () => console.log('Delete Res:', res3.statusCode, body3));
                    });
                    req3.end();
                }
            });
        });
    }
  });
});
req.write(data);
req.end();
