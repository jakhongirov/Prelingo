"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_1 = require("../../lib/postgres");
const postsList = (limit, page) => {
    const QUERY = `
      SELECT
         *
      FROM
         posts
      ORDER BY
         id DESC
      LIMIT $1
      OFFSET $2;
   `;
    return (0, postgres_1.fetchALL)(QUERY, limit, Number((page - 1) * limit));
};
const postByID = (id) => {
    const QUERY = `
      SELECT
         *
      FROM 
         posts
      WHERE
         id = $1;
   `;
    return (0, postgres_1.fetch)(QUERY, id);
};
const foundUserPosts = (userId) => {
    const QUERY = `
      SELECT
         *
      FROM
         posts
      WHERE
         user_id = $1;
   `;
    return (0, postgres_1.fetchALL)(QUERY, userId);
};
const addPost = (postData, imgUrl, imgName, userId) => {
    const QUERY = `
      INSERT INTO
         posts (
            title,
            description,
            image_url,
            image_name,
            user_id
         ) VALUES (
            $1, 
            $2, 
            $3, 
            $4, 
            $5 
         ) RETURNING *;
   `;
    return (0, postgres_1.fetch)(QUERY, postData.title, postData.description, imgUrl, imgName, userId);
};
exports.default = {
    postsList,
    postByID,
    foundUserPosts,
    addPost,
};
