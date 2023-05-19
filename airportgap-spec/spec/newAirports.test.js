import request from "supertest";
import chai from "chai";

const { expect } = chai;

const api = request("https://airportgap.dev-tester.com/api");

describe(
  {
    title: "Airport Gap API",
    description:
      "This example spec uses the [Airport Gap API](https://airportgap.dev-tester.com/api).",
  },
  () => {
    describe(
      {
        title: "GET /airports",
        description: "Returning all Airports.",
      },
      function () {
        this.timeout(15000);
        it(
          {
            title: "returns all airports, limited to 30 per page",
            description: "Should pass.",
          },
          () =>
            api
              .get("/airports")
              .expect(200)
              .expect((res) => expect(res.body.data.length).to.eql(30))
        );
      }
    );

    describe(
      {
        title: "POST /airports/distance",
        description: "Calculating distance etc.",
      },
      function () {
        this.timeout(20000);
        it(
          {
            title: "calculates the distance between two airports",
            description: "Should pass.",
          },
          () => {
            api
              .post("/airports/distance")
              .send({ from: "KIX", to: "SFO" })
              .expect(200)
              .expect((res) =>
                expect(res.body.data.attributes).to.include.keys(
                  "kilometers",
                  "miles",
                  "nautical_miles"
                )
              );
          }
        );
      }
    );

    describe(
      {
        title: "POST /favorites",
        description: "Should not work, because not authorized",
      },
      function () {
        this.timeout(15000);
        it(
          { title: "requires authentication", description: "should pass" },
          () => {
            api
              .post("/favorites")
              .send({
                airport_id: "JFK",
                note: "My usual layover when visiting family",
              })
              .expect(401);
          }
        );
      }
    );
  }
);
