# 서버 환경 구성

- env폴더에 파일 local(로컬), development(dev), prod(배포)로 구성
- validate 설정으로 없는 값이면 error 발생

## 명령어 구성

    > local: "cross-env NODE_ENV=local nest start --watch"
    > dev: "cross-env NODE_ENV=development nest start"
    > start: "cross-env NODE_ENV=prod node dist/main"

- --watch: file chagne hot reload

# DockerFile

#### --prod, -P

pnpm will not install any package listed in devDependencies and will remove those insofar they were already installed, if the NODE_ENV environment variable is set to production. Use this flag to instruct pnpm to ignore NODE_ENV and take its production status from this flag instead.

docker build -t [image name]
docker run [image name]
docker images
docker ps -a
docker image rm [image]
docker rm [컨테이너id]
