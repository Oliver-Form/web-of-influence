"use client";

interface LoadingComponentProps {
  message?: string;
}

export default function LoadingComponent({ message = "Loading..." }: LoadingComponentProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">{message}</h2>
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    </div>
  );
}
