import React from 'react';

export default function ExerciseDetails({ exercise }) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{exercise.name}</h1>
        <div className="mb-4">
          <p><span className="font-semibold">Force:</span> {exercise.force}</p>
          <p><span className="font-semibold">Level:</span> {exercise.level}</p>
          <p><span className="font-semibold">Mechanic:</span> {exercise.mechanic}</p>
          <p><span className="font-semibold">Equipment:</span> {exercise.equipment}</p>
        </div>
        <div className="mb-4">
          <p><span className="font-semibold">Primary Muscles:</span> {exercise.primaryMuscles.join(', ')}</p>
          <p><span className="font-semibold">Secondary Muscles:</span> {exercise.secondaryMuscles.join(', ')}</p>
        </div>
        <div className="mb-4">
          <p className="font-semibold">Instructions:</p>
          <ul className="list-disc pl-6">
            {exercise.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <p><span className="font-semibold">Category:</span> {exercise.category}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {exercise.images.map((image, index) => (
            <img key={index} src={image} alt={`Image ${index}`} className="rounded-lg" />
          ))}
        </div>
      </div>
    );
}
