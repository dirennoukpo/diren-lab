# Experiment datasets

Drop one JSON file per chart here, then reference its filename from an
experiment's `dataset` frontmatter field (e.g. `dataset: "torque-vs-angle.json"`).

Expected shape, consumed by `src/components/ExperimentChart.tsx`:

```json
{
  "xKey": "angle",
  "yKeys": ["measured", "predicted"],
  "caption": "TODO: one-sentence description read by screen readers",
  "points": [
    { "angle": 0, "measured": 0, "predicted": 0 },
    { "angle": 10, "measured": 4.8, "predicted": 5.0 }
  ]
}
```

No dataset ships in this repo by default — add real measured data only.
