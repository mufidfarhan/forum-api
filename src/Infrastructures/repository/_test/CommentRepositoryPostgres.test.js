/* eslint-disable camelcase */
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  const userId = 'user-123';
  const threadId = 'thread-123';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
    await ThreadsTableTestHelper.addThread({ id: threadId, userId: userId });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'a comment',
      });
      const objective = 'comment';
      const fakeIdGenerator = () => '123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(newComment, objective, userId, threadId);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'a comment',
      });
      const objective = 'comment';
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment, objective, userId, threadId);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'a comment',
        owner: 'user-123',
      }));
    });
  });

  describe('deleteComment function', () => {
    it('should update is_delete from comments table in database', async () => {
      // Arrange
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({ id: commentId, userId: userId, threadId: threadId });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment(commentId);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(commentId);
      expect(comment[0].is_delete).toEqual(true);
    });
  });

  describe('getCommentById function', () => {
    it('should return comment data correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        userId: userId,
        threadId: threadId,
        content: 'a comment',
        isDelete: false,
        parentId: null,
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comment = await commentRepositoryPostgres.getCommentById('comment-123');

      // Assert
      expect(comment).toEqual([
        {
          comment_id: 'comment-123',
          comment_date: expect.any(String),
          comment_content: 'a comment',
          comment_username: 'dicoding',
          comment_deleted: false,
          comment_like_count: '0',
          reply_id: null,
          reply_content: null,
          reply_username: null,
          reply_date: null,
          reply_deleted: null,
          reply_like_count: '0',
        }
      ]);
    });
  });

  describe('verifyCommentAvailability function', () => {
    it('should throw NotFoundError when comment is not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('wrong-id')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw error when comment found', async () => {
      // Arrange
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({ id: commentId, userId: userId, threadId: threadId });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability(commentId)).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when not the owner of the comment', async () => {
      // Arrange
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({ id: commentId, userId: userId, threadId: threadId });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, 'wrong-id')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw error when the owner of the comment', async () => {
      // Arrange
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({ id: commentId, userId: userId, threadId: threadId });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, userId)).resolves.not.toThrowError(AuthorizationError);
    });
  });
});