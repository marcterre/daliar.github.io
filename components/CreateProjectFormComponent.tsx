"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CreateProjectFormComponent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    const name = e.target.name;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
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
    <div className=" flex justify-center">
      <form
        onSubmit={handleSubmit}
        method="post"
        className="flex flex-col gap-3 w-1/2"
      >
        <h3>Create New Ticket</h3>
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
        <input
          type="submit"
          className="pointer btn max-w-xs"
          value="Create Project"
        />
      </form>
    </div>
  );
};

export default CreateProjectFormComponent;
