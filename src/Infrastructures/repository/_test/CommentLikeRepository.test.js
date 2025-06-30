const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres')

describe('CommentLikeRepositoryPostgres', () => {
  const userId = 'user-123';
  const commentId = 'comment-123';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
    await ThreadsTableTestHelper.addThread({ userId: userId});
    await CommentsTableTestHelper.addComment({ commentId: commentId, userId: userId });
  })

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
  })

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end()
  })

  describe('getLikeComment function', () => {
    it('should throw empty row when comment like not found', async () => {
      // Arrange
      const payload = {
        userId: 'user-123',
        commentId:'comment-123',
      }

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action 
      const likeComment = await commentLikeRepositoryPostgres.getLikeComment(payload);

      // Assert
      expect(likeComment).toEqual([]);
    })

    it('should not throw empty row when comment like found', async () => {
      // Arrange
      await CommentLikesTableTestHelper.addLikeComment({
        id: 'like-123',
        userId: userId,
        commentId: commentId,
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
      });

      const payload = {
        userId: 'user-123',
        commentId:'comment-123',
      }

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action 
      const likeComment = await commentLikeRepositoryPostgres.getLikeComment(payload);

      // Assert
      expect(likeComment).toEqual([{
        id: 'like-123',
        user_id: 'user-123',
        comment_id: 'comment-123',
        created_at: '2025-01-01',
        updated_at: '2025-01-01',
      }]);
    })
  })

  describe('addLikeComment function', () => {
    it('should not throw error', async () => {
      // Arrange
      const payload = {
        userId: 'user-123',
        commentId: 'comment-123',
      }
      const fakeIdGenerator = () => '123';

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await expect(commentLikeRepositoryPostgres.addLikeComment(payload)).resolves.not.toThrowError();
    })
  })

  describe('deleteLikeComment function', () => {
    it('should not throw error', async () => {
      // Arrange
      await CommentLikesTableTestHelper.addLikeComment({
        id: 'like-123',
        userId: userId,
        commentId: commentId,
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
      });

      const payload = {
        userId: 'user-123',
        commentId: 'comment-123',
      }
      const fakeIdGenerator = () => '123';

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await expect(commentLikeRepositoryPostgres.deleteLikeComment(payload)).resolves.not.toThrowError();
    })
  })
})