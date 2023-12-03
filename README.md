# 서버 환경 구성

- env폴더에 파일 local(로컬), development(dev), prod(배포)로 구성
- validate 설정으로 없는 값이면 error 발생

## 명령어 구성

    > local: "cross-env NODE_ENV=local nest start --watch"
    > dev: "cross-env NODE_ENV=development nest start"
    > start: "cross-env NODE_ENV=prod node dist/main"

- --watch: file chagne hot reload
