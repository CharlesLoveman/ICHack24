
FROM mongodb/mongodb-community-server:latest

EXPOSE 27017

CMD ["mongod", "--bind_ip_all", "--setParameter", "enableLocalhostAuthBypass=false"]