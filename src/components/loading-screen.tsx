// Loading screen component for async operations

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen = ({ message = 'Loading...' }: LoadingScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <div className="text-center space-y-8 animate-fade-in">
        {/* Animated spinner */}
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 border-8 border-white/20 rounded-full" />
          <div className="absolute inset-0 border-8 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        </div>

        <p className="text-3xl font-bold animate-pulse">{message}</p>

        <div className="flex gap-2 justify-center">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

