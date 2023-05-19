import { init } from "@catsjs/core";
const { api, json, vars } = await init();

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
        timeout: 15000,
      },
      () => {
        it(
          {
            title: "returns all airports, limited to 30 per page",
            description: "Should pass.",
          },
          () =>
            api
              .get("/airports")
              .expect(200)
              .expect((res) => json.of(res.body.data.length).to.eql(30))
        );
      }
    );

    describe(
      {
        title: "POST /airports/distance",
        description: "Calculating distance etc.",
        timeout: 15000,
      },
      () => {
        it(
          {
            title: "calculates the distance between two airports",
            description: "Should pass.",
          },
          () =>
            api
              .post("/airports/distance")
              .send({ from: "KIX", to: "SFO" })
              .expect(200)
              .expect((res) =>
                json
                  .of(res.body.data.attributes)
                  .to.include.keys("kilometers", "miles", "nautical_miles")
              )
        );
      }
    );

    describe(
      {
        title: "POST /favorites",
        description: "Should not work, because not authorized",
        timeout: 15000,
      },
      () => {
        it(
          { title: "requires authentication", description: "should pass" },
          () =>
            api
              .post("/favorites")
              .send({
                airport_id: "JFK",
                note: "My usual layover when visiting family",
              })
              .expect(401)
        );
      }
    );
    describe(
      {
        title: "POST /favorites",
        description: "Should work, because authorized",
        timeout: 15000,
      },
      () => {
        it(
          {
            title: "allows an user to create favorite airports",
            description: "should pass",
          },
          () =>
            api
              .post("/favorites")
              .set("Authorization", `Bearer token=TsxZ61MTN7cM7YJcu75raZmv`)
              .send({
                airport_id: "JFK",
                note: "My usual layover when visiting family",
              })
              .expect(201)
              .expect((res) =>
                json
                  .of(res.body.data.attributes.airport.name)
                  .to.eql("John F Kennedy International Airport")
              )
              .expect((res) =>
                json
                  .of(res.body.data.attributes.note)
                  .to.eql("My usual layover when visiting family")
              )
        );
        it(
          {
            title: "allows an user to update favorite airports",
            description: "should pass",
          },
          () =>
            api
              .put(`/favorites/${api.body.data.id}`)
              .set("Authorization", `Bearer token=TsxZ61MTN7cM7YJcu75raZmv`)
              .send({
                note: "My usual layover when visiting family and friends",
              })
              .expect(200)
              .expect((res) =>
                json
                  .of(res.body.data.attributes.airport.name)
                  .to.eql("John F Kennedy International Airport")
              )
              .expect((res) =>
                json
                  .of(res.body.data.attributes.note)
                  .to.eql("My usual layover when visiting family and friends")
              )
        );

        it(
          {
            title: "allows an user to delete favorite airports",
            description: "should pass",
          },
          () =>
            api
              .delete(`/favorites/${api.body.data.id}`)
              .set("Authorization", `Bearer token=TsxZ61MTN7cM7YJcu75raZmv`)
              .expect(204)
        );
        it(
          {
            title: "Verify that the record was deleted",
            description: "should pass",
          },
          () =>
            api
              .get(`/favorites/${api.body.data.id}`)
              .set("Authorization", `Bearer token=TsxZ61MTN7cM7YJcu75raZmv`)
              .expect(404)
        );
      }
    );
  }
);
