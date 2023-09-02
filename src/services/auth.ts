import moment from 'moment';
import jwt from 'jsonwebtoken';

import { ErrorCodes } from 'src/domain/errors';
import { StandardError } from 'src/libs/standard-error';
import { logger } from 'src/libs/logger';
import bcrypt from 'bcrypt';
import { isValidEmail } from 'src/utils/validator';
import { UserRepository } from 'src/repositories/user';
import CONSTANTS from 'src/constants'

import { Connection, getConnection } from 'typeorm';
import { JWT_TOKEN_SECRET } from 'src/configs/app';
interface RegisterPayload {
    username: string;
    email: string;
    password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}


export interface LoginResponse {
    id: string;
    email:string
    token: string;
}

export interface RegisterResponse {
    id: string;
    email:string
    token:string
}

interface AuthServiceOptions {
    userRepository: UserRepository;
}

export class AuthService {
    private readonly saltRounds = 10;

    private readonly connection: Connection;

    constructor(private readonly options: AuthServiceOptions) {
        this.connection = getConnection();
    }

    public async register(registerPayload: RegisterPayload): Promise< RegisterResponse > {
        const { email, password } = registerPayload;

        if (!isValidEmail(email)) {
            throw new StandardError(ErrorCodes.API_VALIDATION_ERROR, 'Invalid Email');
        }
        
        if (await this.options.userRepository.isEmailExist( email)) {
            logger.info({ email }, 'This phone email  already exists in the database');
            throw new StandardError(ErrorCodes.DUPLICATE_END_USER, 'Email already registered');
        }

        const passwordHash = await bcrypt.hash(password, this.saltRounds);

        const user = await this.options.userRepository.createUser({
            ...registerPayload,
            password: passwordHash,
        });
   
        const token = await this.createAccessToken( user.id )

        return {
            id: user.id,
            email: user.email,
            token
        };
    }

    private async createAccessToken(endUserId: string): Promise<string> {
      const expiryTime = moment().add(CONSTANTS.moment.THIRTY, 'minutes');
        const userPayload = { endUserId };
        const token = jwt.sign(userPayload, JWT_TOKEN_SECRET, {
            expiresIn: expiryTime.diff(moment(), 'seconds')
        });
        return token;
    }

    public async login(loginPayload: LoginPayload): Promise<LoginResponse> {
        const { email, password } = loginPayload;

        const foundUser = await this.options.userRepository.findUser(email);
        if (foundUser && (await bcrypt.compare(password, foundUser.password)) === true) {
            const token = jwt.sign(
                {
                    _id: foundUser.id,
                    email: foundUser.email,
                },
                process.env.JWT_TOKEN_SECRET,
                {
                    expiresIn: 8640000
                }
            );
            foundUser.last_logged_in_at = new Date();
            await this.options.userRepository.save(foundUser);

            return {
                id: foundUser.id,
                email: foundUser.email,
                token
            };
        }

         throw new StandardError(ErrorCodes.INVALID_EMAIL_OR_PASSWORD, 'Invalid Email and Password Combination');
    }
}
