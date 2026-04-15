// import { useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import api from "../Api/api";

// const VerifyEmail = () => {
//   const [params] = useSearchParams();

//   useEffect(() => {
//     const token = params.get("token");

//     const verify = async () => {
//       try {
//         const res = await api.post("/auth/verify-email", { token });
//         alert("Email verified!");
//       } catch (err) {
//         alert("Invalid or expired token");
//       }
//     };

//     if (token) verify();
//   }, []);

//   return <h2>Verifying...</h2>;
// };

// export default VerifyEmail;