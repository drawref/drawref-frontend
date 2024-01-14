// timing methods, lengths, etc

// static image intervals
export const imageIntervals = [
  {
    value: "30s",
    display: "30 seconds",
    seconds: 30,
  },
  {
    value: "1m",
    display: "1 minute",
    seconds: 60,
  },
  {
    value: "2m",
    display: "2 minutes",
    seconds: 60 * 2,
  },
  {
    value: "5m",
    display: "5 minutes",
    seconds: 60 * 5,
  },
  {
    value: "10m",
    display: "10 minutes",
    seconds: 60 * 10,
  },
  {
    value: "15m",
    display: "15 minutes",
    seconds: 60 * 15,
  },
  {
    value: "30m",
    display: "30 minutes",
    seconds: 60 * 30,
  },
  {
    value: "1h",
    display: "1 hour",
    seconds: 60 * 60,
  },
];

// class mode
export const classLengths = [
  {
    value: "15m",
    display: "15 minutes",
    intervals: [60, 60, 60, 60, 60, 60 * 2.5, 60 * 2.5, 60 * 5],
  },
  {
    value: "30m",
    display: "30 minutes",
    intervals: [60, 60, 60, 60 * 3.5, 60 * 3.5, 60 * 5, 60 * 5, 60 * 10],
  },
  {
    value: "45m",
    display: "45 minutes",
    intervals: [60, 60, 60, 60 * 3.5, 60 * 3.5, 60 * 5, 60 * 5, 60 * 10, 60 * 15],
  },
  {
    value: "1h",
    display: "1 hour",
    intervals: [60, 60, 60, 60, 60 * 2, 60 * 2, 60 * 2, 60 * 5, 60 * 5, 60 * 5, 60 * 15, 60 * 20],
  },
  {
    value: "2h",
    display: "2 hours",
    intervals: [60, 60, 60, 60, 60 * 2, 60 * 2, 60 * 2, 60 * 5, 60 * 5, 60 * 5, 60 * 15, 60 * 20, 60 * 30, 60 * 30],
  },
];
