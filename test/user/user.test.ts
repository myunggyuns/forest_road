import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@/user/user.service';
import { UserController } from '@/user/user.controller';

describe('User test', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: UserService,
          useValue: {
            get: jest.fn((key) => {
              console.log(key);
            }),
          },
        },
      ],
    }).compile();
    controller = module.get(UserController);
    service = module.get<UserService>(UserService);
  });

  it('shoud be defined', () => {
    // console.log(service, controller);
    expect(service).toBeDefined();
  });
});
