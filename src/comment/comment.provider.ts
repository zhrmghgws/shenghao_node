export const sqlFragment = {
  leftJoinUser: `
    LEFT JOIN user
    ON user.id=comment.userId
    LEFT JOIN avatar
    ON user.id=avatar.userId
  `,
  user: `
    json_object(
    'id',user.id,
    'name',user.name,
    'avatar',if(count(avatar.id),1,null)
  ) as user
  `,
  leftJoinPost: `
      LEFT JOIN post
      ON post.id =comment.postId
  `,
  post: `
      JSON_OBJECT(
        'id',post.id,
        'title',post.title
      ) AS post
  `,
  repliedComment: `
        (
          select json_object(
            'id',repliedComment.id,
            'content',repliedComment.content
          )
          from comment repliedComment
          where comment.parentId = repliedComment.id
        ) as repliedComment
  `,
  totalReplies: `
            (
              select count(reply.id)
              from comment reply
              where reply.parentId = comment.id
            ) as commentCount
  `,
};
