import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";

// This function handles GET requests to /api/traffic-data
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("Dataset");
    const collection = db.collection("Iot data");

    // Aggregation pipeline to group data by hour and calculate average vehicle count
    const pipeline = [
      // Stage 1: Deconstruct the 'data' array into separate documents
      {
        $unwind: "$data",
      },
      // Stage 2: Add a new field 'hour24' by converting the AM/PM time string.
      // This is where the new, more robust time parsing logic is.
      {
        $addFields: {
          "data.hour24": {
            $let: {
              vars: {
                timeStr: "$data.time",
                hourPartStr: {
                  $arrayElemAt: [{ $split: ["$data.time", ":"] }, 0],
                },
                isPM: { $regexMatch: { input: "$data.time", regex: /pm/i } },
              },
              in: {
                $let: {
                  vars: {
                    hourPart: { $toInt: "$$hourPartStr" },
                  },
                  in: {
                    $switch: {
                      branches: [
                        // Case 1: It's PM and hour is not 12 (e.g., 1pm-11pm), add 12
                        {
                          case: {
                            $and: ["$$isPM", { $ne: ["$$hourPart", 12] }],
                          },
                          then: { $add: ["$$hourPart", 12] },
                        },
                        // Case 2: It's 12:xx AM, which is hour 0
                        {
                          case: {
                            $and: [
                              { $not: "$$isPM" },
                              { $eq: ["$$hourPart", 12] },
                            ],
                          },
                          then: 0,
                        },
                      ],
                      // Default: Hour is correct as is (e.g., 9am is 9, 12pm is 12)
                      default: "$$hourPart",
                    },
                  },
                },
              },
            },
          },
        },
      },
      // Stage 3: Group by location name and the new 'hour24' field
      {
        $group: {
          _id: {
            name: "$name",
            hour: "$data.hour24", // Group by the converted 24-hour value
          },
          // Calculate the average vehicle count for each group
          avgVehicleCount: { $avg: "$data.vehicle_count" },
        },
      },
      // Stage 4: Sort the results by the hour
      {
        $sort: {
          "_id.hour": 1,
        },
      },
      // Stage 5: Group again by location name to restructure the data
      {
        $group: {
          _id: "$_id.name",
          // Create an array of hourly data points
          hourlyData: {
            $push: {
              hour: "$_id.hour",
              // Round the average count to an integer for cleaner display
              vehicle_count: { $round: ["$avgVehicleCount", 0] },
            },
          },
        },
      },
      // Stage 6: Project the final structure to match what the frontend expects
      {
        $project: {
          _id: 0,
          name: "$_id",
          data: "$hourlyData",
        },
      },
    ];

    const locations = await collection.aggregate(pipeline).toArray();

    return NextResponse.json(locations);
  } catch (e) {
    console.error("Aggregation Error:", e);
    return NextResponse.json(
      { error: "Unable to fetch and aggregate location data." },
      { status: 500 }
    );
  }
}

