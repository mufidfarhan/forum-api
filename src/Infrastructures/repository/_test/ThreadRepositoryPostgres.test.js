/* eslint-disable camelcase */
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NewThread = require('../../../Domains/thread/entities/NewThread');
const AddedThread = require('../../../Domains/thread/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

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
    it('should throw NotFoundError when thread is not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('wrong-id'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should return thread data correctly', async () => {
      // Arrange
      await ThreadTableTestHelper.addThread({
        id: 'thread-234',
        title: 'A Thread',
        body: 'A thread body',
        owner: userId,
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        userId: userId,
        threadId: 'thread-234',
        content: 'a comment',
        isDelete: false,
        parentId: null,
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-234');

      // Assert
      expect(thread).toEqual([
        {
          thread_id: 'thread-234',
          thread_title: 'A Thread',
          thread_body: 'A thread body',
          thread_date: expect.any(String),
          thread_username: 'dicoding',
          comment_id: 'comment-123',
        }
      ]);
    });
  });

  describe('verifyThreadAvailability function', () => {
    it('should throw NotFoundError when thread is not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadAvailability('wrong-id')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw error when thread found', async () => {
      // Arrange
      const threadId = 'thread-123';
      await ThreadTableTestHelper.addThread({ id: threadId, userId: userId });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadAvailability(threadId)).resolves.not.toThrowError(NotFoundError);
    });
  });
});

