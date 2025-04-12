"use client";

import { useState } from "react";
import { educationTracks } from "../data/moroccoEducationData";
import { useQuizStore } from "../store/quizStore";

type TrackInfo = {
  id: string;
  name: string;
  description?: string;
  subjects?: string[];
  careerOptions?: string[];
  universities?: string[];
  score?: number;
};

export default function TrackComparisonView() {
  const { report } = useQuizStore();
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);

  // Get top tracks from the report scores
  const topTracks = report?.scores.slice(0, 5).map(score => ({
    id: score.trackId,
    name: score.trackName,
    score: score.score
  })) || [];

  // Prepare track data for selection
  const availableTracks = Object.entries(educationTracks).map(([id, track]) => ({
    id,
    name: track.name
  }));

  // Handle track selection
  const handleTrackSelect = (trackId: string) => {
    if (selectedTracks.includes(trackId)) {
      setSelectedTracks(selectedTracks.filter(id => id !== trackId));
    } else if (selectedTracks.length < 2) {
      setSelectedTracks([...selectedTracks, trackId]);
    }
  };

  // Get detailed information for the selected tracks
  const selectedTracksInfo: TrackInfo[] = selectedTracks.map(trackId => {
    const trackData = educationTracks[trackId as keyof typeof educationTracks];
    const score = report?.scores.find(s => s.trackId === trackId)?.score || 0;
    
    return {
      id: trackId,
      name: trackData?.name || "Unknown Track",
      description: trackData?.description,
      subjects: trackData?.subjects,
      careerOptions: trackData?.careerOptions,
      universities: trackData?.universities,
      score
    };
  });

  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Compare Educational Tracks</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Select up to two tracks to compare:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {topTracks.map(track => (
            <button
              key={track.id}
              onClick={() => handleTrackSelect(track.id)}
              className={`p-2 rounded text-sm ${
                selectedTracks.includes(track.id)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {track.name} ({track.score?.toFixed(1)}/10)
            </button>
          ))}
          {topTracks.length === 0 && (
            <p className="text-gray-500 col-span-3">Complete the assessment to see track options</p>
          )}
        </div>
      </div>
      
      {selectedTracks.length > 0 && (
        <div className="comparison-table">
          <div className="grid grid-cols-3 gap-4">
            <div className="font-bold">Attributes</div>
            {selectedTracksInfo.map(track => (
              <div key={track.id} className="font-bold text-blue-800">
                {track.name}
              </div>
            ))}

            
            {/* Fill empty column if only one track selected */}
            {selectedTracks.length === 1 && <div></div>}
            
            <div className="font-semibold">Your Score</div>
            {selectedTracksInfo.map(track => (
              <div key={`${track.id}-score`} className="text-green-700 font-semibold">
                {track.score?.toFixed(1)}/10
              </div>
            ))}
            {selectedTracks.length === 1 && <div></div>}
            
            <div className="font-semibold">Description</div>
            {selectedTracksInfo.map(track => (
              <div key={`${track.id}-desc`} className="text-sm">
                {track.description || "No description available"}
              </div>
            ))}
            {selectedTracks.length === 1 && <div></div>}
            
            <div className="font-semibold">Core Subjects</div>
            {selectedTracksInfo.map(track => (
              <div key={`${track.id}-subjects`}>
                <ul className="list-disc list-inside text-sm">
                  {track.subjects?.map((subject, i) => (
                    <li key={i}>{subject}</li>
                  )) || "No subjects listed"}
                </ul>
              </div>
            ))}
            {selectedTracks.length === 1 && <div></div>}
            
            <div className="font-semibold">Career Options</div>
            {selectedTracksInfo.map(track => (
              <div key={`${track.id}-careers`}>
                <ul className="list-disc list-inside text-sm">
                  {track.careerOptions?.map((career, i) => (
                    <li key={i}>{career}</li>
                  )) || "No career options listed"}
                </ul>
              </div>
            ))}
            {selectedTracks.length === 1 && <div></div>}
            
            <div className="font-semibold">Universities/Programs</div>
            {selectedTracksInfo.map(track => (
              <div key={`${track.id}-unis`}>
                <ul className="list-disc list-inside text-sm">
                  {track.universities?.map((uni, i) => (
                    <li key={i}>{uni}</li>
                  )) || "No universities listed"}
                </ul>
              </div>
            ))}
            {selectedTracks.length === 1 && <div></div>}
          </div>
        </div>
      )}
      
      {selectedTracks.length === 0 && (
        <p className="text-gray-500 italic">Select tracks above to see comparison details</p>
      )}
    </div>
  );
}

