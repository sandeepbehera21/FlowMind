import React from "react";

export const PageSkeleton: React.FC = () => {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="w-full max-w-3xl space-y-4">
        <div className="h-8 w-3/4 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-48 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        <div className="h-24 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
      </div>
    </div>
  );
};

export default PageSkeleton;
