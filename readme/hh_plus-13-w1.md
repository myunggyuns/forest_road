진행상항
- 창환
  - ci/cd 완료된 상황
  - ecs에 서비스 배포

- 선진
  - ci/cd 완료된 상황
  - ecs에 서비스 배포

- 명균 (12조)
  - ci는 docker build까지 완료된 상황 (ghcr), cd 진행중
  - aws IAM (access등등) 방금 만든상황


### 사전노트 질문
#### Q1. ecs에서 task-definition에서 민감한 정보들은 어떻게 가리나요? 다른 방식이 더 있나요?
- accountId, aws region 등등의 데이터
- task-definition github action에서 불러온다 ? (amazon-ecs-deploy-task-definition)
#### A1.
1. github action에서 task-definition을 불러오지 않는다.
  - aws cli 를 github action에서 호출하는 식으로 구성함. (aws ecs update-service --args=example)
  - https://docs.aws.amazon.com/cli/latest/reference/ecs/update-service.html
2. task definition(json)을 불러온 이후에, 데이터를 치환한다.  
  - json에 가짜 value를 담고,cd에서 github-secret에 있는 데이터로 바꾼다.
3.  TaskDefinition Secret

#### Q2. env의 경우 github secret을 이용해서 .env파일을 만들어서 사용하는 방법, aws parameter store를 이용하는 방법 2가지가 생각나는데 더있을까요? + best practice는 어떤것이 있을까요..?
- 개인의견 : 해당 env의 공유 범위에 따라 다르다.
  - 해당 레포에서만 쓰이는경우 -> github secret + .env 를 만든다.
  - 조직에서 공통으로 관리되어야 하는 것들 (사내 라이브러리에 필요한 토큰들?) -> aws secret manager, aws parameter store를 써도 됨,  
  단 github organization쓰면 팀 secret 관리가능
  - aws에서 제공하는 기능 -> 마이그레이션이 어렵다. (azure, gcp ... etc)
    - 쓸모없지만 듣고나면 쓸모있을지도 모르는 내용들
      - k8s (쿠버네티스) 는, 비즈니스적으로도 중요한 의의가 있다.
      - 개념 : 컨테이너의 관리에 있어서 표준화된 인터페이스 (구현체가 아니다?)
      - ecs/ec2 ... 를 쓰는경우, 다른 provider로의 마이그레이션이 어렵다. -> k8s를 쓰는곳들도 있다. (gke, eks -> 쿠버의 일부 기능을 provider들이 래핑해둔 것)

#### Q3. prod에 release된 버전을 rollback하기 가장 좋은 방법 ? (tag push 기반 구축시의 고민)
- continue delivery vs continue deploy (발제자료)
- 이 두개가 롤백에 있어서 유의미한 차이인것 같지는 않다.
- rollback에 있어서 유의미한 차이를 만들어내는것들
  1. **하위호환성**
    - 현재 배포하려는 버전이, 이전버전에서 breaking change를 만들어내는가?
      - e.g. 이번배포에, not null 인 db field가 추가됨
        - 롤백하면 해당 필드가 비어있어서 문제가 됨
    - 현재 버전이 배포되었을때의 데이터 vs 이전버전의 데이터 -> 롤백을 해도 데이터정합성 문제가 생길 수 있다.
    - code rollback -> 이번에 쌓인 신규데이터 (새롭게 추가된 테이블 등등)에는 그닥 영향이 없을 수 있다.
  2. 카나리 배포 (점진적배포)를 한다.
    - 일부 사용자 or 서버 에게만 먼저 트래픽을 보내준다. -> 문제가생기면 롤백
    - 기존 서버, 현재 서버 : 동시에 존재해도 문제가 없는상황.
    - 일부 배포를 한 서버만 롤백해버리면 된다. 모수가 적어서, 아무일도 없었던것처럼 만들기가 쉽다.
    - feature flag와 비슷한느낌? -> O, 기능이 배포된 이후에 하는제어, but 점진적배포 : 배포를 일부서버에만 하는것
  3. 휴먼 에러의 가능성
    - Ops의 중요성과 결이 같다.
    - 프로세스가 잘 만들어져 있다면, 휴먼에러가 발생할 가능성이 적다, 휴먼에러가 발생할 곳을 자동화한다.
    - 회사에서 tag기반 배포 사용중 : deploy bot이 존재.

- 배포 / 버전관리, 브랜치 관리 등의 프로세스
- main: 항상 prod환경과 같아야함
- release브랜치를 만든다. (23-12-01 에 만들어짐)
- feat/[JIRA-TICKET-NUM] : 피처브랜치가 된다, release브랜치를 타겟한다.
- dev를 두지는 않는다. (각자의 feature브랜치에서 태그를 따서, 배포한다.)
- 다른 배포가 있는경우, main이 release보다 앞서나갈 수 있다.
  - main -> release -> feat rebase 를한다.
- tag: 
  - 개발: x.y.z-rc.1,2,3./..
  - stg에 올라갈때: x.y.z-qa.1, qa.2, qa.3...
  - prod에 나갈때: x.y.z
  - github action에서 이미지 빌드하는 액션이, 태그 푸시에 걸려있다.
  - 이 태그로 배포를 한다. (배포 봇 : 태그가 달린 이미지를 가져다 배포해준다.)

#### Q4. ECS에 대한 질문
- ecs에서 ghcr을 가져올수 있냐? -> 가능
- ecr : 도커이미지 저장소
  - (private, aws의 리소스랑 쉽게 통합할 수 있다, aws가이드가 다 ecr기반임.)
  - eks (쿠버네티스) 환경 이전시에도, ecr이 더 편할수도
  - ecr 이미지를 기반으로, aws lambda에 올릴수도 있다.

### DDD 아키텍쳐
- 4 layered
  - presentation
  - application
  - domain
  - infra
    - 외부의존성이 있는것들을 격리하는 곳. (database, 외부 api, ...)

- 의존성이 항상 단방향을 향해야한다.
- 우리가 레이어별 데이터구조를 어떤식으로 가져갈 것인가?
  - 모든 레이어가, 각자의 데이터구조를 가진다. (O)
  - 일부 레이어는, 데이터구조를 공유한다. (pre~ <> app~, dom~ <> infra) (?)
  - 모든 레이어가 데이터구조를 공유한다. (X)

#### 레이어간 변환  
- presentation에서부터, infra에 전달되기까지 : 같은 domain language를 공유해야한다. (e.g. 결제 API를 사용)
  - 카카오페이 : (amt: 금액)  
  - 네이버페이 : (amount : 금액)  
  - 나이스 : (gmyaek: 금액)  

외부 의존성의 언어 : 외부 의존성이 호출되는 곳에서, 변환되어야한다.
우리가 쓰는 domain : (amount : 금액)
infra L
- 카카오페이 : amount -> amt
- 네이버페이 : amount -> amount
- 나이스 : amount -> gmyaek

#### 에러처리
- 외부에서 발생하는 에러를, 우리의 에러로 바꿔줘야한다.
  - 카카오페이 : {code:F1234, message: "환불금액은 결제금액을 초과할 수 없습니다."}, status 200
  - 네이버페이 : {message: "결제금액이 환불금액보다 커야합니다."}, status 400
- 우리의 에러로 바꿔줘야한다.
  - BadRequestException("~~~")
- 데이터베이스의 에러
  - BadSqlGrammer, ConnectionTimeout, ConnectionPoolMax, Unique...etc
  - 외부로 노출을 해줘야 하는가? : 에러종류에 따라 다르다.
   ```ts
   //repository
    updateUser(userId:number, user:User): Result<User, Error.Internal | Error.BadRequest> {
      try {
        Result.left(this.user.update(userId,user))
      } catch(e) {
        //여기가 굉장히 중요하다.
        if(e instanceof BadSqlGrammerException || e instanceof ConnectionTimeout || e instanceof ConnectionPoolMax) {
          Result.right(Error.Internal())
        }
        if(e instanceof Unique) {
          Result.right(Error.BadRequest())
        }
      }
    }
  ```
- 보다 더 많이 현대의 언어들 : go, rust 등등
  - typed Error-Handling
    - Result<T,E>
      - 성공했을때의 타입을 T에 넣는다.
      - 실패했을때의 에러타입을 E에 넣는다.
      - 이 타입 자체가, lazy evaluation이 된다.
    - 에러가 전파되지 않는다. : 에러는 값으로 관리되고 있다.
    - controller : 우리가 정의한 applicationError 들을, httpError로 매핑해주는 과정이 필요함.
  - try-catch구조
    - error 가 전파된다.
    - 해당함수를 호출한곳에서 처리하지 않는경우, 더 상위의 범위까지 올라감
    - e.g. repository에서 에러를 던졌을때, service에서 핸들링하지 않으면 controller까지 올라감
  - 함수를 열어보지 않고도 동작을 알 수 있다.
    - 참조투명성이 있는 코드를 작성할 수 있다. (함수 호출부분, 함수의 결과값으로 치환해도, 문제가 없어야한다.)
  - ```updateUser(userId:number, user:User): User```
    - 에러가 발생할 수 있어서, 결과값으로 치환할 수 없음.
  - ```updateUser(userId:number, user:User): Result<User, Error.Internal | Error.BadRequest>```
    - 에러도, 함수의 결과값에 포함됨