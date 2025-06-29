// tests/user.controller.spec.ts
import { describe, it, beforeEach, expect, vi } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { register, login } from '../src/controllers/user.controller';
import UserModel from '../src/model/user.model';
import AppError from '../src/error/app.error';
vi.mock('jsonwebtoken', () => ({
    sign: vi.fn(() => 'fake.jwt.token')
}));
describe('GraphQL User Controller', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });
    describe('register', () => {
        it('creates a new user when email is not taken', async () => {
            vi.spyOn(UserModel, 'findOne').mockResolvedValueOnce(null);
            vi.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashed-pass');
            // mock the save on the instance
            const saveMock = vi.fn().mockResolvedValue({});
            vi.spyOn(UserModel.prototype, 'save').mockImplementationOnce(saveMock);
            const result = await register({}, { input: { name: 'Alice', email: 'a@x.com', password: 'pass' } });
            expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'a@x.com' });
            expect(bcrypt.hash).toHaveBeenCalledWith('pass', 10);
            expect(saveMock).toHaveBeenCalled();
            expect(result).toEqual({ message: 'New User Created' });
        });
        it('throws conflict error when user already exists', async () => {
            vi.spyOn(UserModel, 'findOne').mockResolvedValueOnce({});
            await expect(register({}, { input: { name: 'Bob', email: 'b@x.com', password: 'pass' } })).rejects.toBeInstanceOf(AppError);
        });
    });
    describe('login', () => {
        it('returns token when credentials are valid', async () => {
            const fakeUser = { _id: 'u1', email: 'u@x.com', password: 'hashed', toString() { return 'u1'; } };
            vi.spyOn(UserModel, 'findOne').mockResolvedValueOnce(fakeUser);
            vi.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
            const result = await login({}, { input: { email: 'u@x.com', password: 'plain' } });
            expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'u@x.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('plain', 'hashed');
            expect(jwt.sign).toHaveBeenCalled();
            expect(result).toEqual({ userId: 'u1', token: 'fake.jwt.token' });
        });
        it('throws 401 when user not found', async () => {
            vi.spyOn(UserModel, 'findOne').mockResolvedValueOnce(null);
            await expect(login({}, { input: { email: 'no@x.com', password: 'pass' } })).rejects.toBeInstanceOf(AppError);
        });
        it('throws 401 on password mismatch', async () => {
            vi.spyOn(UserModel, 'findOne').mockResolvedValueOnce({ password: 'h' });
            vi.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);
            await expect(login({}, { input: { email: 'u@x.com', password: 'wrong' } })).rejects.toBeInstanceOf(AppError);
        });
    });
});
