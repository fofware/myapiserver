import fs from 'fs';
import http from 'http';
import https from 'https';
import Server from './app';
import './databaseMongoose';
//import specialRotes from './routes/specialRoutes';
const srv = new Server();
//server.app.use(authRoutes);
//server.app.use(specialRotes);
//server.start();
//console.log(process.env)
try {
	const privateKey = fs.readFileSync('/etc/letsencrypt/live/firulais.net.ar/privkey.pem', {encoding:'utf8', flag:'r'});
	const certificate = fs.readFileSync('/etc/letsencrypt/live/firulais.net.ar/cert.pem', {encoding:'utf8', flag:'r'});
	const ca = fs.readFileSync('/etc/letsencrypt/live/firulais.net.ar/web.pem', {encoding:'utf8', flag:'r'});
	
	const credentials = {
		key: privateKey,
		cert: certificate,
		ca: ca
	};
	const httpsServer = https.createServer(credentials, srv.app);
	httpsServer.listen(3443, () => {
		console.log('HTTPS Server running on port 3443');
	});
			
} catch (error) {
	console.log(error);	
}

// Starting both http & https servers
const httpServer = http.createServer(srv.app);

httpServer.listen(3000, () => {
	console.log('HTTP Server running on port 3000');
});


