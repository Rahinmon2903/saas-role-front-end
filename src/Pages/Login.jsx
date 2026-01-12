import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate=useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
            const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("auth", JSON.stringify(res.data));
    navigate("/");
        
    } catch (error) {
        console.log(error)
        
    }

  

    
  };

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto mt-20">
      <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input type="password" value={password} placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)} />
      <button>Login</button>
    </form>
  );
};

export default Login;
