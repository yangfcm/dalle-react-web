import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { preview } from "../assets";
import { getRandomPrompt } from "../utils";
import FormField from "../components/FormField";
import Loader from "../components/Loader";

function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    prompt: "",
    image: "",
  });
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(form.name.trim() && form.prompt.trim() && form.image)) return;
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/v1/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      await response.json();
      setForm({
        name: "",
        prompt: "",
        image: "",
      });
      // handle success or error.
      setError("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    if (!form.prompt.trim()) return;
    try {
      setGenerating(true);
      const response = await fetch("http://localhost:8080/api/v1/dalle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: form.prompt }),
      });
      const data = await response.json();
      if (response.status === 200) {
        setForm({
          ...form,
          image: `data:image/jpeg;base64,${data.image}`,
        });
        setError("");
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
        <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">
          Create imaginative and visually stunning images throw DALL-E AI and
          share them with the community.
        </p>
      </div>
      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            label="Your name"
            type="text"
            name="name"
            placeholder=""
            value={form.name}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value });
            }}
          />
        </div>
        <div className="flex flex-col gap-5">
          <FormField
            label="Prompt"
            type="text"
            name="prompt"
            placeholder=""
            value={form.prompt}
            onChange={(e) => {
              setForm({ ...form, prompt: e.target.value });
            }}
            isSurpriseMe
            onSurpriseMe={() => {
              setForm({ ...form, prompt: getRandomPrompt() });
            }}
          />
          <div className="relative bg-grey-50 border border-grey-300 text-grey-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            {form.image ? (
              <img
                src={form.image}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}
            {generating && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            disabled={generating}
          >
            {generating ? "Generating..." : "Generate"}
          </button>
        </div>
        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">
            Once you have created the image you want, you can share it with
            others.
          </p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2 text-center"
            disabled={loading}
          >
            {loading ? "Sharing..." : "Share with others"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default CreatePost;
