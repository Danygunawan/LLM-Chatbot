import React, { useState } from "react";

export default function FoodAnalysis() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // URL backend Motoko
  const BACKEND_URL = "qbyjz-wyaaa-aaaab-qbnhq-cai"; // Ganti dengan URL canister Anda

  // Fungsi untuk menangani unggahan gambar
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Base64
        setImagePreview(URL.createObjectURL(file)); // Preview
      };
      reader.readAsDataURL(file);
    }
  };

  // Fungsi untuk mengirim gambar ke backend
  const handleAnalyze = async () => {
    if (!image) {
      alert("Please upload an image first!");
      return;
    }

    setLoading(true);
    setAnalysisResult(null);

    try {
      console.log("Sending image to backend...");
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: image }), // Kirim Base64 ke backend
      });

      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error("Failed to analyze food");
      }

      const data = await response.json();
      console.log("Analysis Result:", data);
      setAnalysisResult(data);
    } catch (error) {
      console.error("Error analyzing food:", error);
      setAnalysisResult({ error: "Failed to analyze image. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Food Analysis</h1>
      <p className="text-center text-gray-600 mb-6">
        Analyze your food photos for detailed nutritional insights.
      </p>

      {/* How It Works Section */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">How It Works</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-blue-500">1</div>
            <p>Upload Photo</p>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-500">2</div>
            <p>AI Analysis</p>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-500">3</div>
            <p>Get Insights</p>
          </div>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="mt-6 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Uploaded Preview"
            className="max-h-48 mx-auto mb-4 rounded"
          />
        ) : (
          <p className="text-gray-500">Drag & drop your image here, or browse</p>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="upload"
          onChange={handleImageUpload}
        />
        <label
          htmlFor="upload"
          className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded mt-4 inline-block"
        >
          Upload Image
        </label>
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        className="bg-green-500 text-white px-6 py-2 rounded w-full mt-4"
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {/* Display Results */}
      {analysisResult && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-lg font-semibold">Analysis Result:</h2>
          <pre className="bg-gray-200 p-2 mt-2 rounded">
            {JSON.stringify(analysisResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
