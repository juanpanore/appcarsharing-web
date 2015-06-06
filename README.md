## App Car Sharing

Aplicacion Web Car sharing

## Pruebas Locales.

Instalar dependecias de Node.js con:

		npm install

Instalar dependencias Angular con:

 		bower install

Ejecutar Grunt:
		
		grunt serve --force

Deploy Heroku

		grunt build:dist
		git push heroku master

Se debe agregar primero el remote de heroku

		git remote add heroku git@heroku.com:appcarsharing-web.git

