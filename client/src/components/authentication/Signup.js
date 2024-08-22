import "../../css/Login.css";
import React from "react";
import { useState } from "react";
import { useToast, Spinner } from "@chakra-ui/react";
import axios from "axios";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please select a profile picture",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "yapNation");
      data.append("cloud_name", "db0h15xmi");

      fetch("https://api.cloudinary.com/v1_1/db0h15xmi/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setProfilePic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!username || !email || !password || !password2) {
      toast({
        title: "Please fill in all fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (password !== password2) {
      toast({
        title: "Passwords do not match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      // eslint-disable-next-line
      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        {
          username,
          email,
          password,
          ...(profilePic && { profilePic: profilePic }),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        title: "Account created successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      setUsername("");
      setEmail("");
      setPassword("");
      setPassword2("");
      setProfilePic("");
      // localStorage.setItem("userInfo", JSON.stringify(res.data));
    } catch (err) {
      toast({
        title: "Failed to create account",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="signup">
      <form>
        <label for="chk" aria-hidden="true">
          Sign up
        </label>
        <input
          className="authInput"
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="authInput"
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="authInput"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="authInput"
          type="password"
          name="password2"
          placeholder="Confirm password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />
        <input
          className="authInput"
          type="file"
          name="profilePic"
          onChange={(e) => postDetails(e.target.files[0])}
        />
        <button
          className="loginButton"
          onClick={submitHandler}
          disabled={loading}
        >
          {loading ? <Spinner size="sm" /> : "Sign up"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
