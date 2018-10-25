exports.q1 = { method: "getSeats",
  settings: { filter: [ { field: "sector",
                          value: 7 },
                        { field: "category",
                          value: 4   }],
                        fields: ["id","seat","sector","line","category"]
            }
};
