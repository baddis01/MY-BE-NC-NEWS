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
});

// expect(res.body.article).toEqual(
//     expect.objectContaining({
//       author: expect.any(String),
//       title: expect.any(String),
//       article_id: expect.any(Number),
//       body: expect.any(String),
//       topic: expect.any(String),
//       created_at: expect.any(Number),
//       votes: expect.any(Number)
//     })
//  );
