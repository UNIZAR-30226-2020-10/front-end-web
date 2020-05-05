#!/bin/bash

credenciales_file=${HOME}/.netrc

[ $# -ne 1 ] && echo "Usage: $(basename $0) <development|production>" && exit 1


[ ! -f $credenciales_file ] && echo "No se está logueado en Heroku" && heroku login

app=tuneitweb

case $1 in
development)
  echo "Despliegue en desarrollo..."
  docker-compose down
  docker-compose build
  docker-compose up -d
  docker-compose logs -f
  docker-compose stop
  ;;
production)
  echo "Despliegue en producción..."
  docker-compose build
  heroku container:login
  heroku container:push web --app $app
  heroku container:release web --app $app
  heroku logs --tail --app $app
  ;;
*)
  echo "Usage: $(basename $0) <development|production>" && exit 1
esac

