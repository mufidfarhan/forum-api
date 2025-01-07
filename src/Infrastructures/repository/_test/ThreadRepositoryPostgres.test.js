/* eslint-disable camelcase */
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NewThread = require('../../../Domains/thread/entities/NewThread');
const AddedThread = require('../../../Domains/thread/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  const userId = 'user-123';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
  });

  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'A thread',
        body: 'this is a thread',
      });
      const fakeIdGenerator = () => '123';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(newThread, userId);

      // Assert
      const threads = await ThreadTableTestHelper.findThreadById('thread-123');

      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'A thread',
        body: 'this is a thread',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread, userId);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'A thread',
        body: 'this is a thread',
        owner: 'user-123',
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should return thread details correctly', async () => {
      // Arrange
      const mockQueryResult = [
        {
          thread_id: 'thread-123',
          thread_title: 'A Thread',
          thread_body: 'A thread body',
          thread_date: '2025-01-05T08:00:00.000Z',
          thread_username: 'dicoding',
          comment_id: 'comment-123',
          comment_username: 'johndoe',
          comment_content: 'A comment content',
        },
      ];

      const mockPool = {
        query: jest.fn().mockResolvedValue({ rows: mockQueryResult }),
      };

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(mockPool, {});

      // Action
      const threadDetails = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(threadDetails).toMatchObject(mockQueryResult);
    });

    it('should throw NotFoundError when thread is not found', async () => {
      // Arrange
      const mockQueryResult = { rows: [] };

      const mockPool = {
        query: jest.fn().mockResolvedValue(mockQueryResult),
      };

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(mockPool);

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-123'))
        .rejects
        .toThrowError(NotFoundError);
    });
  });
});

