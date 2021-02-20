FROM node:14.4.0-alpine3.11

RUN mkdir -p /opt/sns && \
    chown -R 1001:1001 /opt/sns

RUN mkdir -p /opt/sns/app && \
    mkdir -p /opt/sns/logs && \
    chmod 700 /opt/sns/logs 

COPY --chown=1001:1001 config /opt/sns/app/config 
COPY --chown=1001:1001 controllers /opt/sns/app/controllers
COPY --chown=1001:1001 domain /opt/sns/app/domain
COPY --chown=1001:1001 repositories /opt/sns/app/repositories
COPY --chown=1001:1001 package*.json /opt/sns/app/
COPY --chown=1001:1001 server.js /opt/sns/app/
COPY --chown=1001:1001 docker-entrypoint.sh /opt/sns/app/

WORKDIR /opt/sns/app

RUN chmod 700 docker-entrypoint.sh && \
    dos2unix docker-entrypoint.sh && \
    npm install

# Run as user 1001:1001, to ensure nonroot script run.
USER 1001:1001

EXPOSE 3000

ENTRYPOINT ["/bin/sh", "-c", "./docker-entrypoint.sh"]

