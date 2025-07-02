import { describe, it, beforeEach, expect, vi } from 'vitest';
import httpMocks from 'node-mocks-http';
import { getTransaction, addTransaction, updateTransaction, deleteTransaction } from '../src/controllers/transaction.controller.js';
describe('GraphQL Transaction Controller', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });
    describe('getTransaction (Express style)', () => {
        it('should run without type error', async () => {
            const req = httpMocks.createRequest({
                params: { userId: 'u1' }
            });
            const res = httpMocks.createResponse();
            const next = vi.fn();
            await getTransaction(req, res, next);
            expect(next).toHaveBeenCalledTimes(1);
        });
    });
    describe('addTransaction (Express style)', () => {
        it('should run without type error', async () => {
            const req = httpMocks.createRequest({
                body: {
                    userId: 'u1',
                    input: {
                        amount: 100,
                        type: 'income',
                        category: 'salary',
                        description: 'Test',
                        date: new Date()
                    }
                }
            });
            const res = httpMocks.createResponse();
            const next = vi.fn();
            await addTransaction(req, res, next);
            expect(next).toHaveBeenCalledTimes(1);
        });
    });
    describe('updateTransaction (Express style)', () => {
        it('should run without type error', async () => {
            const req = httpMocks.createRequest({
                body: {
                    input: {
                        amount: 100,
                        type: 'income',
                        category: 'salary',
                        description: 'Test',
                        date: new Date()
                    }
                },
                params: {
                    userId: 'u1',
                    transactionId: 't1'
                }
            });
            const res = httpMocks.createResponse();
            const next = vi.fn();
            await updateTransaction(req, res, next);
            expect(next).toHaveBeenCalledTimes(1);
        });
    });
    describe('deleteTransaction (Express style)', () => {
        it('should run without type error', async () => {
            const req = httpMocks.createRequest({
                params: {
                    userId: 'u1',
                    transactionId: 't1'
                }
            });
            const res = httpMocks.createResponse();
            const next = vi.fn();
            await deleteTransaction(req, res, next);
            expect(next).toHaveBeenCalledTimes(1);
        });
    });
});
