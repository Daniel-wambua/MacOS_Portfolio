import React from "react";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <div className="mb-4 flex gap-2">
      <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
      <span className="inline-block w-3 h-3 rounded-full bg-yellow-400"></span>
      <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
    </div>
    <div className="text-6xl mb-2">🕵️‍♂️</div>
    <h1 className="text-4xl font-bold mb-2">404</h1>
    <p className="text-gray-400 mb-4">Lost in the system.<br />This page doesn’t exist.<br />Maybe you mistyped the URL?</p>
    <a href="/" className="text-blue-500 hover:underline">Return to Desktop</a>
  </div>
);

export default NotFound;
