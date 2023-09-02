import { AuthController } from 'src/controllers/auth';
import { ErrorCodes } from 'src/domain/errors';
import { StandardError } from 'src/libs/standard-error';
import { init } from 'src/init';
import { UserRepository } from 'src/repositories/user';
import bcrypt from 'bcrypt';
import { In } from 'typeorm';

import { mockNext, mockRequest, mockResponse } from '../express.mock';

describe('Auth Controller', () => {
    let authController: AuthController;
    let userRepository: UserRepository;
    const mockEndUserIdsInDB: string[] = [];

    beforeAll(async () => {
        const initResult = await init();
        authController = initResult.authController;
        userRepository = initResult.userRepository;
    
        // Generate user and insert into DB
        const testEndUser = await userRepository.createUser({
            username: 'Unit-Test-User',
            email: 'unit@test123.com',
            password: await bcrypt.hash('abcd1234', 10),
        });
        mockEndUserIdsInDB.push(testEndUser.id);

    });

    beforeEach(async () => {

    });

    afterAll(async () => {
       
        await userRepository.delete({
            id: In(mockEndUserIdsInDB)
        });
    });

    describe('POST v1/auth/login', () => {
        test('should throw error - Invalid Email and Password Combination', async () => {
            const req = mockRequest({
                email: 'foo@bar123.com',
                password: 'abcd1234'
            });
            const res = mockResponse();
            const next = mockNext();
            await authController.login(req, res, next);

            expect(next).toHaveBeenCalledWith(
                new StandardError(ErrorCodes.INVALID_EMAIL_OR_PASSWORD, 'Invalid Email and Password Combination')
            );
        });

        test('should login successfully - return token and status', async () => {
            const req = mockRequest({
                email: 'unit@test123.com',
                password: 'abcd1234'
            });
            const res = mockResponse();
            const next = mockNext();
            await authController.login(req, res, next);

            expect(res.status).toHaveBeenCalledWith(202);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: "unit@test123.com",
                    token: expect.any(String)
                })
            );
        });
    });
});
