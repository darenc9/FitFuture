import React from "react";

export const force = {
    "type": [ "string", "null" ],
    "enum": [
      "static",
      "pull",
      "push"
    ]
}

export const level = {
    "type": "string",
    "enum": [
      "beginner",
      "intermediate",
      "expert"
    ]
}

export const mechanic = {
    "type": [ "string", "null" ],
    "enum": [
      "isolation",
      "compound"
    ]
}

export const equipment = {
    "type": [ "string", "null" ],
    "enum": [
      "medicine ball",
      "dumbbell",
      "body only",
      "bands",
      "kettlebells",
      "foam roll",
      "cable",
      "machine",
      "barbell",
      "exercise ball",
      "e-z curl bar",
      "other"
    ] 
}

export const muscle = {
    "type": "array",
    "enum": [
        "abdominals",
        "abductors",
        "adductors",
        "biceps",
        "calves",
        "chest",
        "forearms",
        "glutes",
        "hamstrings",
        "lats",
        "lower back",
        "middle back",
        "neck",
        "quadriceps",
        "shoulders",
        "traps",
        "triceps"
    ]
}

export const category = {
    "type": "string",
    "enum": [
      "powerlifting",
      "strength",
      "stretching",
      "cardio",
      "olympic weightlifting",
      "strongman",
      "plyometrics"
    ]
}

