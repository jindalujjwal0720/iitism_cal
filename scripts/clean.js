import { readFile, writeFile } from "fs";
import { resolve } from "path";

// 100 spaces
const LINE_DELIMITER = " ".repeat(100);

// Function to parse CSV and split the time table into structured objects
function parseCsvToJson(csvString) {
  const [headerLine, ...lines] = csvString.trim().split("\n");
  const headers = headerLine.split(",").map((h) => h.replace(/"/g, "").trim());
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return lines.map((line) => {
    const values = line
      .split(",")
      // Remove double quotes and trim spaces
      .map((value) => value.replace(/"/g, "").trim());
    const obj = headers.reduce((acc, header, index) => {
      acc[header] = values[index];
      return acc;
    }, {});

    if (obj["Course"]) {
      const course = obj["Course"].match(/(.*)\((.*)\)/);
      if (course) {
        obj["Course"] = course[1].trim();
        obj["Course Name"] = course[2].trim();
      }
    }

    // Split and structure the Time Table field
    if (obj["Time Table"]) {
      obj["Time Table"] = obj["Time Table"]
        .split(LINE_DELIMITER)
        .map((item) => item.trim())
        .slice(1) // Skip the first line
        .map((item) => {
          const [day, time, venue] = item.split(/\s{2,}/).map((i) => i.trim());
          if (!day || !time) return null;
          return {
            Day: daysOfWeek[daysOfWeek.indexOf(day)],
            Time: time,
            Venue: venue || null,
          };
        })
        .filter((item) => item !== null)
        // remove duplicate entries
        .filter(
          (item, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.Day === item.Day &&
                t.Time === item.Time &&
                t.Venue === item.Venue,
            ),
        );
    }

    return obj;
  });
}

// Function to read CSV and write JSON
function cleanCsv(inputFileName, outputFileName) {
  readFile(inputFileName, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file ${inputFileName}:`, err);
      return;
    }

    try {
      const jsonData = parseCsvToJson(data);

      writeFile(
        outputFileName,
        JSON.stringify(jsonData, null, 2),
        "utf8",
        (err) => {
          if (err) {
            console.error(`Error writing file ${outputFileName}:`, err);
          } else {
            console.log(`CSV successfully written to ${outputFileName}`);
          }
        },
      );
    } catch (error) {
      console.error("Error parsing CSV:", error);
    }
  });
}

// Function to convert JSON to CSV
// const parseJsonToCsv = (data) => {
//   // flatten every time table row
//   const flatData = data.flatMap((item) => {
//     if (item["Time Table"]) {
//       return item["Time Table"].map((timeTable) => ({
//         ...item,
//         ...timeTable,
//       }));
//     }
//     return item;
//   });

//   const EXCLUDED_HEADERS = ["Time Table"];
//   const headers = Object.keys(flatData[0]).filter(
//     (header) => !EXCLUDED_HEADERS.includes(header),
//   );

//   const csv = [
//     headers.join(","),
//     ...flatData.map((item) =>
//       headers.map((header) => item[header] || "").join(","),
//     ),
//   ].join("\n");

//   return csv;
// };

// Input and output file paths
const inputFileName = resolve(__dirname, "../assets/cse-schedule.csv");
const outputFileName = resolve(__dirname, "../assets/courses.json");

// Convert the CSV to JSON
cleanCsv(inputFileName, outputFileName);
