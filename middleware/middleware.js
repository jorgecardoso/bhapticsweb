const PORT = process.env.PORT || 9090;
const SERVICE_DISCOVERY_URL = process.env.SERVICE_DISCOVERY_URL ? process.env.SERVICE_DISCOVERY_URL : "https://hmd-link-service.glitch.me";

const ip = require('ip');

httpProxy = require('http-proxy');

const cert =
    {
        private: '-----BEGIN RSA PRIVATE KEY-----\r\n' +
            'MIICXAIBAAKBgQC435Y5s8nyDX4mHE6NWsVCjSCaF1knUAmWB/eMNfvgjkvl+MHe\r\n' +
            'Qayq3d5f2hgjEPfyCETKjWZ5YuFpgL7hwQ5V6C/E/ZkHRI2/n+RXXo0G/nDBzvdO\r\n' +
            '210lOOIcGBCVUccVJ8ignk/XeLLHUno0tFicLn0WiF3rgNQVijR15htp0wIDAQAB\r\n' +
            'AoGAfpxJkt0Jeec5tLoAJhi7LbffUwiYey76UbDFHVY/WOu7GRWDGEbcDO0EBZsk\r\n' +
            'mqddV3nIOvwZ6RoKDCorEAsaWBlMO4sG/PwNSC8TK78LX/fT/3BHKjUiSwALo1h0\r\n' +
            'QbUKSbpQmzjA6+ch0YMTmcO8tqe32BTBGhIk5LEv4QHRS4ECQQDz6ApRuzLTRJQp\r\n' +
            'ZRYh6sF2C04ISrIlxd5l6MzdNEmgCKSUyzRmW90nUY2hWeX9GaO4cqq6pLUnesrx\r\n' +
            'l80bFQFBAkEAwgo6FdJL/3jolyeRHzUrul9ae/UzWrAaq3GGSBzPPMt9vZm65jlA\r\n' +
            'XW15KGPrlsWgnZw59grCZY+Ha44V0kXSEwJBAMQ5eRvaBADOGnjXF6A/0lbar3Oi\r\n' +
            'TIJxFwRb731DFLyIV4hRlx2GaHy6crxNq+cc2oeI0OwJmKhjdKQ7IUrZckECQAvm\r\n' +
            'Oqep7NUu4fybBZBHX3YfcNoXMF4IXKpU3OpBMghFZmGhMs/5hNP16a8raYAmgHIJ\r\n' +
            '6ZgIEuHNin1zCi2J8JcCQBanSxskYBy0a6w1pZLwcCe5ZK4ftcWvMNWhN+WxOmjN\r\n' +
            '59ey8fUA8t/ey0e30vgsoSel4Zyc5aoztw2EvI063Vo=\r\n' +
            '-----END RSA PRIVATE KEY-----\r\n',
        public: '-----BEGIN PUBLIC KEY-----\r\n' +
            'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC435Y5s8nyDX4mHE6NWsVCjSCa\r\n' +
            'F1knUAmWB/eMNfvgjkvl+MHeQayq3d5f2hgjEPfyCETKjWZ5YuFpgL7hwQ5V6C/E\r\n' +
            '/ZkHRI2/n+RXXo0G/nDBzvdO210lOOIcGBCVUccVJ8ignk/XeLLHUno0tFicLn0W\r\n' +
            'iF3rgNQVijR15htp0wIDAQAB\r\n' +
            '-----END PUBLIC KEY-----\r\n',
        cert: '-----BEGIN CERTIFICATE-----\r\n' +
            'MIIB4zCCAUygAwIBAgIJKWTjjIraud0OMA0GCSqGSIb3DQEBBQUAMBAxDjAMBgNV\r\n' +
            'BAMTBVZSTGFiMB4XDTI0MTAxNjE3MjkyOFoXDTI1MTAxNjE3MjkyOFowEDEOMAwG\r\n' +
            'A1UEAxMFVlJMYWIwgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBALjfljmzyfIN\r\n' +
            'fiYcTo1axUKNIJoXWSdQCZYH94w1++COS+X4wd5BrKrd3l/aGCMQ9/IIRMqNZnli\r\n' +
            '4WmAvuHBDlXoL8T9mQdEjb+f5FdejQb+cMHO907bXSU44hwYEJVRxxUnyKCeT9d4\r\n' +
            'ssdSejS0WJwufRaIXeuA1BWKNHXmG2nTAgMBAAGjRTBDMAwGA1UdEwQFMAMBAf8w\r\n' +
            'CwYDVR0PBAQDAgL0MCYGA1UdEQQfMB2GG2h0dHA6Ly9leGFtcGxlLm9yZy93ZWJp\r\n' +
            'ZCNtZTANBgkqhkiG9w0BAQUFAAOBgQAsXCsgRjp7bCa+0wYjGVglvHwwUe0di4Ld\r\n' +
            'CfJbR9uTwMX3bd7+WKqHlje0LGivX0S6vpsgRbdMlzGI65ft3tkyYGISogA+R1ge\r\n' +
            'XMPNWQ30Ljg1tOe0NWSYRndehf+LJYdGD2+ct/7+fN7TVRUxmqG7a0Q4Awwgvd3Q\r\n' +
            'pHy3jlyBiA==\r\n' +
            '-----END CERTIFICATE-----\r\n',
        fingerprint: 'fc:a2:fe:6e:c5:e5:48:12:0c:53:e3:93:f0:d3:69:bb:fd:19:dc:9e'
    }




let proxy = httpProxy.createServer({
    target: 'ws://127.0.0.1:15881', // bhaptics websocket on bHaptics Player
    ws: true,
    ssl: {
        key: cert.private,
        cert: cert.cert
    }
});
//console.log(proxy);

    let p = proxy.listen(PORT);

    proxy.on('proxyReqWs', function (proxyReq, req, socket, options, head) {
        //console.log( socket);
        socket.on('error', function(e){
            console.log("error on", req.url)
            //console.log(e);
        })
    // listen for messages coming FROM the target here
    //proxySocket.on('data', hybiParseAndLogMessage);
});

console.log("Started bHaptics middleware on https://"+ip.address()+":"+PORT);
console.log("Open the above address first to authorize the use of self-signed certificate on the browser!");


console.log("Using Service Discovery Server: " + SERVICE_DISCOVERY_URL);
let handle = setInterval( function() {
    fetch(SERVICE_DISCOVERY_URL+"/bhapticsmiddleware/https://"+ip.address()+":"+PORT).then(function(data){
        return data.json();
        //console.log(data);
    }).then(function(json){
        //console.log(json);
    }).catch(error => {
        console.error("Could not connect to service discovery server. Stopping further attemps.")
        clearInterval(handle);
        console.error(error);
    });

}, 5000)
