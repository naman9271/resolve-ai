"use client";

import { PlaceholdersAndVanishInput } from "./placeholders-and-vanish-input";

export function AIButton() {
  const placeholders = [
    "Explain the concept of chemical equilibrium...",
    "How to solve this JEE physics problem?",
    "What are the key topics for JEE Mathematics?",
    "Help me understand organic chemistry reactions...",
    "Create a study plan for JEE preparation...",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <div className="w-full max-w-2xl mx-auto">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}
