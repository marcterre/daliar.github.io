"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ProjectType } from "@/app/page";
import { CldUploadButton } from "next-cloudinary";

const CreateProjectFormComponent = () => {
  const [formData, setFormData] = useState<ProjectType>({
    title: "",
    description: "",
    image: {
      url: "",
      id: "",
    },
  });
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();

    const value = e.target.value;
    const name = e.target.name;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/projects", {
      method: "POST",
      body: JSON.stringify({ formData }),
      headers: {
        "Content-type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Failed to create ticket");
    }

    router.refresh();
    router.push("/");
  };

  return (
    <div className="grid justify-center">
      <h3>Add an image</h3>
      <div>
        <CldUploadButton
          options={{ multiple: true }}
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME}
        />
      </div>
      {/* <form
        onSubmit={handleSubmit}
        method="post"
        className="flex flex-col gap-3 w-1/2"
      >
        <label>Title</label>
        <input
          id="title"
          name="title"
          type="text"
          onChange={handleChange}
          required={true}
          value={formData.title}
        />
        <label>Description</label>
        <textarea
          id="description"
          name="description"
          onChange={handleChange}
          required={true}
          value={formData.description}
          rows={5}
        />
        <label>Image</label>
        <input
          type="submit"
          className="pointer btn max-w-xs"
          value="Create Project"
        />
      </form> */}
    </div>
  );
};

export default CreateProjectFormComponent;
