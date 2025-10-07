// Loading screen while generating photo strip
export const GeneratingScreen = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen transition-all duration-500 animate-fade-in"
      style={{ backgroundColor: '#388046' }}
    >
      <div className="text-center space-y-8 animate-slide-up">
        {/* Spinner */}
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 border-8 border-white/20 rounded-full" />
          <div className="absolute inset-0 border-8 border-white border-t-transparent rounded-full animate-spin" />
        </div>

        {/* Message */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-6xl font-bold text-white drop-shadow-2xl">
            Creating Your Photos...
          </h2>
          <p className="text-3xl text-white/90">
            Just a moment
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-3 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

