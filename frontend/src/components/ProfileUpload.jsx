import API from "../services/api";
import { useState } from "react";

export default function ProfileUpload({ user, setUser }) {
  const [file, setFile] = useState(null);

  const upload = async () => {
    if (!file) return;

    const form = new FormData();
    form.append("avatar", file);

    const res = await API.post("/auth/avatar", form);

    localStorage.setItem("user", JSON.stringify({
      ...user,
      user: res.data
    }));

    setUser(res.data);
  };

  return (
    <div>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={upload}>Upload</button>
    </div>
  );
}
