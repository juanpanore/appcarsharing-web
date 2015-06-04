## App Car Sharing

Aplicacion Web Car sharing

## Pruebas Locales.

Instalar dependecias de Node.js con:

		npm install

Instalar dependencias Angular con:

 		bower install

Ejecutar Grunt:
		
		grunt serve

Deploy Heroku

Se debe agregar git remote add heroku git@heroku.com:appcarsharing-web.git

		grunt build:dist
		git push heroku master

