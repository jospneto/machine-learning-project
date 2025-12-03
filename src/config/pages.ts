import { definePage } from '@/utils/functions';

export const PAGES = {
  HOME: definePage(() => '/'),
  FEATURE_PROTECTED: definePage(() => '/feature-protected'),
  POSTS: definePage(() => '/posts'),
  CREATE_POST: definePage(() => '/posts/create'),
  EDIT_POST: definePage<{ postId: string }>(({ postId }) => `/posts/${postId}/edit`),
};
