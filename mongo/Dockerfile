FROM mongo
WORKDIR /usr/mongo
ADD . /usr/mongo
EXPOSE 27017
# RUN mongorestore -d zj-server ./dump/zj-server
# 在docker里一直报错，docker exec -it 027 /bin/bash进到伪终端去还原数据,不需要-h了
RUN mongorestore -h mongo:27017 -d zj-server ./dump/zj-server
