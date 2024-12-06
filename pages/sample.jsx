"use client";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import * as ort from "onnxruntime-web";

const labels = ["Happy", "Sad", "Anger"];

export default function ImageDetector() {
  const [file, setFile] = useState(null);
  const [model, setModel] = useState(null);
  const [preview, setPreview] = useState(null);
  const [response, setResponse] = useState("");
  const [pred, setPred] = useState("");

  useEffect(() => {
    const loadModel = async () => {
      try {
        const session = await ort.InferenceSession.create("faceRecog_model.onnx");
        setModel(session);
      } catch (error) {
        console.error("Failed to load ONNX model:", error);
      }
    };
    loadModel();
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith("image/")) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      alert("Please upload a valid image file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !model) {
      alert("Please upload an image and wait for the model to load.");
      return;
    }

    try {
      const imageTensor = await preprocessImage(file);

      // Run inference
      const feeds = { sequential_1_input: imageTensor };
      const results = await model.run(feeds);

      const output = results["sequential_3"].data;
      const highestIndex = output.indexOf(Math.max(...output));
      const detectedLabel = labels[highestIndex];

      setResponse(JSON.stringify(output));
      setPred(detectedLabel);
    } catch (error) {
      console.error("Error during inference:", error);
      alert("Error during prediction.");
    }
  };

  const preprocessImage = async (file) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    return new Promise((resolve, reject) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const modelInputSize = 224;
        canvas.width = modelInputSize;
        canvas.height = modelInputSize;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0, modelInputSize, modelInputSize);

        const imageData = ctx.getImageData(0, 0, modelInputSize, modelInputSize);
        const { data, width, height } = imageData;

        const input = new Float32Array(width * height * 3);
        for (let i = 0; i < data.length; i += 4) {
          const idx = i / 4;
          input[idx * 3] = data[i] / 255;
          input[idx * 3 + 1] = data[i + 1] / 255;
          input[idx * 3 + 2] = data[i + 2] / 255;
        }

        resolve(new ort.Tensor("float32", input, [1, width, height, 3]));
      };

      img.onerror = (error) => reject(error);
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div
          {...getRootProps()}
          style={{
            border: "2px dashed #cccccc",
            padding: "10px",
            textAlign: "center",
            borderRadius: "10px",
            cursor: "pointer",
            backgroundColor: isDragActive ? "#e0e0e0" : "#f9f9f9",
            backgroundImage: preview ? `url(${preview})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "100px",
            minWidth: "200px",
          }}
        >
          <input {...getInputProps()} accept="image/*" />
          {isDragActive ? (
            <p>Drop the image here...</p>
          ) : (
            <p>
              <b>{preview ? "" : "DROP OR UPLOAD"}</b>
            </p>
          )}
        </div>
        <br />
        <button type="submit">RECOGNIZE</button>
      </form>
      <div className="ans-div">
        {response && (
          <p className="ansPara">
            <span className="ansSpan">Response</span>: {response}
          </p>
        )}
        {pred && (
          <p className="ansPara">
            <span className="ansSpan">Prediction</span>: {pred}
          </p>
        )}
      </div>
    </>
  );
}
