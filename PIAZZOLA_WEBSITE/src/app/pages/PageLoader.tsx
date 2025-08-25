
const PageLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center space-y-4">
        {/* Animation circulaire */}
        <div className="loader animate-spin rounded-full border-4 border-t-4 border-blue-500 h-16 w-16"></div>
        <p className="text-gray-700 text-lg font-semibold">Chargement en cours...</p>
      </div>
    </div>
  );
};

export default PageLoader;
