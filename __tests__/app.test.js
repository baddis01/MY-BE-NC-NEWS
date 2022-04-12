const app = require("../app.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const data = require("../db/data/test-data");
const { convertTimestampToDate } = require("../db/helpers/utils.js");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("app", () => {
  test("Status: 404 - responds with path not found", () => {
    return request(app)
      .get("/*")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Path not found");
      });
  });

  describe("GET - /api/topics", () => {
    test("status: 200 - should show status of 200", () => {
      return request(app).get("/api/topics").expect(200);
    });
    test("status: 200 - should return a topics array with a length of 3", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          expect(res.body.topics).toHaveLength(3);
        });
    });
    test("status: 200 - each topic object should conatin the expected properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          res.body.topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
  });

  describe("GET - /api/articles", () => {
    test("status: 200 - should return a status 200", () => {
      return request(app).get("/api/articles").expect(200);
    });
    test("status: 200 - should return an array of article objects with a length of 12", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toHaveLength(12);
        });
    });
    test("status: 200 - each article object should contain the expected properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          res.body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
        });
    });
  });

  describe("GET - /api/articles/:article_id", () => {
    test("status: 200 - should return return an article object with all the containing all expected properties ", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((res) => {
          expect(res.body.article).toEqual(
            expect.objectContaining({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              // created_at: convertTimestampToDate({created_at: 1594329060000}),
              votes: 100,
              comment_count: 11,
            })
          );
        });
    });
    test("status: 200 - should return return an article object with all the containing all expected properties but testing 0 comments in comment count field", () => {
      return request(app)
        .get("/api/articles/4")
        .expect(200)
        .then((res) => {
          expect(res.body.article).toEqual(
            expect.objectContaining({
              article_id: 4,
              title: "Student SUES Mitch!",
              topic: "mitch",
              author: "rogersop",
              body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
              created_at: "2020-05-06T01:14:00.000Z",
              votes: 0,
              comment_count: 0,
            })
          );
        });
    });
    test("status: 404 - should return with a message 'No article with this article id number' when requesting an invalid article_id number", () => {
      return request(app)
        .get("/api/articles/1989")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("No article with this article id number");
        });
    });
    test("status: 400 - should return with a message 'Bad Request' when ID request isn't a number", () => {
      return request(app)
        .get("/api/articles/notAnId")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });
  });

  describe("GET - /api/articles/:article_id/comments", () => {
    test("status: 200 - should return an array of comment objects, each should have the expected properties", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((res) => {
          expect(res.body[0]).toEqual(
            expect.objectContaining({
              comment_id: 2,
              body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
              votes: 14,
              author: "butter_bridge",
              created_at: "2020-10-31T03:03:00.000Z",
            })
          );
        });
    });
    test("status: 200 - should return an array of article objects with a length of 11", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveLength(11);
        });
    });
    test("status: 404 - should return with a message 'No comments for this article id number' when requesting an article_id number with 0 comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("No comments for this article id number");
        });
    });
  });

  describe("PATCH - /api/articles/:article_id", () => {
    test("status: 200 - should accept the request in the form of an object { inc_vote: newVote } taking a positive number", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 10 })
        .expect(200)
        .then((res) => {
          expect(res.body.article.votes).toBe(110);
        });
    });
    test("status: 200 - should accept the request in the form of an object { inc_vote: newVote } taking a negative number", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -10 })
        .expect(200)
        .then((res) => {
          expect(res.body.article.votes).toBe(90);
        });
    });
    test("status: 400 - should return with a 'Bad request' message when missing fields {} ", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({})
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request - Missing/Incorrect Fields");
        });
    });
    test("status: 400 - should return with a 'Bad Request' when data type is incorrect", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({ inc_votes: "twelve" })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });
    test("status: 400 - should return with 'Bad Request' when key is wrong", () => {
      return request(app)
        .patch("/api/articles/4")
        .send({ increase_das_votes: 6 })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request - Missing/Incorrect Fields");
        });
    });
    test("status: 400 - should return with a message 'Bad Request' when ID request isn't a number", () => {
      return request(app)
        .patch("/api/articles/stillNotAnId")
        .send({ inc_votes: 27 })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });
    test("status: 404 - should return with a message 'No article with this article id number' when requesting an invalid article_id number", () => {
      return request(app)
        .patch("/api/articles/78293")
        .send({ inc_votes: 10 })
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("No article with this article id number");
        });
    });
  });

  describe("GET - /api/users", () => {
    test("status: 200 - should return a status 200", () => {
      return request(app).get("/api/users").expect(200);
    });
    test("status: 200 - should return an array of users objects with a length of 4", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((res) => {
          expect(res.body.users).toHaveLength(4);
        });
    });
    test("status: 200 - each user object should contain the expected properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((res) => {
          res.body.users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
              })
            );
          });
        });
    });
  });
});
