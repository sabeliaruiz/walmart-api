# Para construir imagen:
# - ubicado en la raiz del proyecto usar:
#   docker build -t walmart-api .
FROM node:12.10.0

WORKDIR ./app

COPY ["package.json", "app.js", "./"]

RUN touch startup.sh && \
    echo "#!/bin/bash" >> startup.sh && \
    echo "npm run start:development" >> startup.sh && \
	  chmod +x startup.sh

RUN npm i --quiet

COPY app ./app
COPY config ./config

RUN mkdir -p ./app/logs
RUN mkdir -p /var/log/pm2

COPY bin ./bin

EXPOSE 3030

ENTRYPOINT ["./startup.sh"]
