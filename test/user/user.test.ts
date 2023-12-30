import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@/user/user.service';
import { User } from '@/database/entity/user/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('User test', () => {
  let service: UserService;

  const mockUserRepository = {
    findAll: jest.fn(),
    signin: jest.fn(),
    signup: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        JwtService,
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('shoud be defined', () => {
    expect(service).toBeDefined();
  });

  it('find All User', async () => {
    let result: Promise<User[]> | undefined;
    jest.spyOn(service, 'findAll').mockImplementation(() => result);

    console.log('!!!!!!!', await service.findAll());

    expect(await service.findAll()).toBe(result);
  });

  it('find One User', async () => {
    let result: Promise<User | 'Invalid User'>;
    const body = { email: '11@11.com', password: '1234' };
    const user = {
      id: 4,
      nickname: 'peter',
      uuid: '47142146-fdb3-40f0-8846-14b8d4d2dc9f',
      status: 'work',
      user_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNDcxNDIxNDYtZmRiMy00MGYwLTg4NDYtMTRiOGQ0ZDJkYzlmIiwidGltZSI6IjIwMjMtMTItMjRUMDg6MDU6MTYuMDE1WiIsImlhdCI6MTcwMzQwNTExNiwiZXhwIjoxNzAzNDA1MTc2fQ.vHf9Em3SjbyJED_9tABn2suBaEMAxCQC1RIa9dKjYHA',
    };

    jest.spyOn(service, 'signin').mockImplementation(() => result);

    const res = await service.signin(body);

    expect(res).toEqual(user);
  });
});
