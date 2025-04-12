import React from "react";

const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3 p-3 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="mt-0.5 text-indigo-600 dark:text-indigo-400">{icon}</div>
      <div className="text-sm sm:text-base text-gray-800 dark:text-gray-200">
        <span className="font-semibold">{label}:</span>{" "}
        <span className="text-gray-700 dark:text-gray-300">{value}</span>
      </div>
    </div>
  );
  
  export default DetailItem;
  